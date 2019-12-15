import {wrapScope, functionFromScript, getScript, convertResult, generateRandomHash} from "./utils";
import MalibunCache from "./MalibunCache";
import _ from 'underscore';
import VMRunnerContext from "./VMRunnerContext";
/**
 * @property {object} global
 * @property {boolean} throw
 * @property {boolean} convertResult
 * @property {UsersModel} user
 * */

class VMRunner{
    /**@param {VMRunnerContext} scopeCtx*/
    constructor(scopeCtx){
        this.withThrow(false)
            .withConvertResult(true)
            .withScopeCtx(scopeCtx||VMRunner.defaultCtx);
    }

    async doConvertResult(result){
        return convertResult(result);
    }

    /**@returns {VMRunner}*/
    withThrow(_throw=true){
        this.throw=_throw;
        return this;
    }

    /**@returns {VMRunner}*/
    withConvertResult(convertResult=true){
        this.convertResult=convertResult;
        return this;
    }

    /**@returns {this}*/
    withScopeCtx(scopeCtx){
        this.scopeCtx = scopeCtx;
        return this;
    }

    /**
     * @returns {Object} scope
     * @returns {Object} scope.vm
     * @returns {Object} scope.original
     */
    get scope(){
        return this.scopeCtx.getScope(this);
    }

    async run(expr,context){
        context = context || {};
        if(!expr&&_.isEmpty(expr))
            return undefined;
        const contextCopy = Object.assign({},context);
        const scope = this.scope;
        const proxy =  new Proxy(context,{
            get: function(target, property) {
                //console.log('proxy get:',property);
                if(contextCopy.hasOwnProperty(property))
                    return contextCopy[property];
                if(context.hasOwnProperty(property))
                    return context[property];
                if(scope.original.hasOwnProperty(property))
                    return scope.original[property];
            },
            set: function (target, key, value, receiver) {
                contextCopy[key]=value;
            },
            getOwnPropertyDescriptor(target, name){
                return Object.getOwnPropertyDescriptor(contextCopy, name);
            },
            ownKeys(target){
                return Object.getOwnPropertyNames(contextCopy);
            },
            defineProperty(target, name, propertyDescriptor){
                return Object.defineProperty(contextCopy,name,propertyDescriptor);
            },
            deleteProperty(target, name){
                return delete contextCopy[name];
            },
            preventExtensions(target){
                return Object.preventExtensions(contextCopy);
            },
            has(target, name){
                return name in contextCopy;
            }
        });
        let f = functionFromScript(expr,scope.vm);
        if(!f)
            return undefined;
        //f = _.bind(f,proxy);
        //VMRunner2.currentFunction = f;
        //const script = getScript(`VMRunner2.currentFunction.apply();`);
        let result;
        try{
            //result = this.probePromise( script.runInContext(scope.vm) );
            result = await f.apply(proxy);
        }catch(e){
            console.error(e);
            result = undefined;
            if(this.throw){
                throw e;
            }
            return result;
        }
        if(this.convertResult)
            return await this.doConvertResult(result);
        else
            return result;
    }
}

VMRunner.defaultCtx = new VMRunnerContext();
export default VMRunner;