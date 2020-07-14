import _ from 'underscore';

import md5 from 'md5';
import EJSON from 'ejson';
import vm from 'vm';

const esprima = require('esprima');
const escodegen = require('escodegen');
import MalibunCache from "./MalibunCache";
import cachedRegExp from './cachedRegExp';

const functionGenerator = new vm.Script( `new Function( 'vm2Options', vm2Code );` );
const scriptCache = new MalibunCache();
const re = cachedRegExp(/^([\s\t\n\r]*return[\s\t\n\r]*)?(\{[\s\S]*\})([\s\t\n\r;]?$)/);
const babelParser = require("@babel/parser");
import babelGenerate from '@babel/generator';
const babelCore = require("@babel/core")
import vmBabelPlugin from './babel-plugin';
import returnLastBabelPlugin from './return-last-babel-plugin';
function generateRandomHash() {
    return md5(_.random(100000000) + '_' + _.random(100000000) + '_' + Date.now());
}
import NodeCache from 'node-cache';

const fbCache = new NodeCache({
    stdTTL:5*60,
    checkperiod:Math.ceil(60),
    useClones:false,
    deleteOnExpire:true
});

const functionFromScript = function(expr,vmCtx,options={}){
    let originalExpr = expr;
    let vm2Options = {};
    let vm2OptionsHash = options.__vmRunnerHash?options.__vmRunnerHash:md5(JSON.stringify(options));
    vm2Options.customOptions = options;
    const useCache = true;

    let key = md5( expr+':'+vmCtx.__vmRunnerHash  );
    vm2Options.VM_RUNNER_HASH = key;
    vm2Options.expression = originalExpr;
    if(!useCache||!fbCache.get(key)) {
        if(re.test(expr)){
            re.lastIndex = 0;
            expr = expr.replace(re,(m,prefix,body,suffix)=>{
                if(prefix===undefined)
                    prefix = '';
                if(suffix===undefined)
                    suffix = '';
                return `${prefix} new Object(${body})${suffix}`;
            });
        }

        let tokens = babelParser.parse(expr, {
            sourceType: "script",
            plugins: [
                ['decorators', { decoratorsBeforeExport: false }]
            ],
            allowReturnOutsideFunction:true,
        });

        const { code, map, ast } = babelCore.transformFromAstSync(tokens, expr, {
            filename: options.filename||'vmrunner.js',
            babelrc: false,
            configFile: false,
            "presets": [["@babel/preset-env",{targets:{node:true,esmodules:false}}]],
            "plugins": [
                ['babel-plugin-transform-line'],
                [vmBabelPlugin],
                [returnLastBabelPlugin,{ topLevel: true }],
                "@babel/plugin-transform-runtime",
                ["@babel/plugin-syntax-dynamic-import"],
                ["@babel/plugin-proposal-optional-chaining"],
                ["@babel/plugin-proposal-decorators", {"legacy": true}],
            ],
            //"sourceMaps": 'inline',
            "retainLines": true
        });
        //console.log(code);
        //console.log(map);
        vmCtx.vm2Code = code;
        let f = functionGenerator.runInContext ( vmCtx );
        fbCache.set(key, f, 5 * 60);
    }
    return {
        f:fbCache.get(key),
        vm2Options:vm2Options
    };
};


/**
 * @returns {Object} scope
 * @returns {Object} scope.vm
 * @returns {Object} scope.original
 * @param {VMRunner} runner
 * */
function wrapScope(scope,runner,vm2Options){
    let scopeCopy = {};//Object.assign({},scope);

    _.each(scope,(instance,key)=>{
        let wrapped = null;
        if(_.isObject(instance) ){
            wrapped = new Proxy(instance,{
                get: function(target, property) {
                    return target[property];
                },
                set: function (target, key, value, receiver) {
                    //console.log('set key:',key,'value:',value);
                },
                getOwnPropertyDescriptor(target, name){
                    return Object.getOwnPropertyDescriptor(target, name);
                },
                ownKeys(target){
                    return Object.getOwnPropertyNames(target);
                },
                defineProperty(target, name, propertyDescriptor){

                },
                deleteProperty(target, name){

                },
                preventExtensions(target){

                },
                has(target, name){
                    return name in target;
                }
            });
        }else{
            wrapped = instance;
        }
        scopeCopy[key] = wrapped;
    });

    scopeCopy.vm2Options = vm2Options;

    let vmContext = vm.createContext( scopeCopy );
    return {
        vm:vmContext,
        original:scopeCopy
    }
}

function getScript(code){
    if(!_.isString(code)||!code){
        return null;
    }
    if(!scriptCache.has(code)){
        try {
            const script = new vm.Script(code);
            scriptCache.set(code, script, 5 * 60 * 1000);
        }catch(e){
            return null;
        }
    }
    return scriptCache.get(code);
}

async function convertResult(result){
    let converted = result;
    if(_.isDate(result)){
        converted = new Date( result.getTime() );
    }else if(result && _.isFunction(result.then)){
        converted = await result;
    }else if(result&&typeof result=='object'){
        converted = EJSON.clone(result);
        function check(target,source,key){
            let val = source[key];
            if(typeof val=='function'){
                target[key]=val;
            }else if(_.isDate(val)){
                target[key] = new Date( val );
            }else if(_.isArray(val)||_.isObject(val)){
                _.each(_.keys(val),(valKey)=>{
                    check( target[key] , val, valKey);
                });
            }
        }
        _.each(_.keys(result),(key)=>{
            check(converted,result,key);
        });
    }
    return converted;
}

function wrapInProxy(instance){
    return new Proxy(instance,{
        get: function(target, property) {
            return target[property];
        },
        set: function (target, key, value, receiver) {

        },
        getOwnPropertyDescriptor(target, name){
            return Object.getOwnPropertyDescriptor(target, name);
        },
        ownKeys(target){
            return Object.getOwnPropertyNames(target);
        },
        defineProperty(target, name, propertyDescriptor){

        },
        deleteProperty(target, name){

        },
        preventExtensions(target){

        },
        has(target, name){
            return name in target;
        }
    });
}


export {
    wrapScope,getScript,functionFromScript,convertResult,generateRandomHash,wrapInProxy
}

