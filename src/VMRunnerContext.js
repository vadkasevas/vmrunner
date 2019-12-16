import {generateRandomHash, wrapScope} from "./utils";
import MalibunCache from "./MalibunCache";
import vm from "vm";

const HASH_KEY = '__vmRunnerHash';

export default class VMRunnerContext{
    constructor(){
        this.scopeObj = null;
        this.wrapScope = false;
        this.scopeCache = new MalibunCache();
        this.scopeCacheTtl = 10*60*1000;
    }

    /**@returns {this}*/
    withScopeObj(scope){
        this.scopeObj = scope;
        return this;
    }

    /**@returns {this}*/
    withWrapScope(wrap=true){
        this.wrapScope=wrap;
        return this;
    }

    /**@returns {this}*/
    withScopeCacheTtl(scopeCacheTtl){
        this.scopeCacheTtl = scopeCacheTtl;
        return this;
    }

    doWrapScope(scopeObj,runner){
        let hash = scopeObj[HASH_KEY];
        if(!hash){
            hash = generateRandomHash()
        }
        return wrapScope( scopeObj , runner , {hash:hash} );
    }

    /**
     * @property {VMRunner} runner
     * @returns {Object} scope
     * @returns {Object} scope.vm
     * @returns {Object} scope.original
     */
    getScope(runner){
        if(this.scopeObj&&this.wrapScope) {
            let hash = this.scopeObj[HASH_KEY];
            if (!hash) {
                hash = `${generateRandomHash()}:`;
                try {
                    Object.defineProperty(this.scopeObj, HASH_KEY, {
                        configurable: false,
                        enumerable: false,
                        value: hash
                    });
                } catch (e) {

                }
            }
            if(this.scopeObj[HASH_KEY]&&this.scopeCacheTtl) {
                if(!this.scopeCache.has(this.scopeObj[HASH_KEY])) {
                    this.scopeCache.set( this.scopeObj[HASH_KEY] , this.doWrapScope(this.scopeObj,runner),this.scopeCacheTtl );
                }
                return this.scopeCache.get(this.scopeObj[HASH_KEY]);
            }else
                return this.doWrapScope(this.scopeObj,runner);
        }
        let vmContext = vm.createContext( this.scopeObj );
        return {
            vm:vmContext,
            original:this.scopeObj
        }

    }
}