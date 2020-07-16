import should from 'should';
import {VMRunner, VMRunnerContext} from '../src';

const describe = require ('mocha').describe;
const before = require ('mocha').before;
const it = require ('mocha').it;
const babelCore = require ("@babel/core")
const babelParser = require ("@babel/parser");
const _ = require ('underscore');

const itAsync = function (name, handler) {
    it (name, function (done) {
        (async function () {
            let result = null;
            try {
                result = await handler.apply (this);
                done ();
            } catch (e) {
                done (e);
            }
        }).apply (this);
    });
};

function vmCodeFrame (expression, line) {
    var codeFrameColumns = require ('@babel/code-frame').codeFrameColumns;
    if (expression) {
        var location = {start: {line: line, column: null}};
        var result = codeFrameColumns (expression, location, {linesAbove: 5});
        return result;
    }
    return '';
}

describe ('VMRunner', () => {

            itAsync('Результат кода должен быть верным',async (done)=>{

                let context = new VMRunnerContext()
                    .withScopeObj({
                        setTimeout:setTimeout,
                        Promise:Promise
                    });
                let runner = new VMRunner(context);
                let result = await runner.run(`1+1`,{});
                should(result).equals(2,'Неверный результат кода');

                result = await runner.run(`const a = 1; let b=1; return a+b;`,{});
                should(result).equals(2,'Неверный результат');

                result = await runner.run(`'item1'`,{});
                should(result).equals('item1','Неверный результат');

                result = await runner.run(`
                    let f = async function(){
                        return await new Promise((resolve,reject)=>{
                            setTimeout(()=>{
                                resolve(1);
                            },100);
                        });
                    }
                    return f();
                `,{});
                should(result).equals(1,'Должны поддерживаться все возможности es6');

                result = await runner.run(`
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
                `);
                (result === undefined).should.be.true('Не должно возвращаться последнее выражение функции');
            });

            itAsync('Переменные локального контекста доступны в коде',async ()=>{
                let context = new VMRunnerContext()
                .withScopeObj({});
                let runner = new VMRunner(context);
                let result = await runner.run(`return this.local;`,{local:1});
                should(result).equals(1,'Неверный результат кода');
            });

            itAsync('Переменные глобального контекста доступны в коде',async ()=>{
                let context = new VMRunnerContext()
                    .withScopeObj({static:1})
                    .withWrapScope();
                let runner = new VMRunner(context);
                let result = await runner.run(`return static;`,{});
                should(result).equals(1,'Неверный результат кода');
            });

            itAsync('Scope нельзя изменить в режиме оборачивания',async ()=>{
                let context = new VMRunnerContext()
                    .withScopeObj({static:1})
                    .withWrapScope(true);
                let runner = new VMRunner(context);
                let result = await runner.run(`static=2; return static;`,{});
                should(result).equals(2,'Результат выполнения должен быть верным');
                should(context.scopeObj.static).equals(1,'Глобальный контекст изменился');
            });

            it('Throw error on error in code',()=>{
                let context = new VMRunnerContext()
                .withScopeObj({
                    Error,
                    setTimeout
                });
                let silentRunner = new VMRunner(context).withThrow(false);
                let throwRunner = new VMRunner(context).withThrow(true);

                return Promise.all([
                    silentRunner.run('d:',{}).should.not.be.rejected(),
                    silentRunner.run(`
                        new Promise((resolve,reject)=>{
                            setTimeout(()=>{
                                reject( new Error('Test') )
                            },1);
                        });
                    `,{}).should.not.be.rejected(),
                    throwRunner.run('d:',{}).should.be.rejected(),
                    throwRunner.run(`
                        new Promise((resolve,reject)=>{
                            setTimeout(()=>{
                                reject( new Error('Test') )
                            },1);
                        });
                    `,{}).should.be.rejected(),
                ]);
            });

            it('return blocks after if',()=>{
                let promises = [];
                let context = new VMRunnerContext()
                .withScopeObj({
                    setTimeout:setTimeout,
                    Promise:Promise
                });

                let runner = new VMRunner(context).withThrow(true);
                promises.push( runner.run(`
                    var a = true;
                    if(a) return 'true'; else return 'false';
                `,{}).should.be.fulfilledWith('true') );

                return Promise.all(promises);
            });

            it('Валидация кода',()=>{
                let context = new VMRunnerContext()
                .withScopeObj({
                    setTimeout:setTimeout,
                    Promise:Promise
                });
                let runner = new VMRunner(context).withThrow(true);
                let validCode = `return 'This is valid js code';`;
                let valid = runner.validate(validCode)
                should(valid).be.true(`Неверная валидация ${validCode}`);

                let invalidCode = `return 'This is NOT valid js code;`;
                should( ()=>{ runner.validate(invalidCode); } ).throw(Error);

            });

            itAsync('Raw object',async ()=>{
                let context = new VMRunnerContext()
                .withScopeObj({});
                let runner = new VMRunner(context).withThrow(true);
                let result = await runner.run(`{}`);
                should(result).eql({},'Неверный результат кода');
                result = await runner.run(`{a:1,b:2,c:3}`);
                should(result).eql({a:1,b:2,c:3},'Неверный результат кода');
                result = await runner.run(`return {a:1,b:2,c:3}`);
                should(result).eql({a:1,b:2,c:3},'Неверный результат кода');
            });

            itAsync('Декораторы должны поддерживаться',async ()=>{
                let context = new VMRunnerContext()
                .withScopeObj({});
                let runner = new VMRunner(context).withThrow(true);
                let result = await runner.run(`
                //import fs from 'fs';
                function decorator(){
                    return fs;
                }
                class Test{
                    //@decorator()
                    method(){

                    }
                }
                return 1;
                `);
                should(result).equals(1,'Неверный результат кода с декораторами');
            });

            it('Проверка трансипляции Babel',()=>{
                var expr = `let BaseMenuContext = this.BaseMenuContext;`;
                let tokens = babelParser.parse(expr, {
                    sourceType: "script",
                    plugins: [
                        ['decorators', { decoratorsBeforeExport: false }]
                    ],
                    allowReturnOutsideFunction:true,
                });

                const { code, map, ast } = babelCore.transformFromAstSync(tokens, expr, {
                    "presets": [["@babel/preset-env",{targets:{node:true,esmodules:false}}]],
                    "plugins": [
                        "@babel/plugin-transform-runtime",
                        ["@babel/plugin-syntax-dynamic-import"],
                        ["@babel/plugin-proposal-optional-chaining"],
                        ["@babel/plugin-proposal-decorators", {"legacy": true}],
                    ],
                    "sourceMaps": false,
                    "retainLines": true
                });
                code.should.be.eql('let BaseMenuContext = this.BaseMenuContext;');
            });


        itAsync ('Trace', async () => {
            var expr = `
                let n = 1;
                let s = 'string'
                trace:;
                console.log('vm2Options:',JSON.stringify(vm2Options));
                return {
                    VM_RUNNER_RUN_ID,
                    VM_RUNNER_HASH
                }
            `
            let context = new VMRunnerContext ()
            .withScopeObj ({
                vmCodeFrame: function vmCodeFrame (expression,line) {
                    var codeFrameColumns = require ('@babel/code-frame').codeFrameColumns;
                    if (expression) {
                        var location = {start: {line: line, column: null}};
                        var result = codeFrameColumns (expression, location, {linesAbove: 5});
                        return result;
                    }
                    return '';
                }
            });

            let runner = new VMRunner (context).withThrow (true);
            let tracePrefix = null;
            let traceData = null;
            let obj1 = await runner.run (expr, {}, {
                trace: {
                    aliases: {
                        trace (message) {
                            tracePrefix = message.prefix;
                            traceData = message.data;
                        }
                    }
                }
            });

            let obj2 = await runner.run (expr, {}, {
                trace: {
                    aliases: {
                        trace (message) {
                            tracePrefix = message.prefix;
                            traceData = message.data;
                        }
                    }
                }
            });

            traceData.n.should.be.eql (1, 'Неверный результат кода');
            traceData.s.should.be.eql ('string', 'Неверный результат кода');

            obj1.VM_RUNNER_RUN_ID.should.not.be.eql (obj2.VM_RUNNER_RUN_ID, 'VM_RUNNER_RUN_ID должен меняться при каждом вызове');
            obj1.VM_RUNNER_HASH.should.be.eql (obj2.VM_RUNNER_HASH, 'VM_RUNNER_HASH не должен меняться при каждом вызове');


        });

        it('Trace messages',async ()=>{
            const expr = `
                var s=1;
                var message = 'SOME MESSAGE';
                trace:\`message is:\${message}\`,'ok'
                debug:'debugMessage'
            `;
            let context = new VMRunnerContext ()
            .withScopeObj ({
                vmCodeFrame: function vmCodeFrame (expression,line) {
                    var codeFrameColumns = require ('@babel/code-frame').codeFrameColumns;
                    if (expression) {
                        var location = {start: {line: line, column: null}};
                        var result = codeFrameColumns (expression, location, {linesAbove: 5});
                        return result;
                    }
                    return '';
                }
            });
            let runner = new VMRunner (context).withThrow (true);


            let traceMessage = null;
            let debugMessage = null;

            let obj2 = await runner.run (expr, {}, {
                trace: {
                    aliases: {
                        trace (message) {
                            traceMessage = message.message;
                        },
                        debug(message){
                            debugMessage = message.message;
                        }
                    }
                }
            });

            traceMessage.should.be.eql (`message is:SOME MESSAGE ok`, 'Сообщение trace');
            debugMessage.should.be.eql (`debugMessage`, 'Сообщение debug');




        });

        itAsync('localScope',async ()=>{
            let context = new VMRunnerContext ()
            .withScopeObj({});
            let runner = new VMRunner (context).withThrow (true);

            let result = await runner.run('return test;',{},{
                localScope:{
                    test:1
                }
            });
            should(result).equals(1,'localScope должен быть доступен в коде');

            let results = [
                await runner.run(`return VM_RUNNER_HASH;`,{},{
                    localScope:{
                        test:1
                    }
                }),
                await runner.run(`return VM_RUNNER_HASH;`,{},{
                    localScope:{
                        test:1
                    }
                }),
                await runner.run(`return VM_RUNNER_HASH;`,{},{
                    localScope:{
                        test2:1
                    }
                }),
            ];

            results[0].should.be.eql (results[1], 'VM_RUNNER_HASH не должен меняться при идентичных localScope keys');
            results[0].should.not.be.eql (results[2], 'VM_RUNNER_HASH должен меняться при различных localScope keys');

        });



});