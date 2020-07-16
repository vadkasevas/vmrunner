import {VMRunner, VMRunnerContext} from "./index";
function vmCodeFrame (expression, line) {
    var codeFrameColumns = require ('@babel/code-frame').codeFrameColumns;
    if (expression) {
        var location = {start: {line: line, column: null}};
        var result = codeFrameColumns (expression, location, {linesAbove: 5});
        return result;
    }
    return '';
}
const _ = require ('underscore');

var f = async () => {
    let context = new VMRunnerContext ()
    .withScopeObj ({
        Object,
        //Function,
        Array,
        Number,
        parseFloat,
        parseInt,
        'Infinity': Infinity,
        'NaN': NaN,
        'undefined': void 0,
        'Boolean': Boolean,
        'String': String,
        'Symbol': Symbol,
        'Date': Date,
        'RegExp': RegExp,
        'Error': Error,
        'EvalError': EvalError,
        'RangeError': RangeError,
        'ReferenceError': ReferenceError,
        'SyntaxError': SyntaxError,
        'TypeError': TypeError,
        'URIError': URIError,
        'JSON': JSON,
        'Math': Math,
        'console': console,
        'Intl': Intl,
        'ArrayBuffer': ArrayBuffer,
        'Uint8Array': Uint8Array,
        'Int8Array': Int8Array,
        'Uint16Array': Uint16Array,
        'Int16Array': Int16Array,
        'Uint32Array': Uint32Array,
        'Int32Array': Int32Array,
        'Float32Array': Float32Array,
        'Float64Array': Float64Array,
        'Uint8ClampedArray': Uint8ClampedArray,
        'DataView': DataView,
        'Map': Map,
        'Set': Set,
        'WeakMap': WeakMap,
        'WeakSet': WeakSet,
        'Proxy': Proxy,
        'Reflect': Reflect,
        'decodeURI': decodeURI,
        'decodeURIComponent': decodeURIComponent,
        'encodeURI': encodeURI,
        'encodeURIComponent': encodeURIComponent,
        'escape': escape,
        'unescape': unescape,
        'isFinite': isFinite,
        'isNaN': isNaN,
        'WebAssembly': WebAssembly,
        'Buffer': Buffer,
        'clearImmediate': clearImmediate,
        'clearInterval': clearInterval,
        'clearTimeout': clearTimeout,
        'setImmediate': setImmediate,
        'setInterval': setInterval,
        'setTimeout': setTimeout,
        Promise: Promise,
        vmCodeFrame,
        _
    });
    let runner = new VMRunner (context).withThrow (true);

    let result = await runner.run(`
    class Test{
        test(){
            this.value();
        }
        
        value(){
            return 1;
        }
    }
    
    const test = new Test();
    test.test();
    
    `,{});

    console.log(result);

    let promises = [];
    for (var j = 0; j < 2000; j++) {
        let i = _.random (0, 1000);
        ((i) => {
            let expression = `
                        //console.log('vm2Options:',_.size(vm2Options));
                        //i${i}
                        var i = ${i};
                        trace:i,vm2Expression,VM_RUNNER_HASH;
                        return {i,VM_RUNNER_HASH};
                        return new Promise((resolve,reject)=>{
                            if( vm2Expression.indexOf('//i${i}') ==-1){
                                throw new Error(vm2Expression);
                            }
                            setTimeout( ()=>{
                                return resolve({i,VM_RUNNER_HASH});
                            },_.random(0,100))
                        });
                        `;
            let promise = runner.run (expression, {}, {
                trace: {
                    aliases: {
                        trace (message) {
                            if(expression!==message.data.vm2Expression){
                                console.error(`${message.data.vm2Expression}`);
                            }
                            if(message.data.i!==i){
                                console.error(`${message.data.i}!==${i}`);
                            }
                        }
                    }
                }
            });

            promise.then ((vmResult) => {
                vmResult.realI = i;
                //console.log (`vmResult:${JSON.stringify(vmResult)}, i:${i}`);
            });
            promises.push (promise);
        }) (i);
    }
    let results = await Promise.all (promises);
    //global.gc();
    console.log (JSON.stringify (results));
}
setInterval (() => {
    f ();
}, 1 * 1000)
f ();