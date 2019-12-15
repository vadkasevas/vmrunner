const describe = require('mocha').describe;
const before = require('mocha').before;
const it = require('mocha').it;

const itAsync = function(name,handler){
    it(name,function(done){
        (async function(){
            let result = null;
            try{
                result = await handler.apply(this);
                done();
            }catch (e) {
                done(e);
            }
        }).apply(this);
    });
};
import should from 'should';

import {VMRunner,VMRunnerContext} from './../index';

describe('VMRunner', ()=>{
    itAsync('Результат кода должен быть верным',async (done)=>{

        let context = new VMRunnerContext()
            .withScopeObj({});
        let runner = new VMRunner(context);
        let result = await runner.run(`1+1`,{});
        should(result).equals(2,'Неверный результат кода');

    });

    itAsync('Переменные глобального контекста доступны в коде',async ()=>{
        let context = new VMRunnerContext()
            .withScopeObj({static:1})
            .withWrapScope();
        let runner = new VMRunner(context);
        let result = await runner.run(`return static;`,{});
        should(result).equals(1,'Неверный результат кода');
    });

    itAsync('Глобальный контекст нельзя изменить',async ()=>{
        let context = new VMRunnerContext()
            .withScopeObj({static:1})
            .withWrapScope(false);
        let runner = new VMRunner(context);
        let result = await runner.run(`static=2; return static;`,{});
        should(context.scopeObj.static).equals(1,'Глобальный контекст изменился');
    });

});