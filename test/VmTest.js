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

import {VMRunner,VMRunnerContext} from '../lib';

describe('VMRunner', ()=>{

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





});