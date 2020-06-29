import {wrapScope, functionFromScript, getScript, convertResult, generateRandomHash} from "./utils";
import MalibunCache from "./MalibunCache";
import _ from 'underscore';
import VMRunnerContext from "./VMRunnerContext";
import EventEmitter from 'events';
/**
 * @property {object} global
 * @property {boolean} throw
 * @property {boolean} convertResult
 * @property {UsersModel} user
 * */

class VMRunner extends EventEmitter{
    /**@param {VMRunnerContext} scopeCtx*/
    constructor(scopeCtx){
        super();
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

    validate(expression){
        const scope = this.scope;
        let f = functionFromScript(expression,scope.vm);
        return true;
    }

    async run(expression,context,options={}){
        context = context || {};
        if(!expression&&_.isEmpty(expression))
            return undefined;
        const scope = this.scope;
        let result = undefined;
        let f = null;
        try {
            f = functionFromScript(expression,scope.vm,options);
        }catch (e) {
            if(this.listenerCount('error')>0){
                this.emit('error',e,{
                    expression,
                    context,
                    scope:scope.vm,
                    scopeOriginal:scope.original
                })
            }
            if(this.throw){
                throw e;
            }
            return result;
        }
        if(!f)
            return undefined;
        try{
            result = await f.apply(context);
        }catch(e){
            if(this.listenerCount('error')>0){
                this.emit('error',e,{
                    expression,
                    context,
                    scope:scope.vm,
                    scopeOriginal:scope.original
                })
            }
            if(this.throw){
                throw e;
            }
            return result;
        }
        if(this.convertResult)
            result = await this.doConvertResult(result);
            if(this.listenerCount('result')>0){
                this.emit('result',result,{
                    expression,
                    context,
                    scope:scope.vm,
                    scopeOriginal:scope.original
                });
            }
        else {
            if(this.listenerCount('result')>0){
                this.emit('result',result,{
                    expression,
                    context,
                    scope:scope.vm,
                    scopeOriginal:scope.original
                });
            }
            return result;
        }
    }
}

VMRunner.defaultCtx = new VMRunnerContext();
export default VMRunner;