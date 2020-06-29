import _ from 'underscore';
export default function (babel) {
    let parsed = {
        'ArrayExpression':'[]',
        'AssignmentExpression':'arr = 1;',
        'BinaryExpression':'var a = 1+2;',
        InterpreterDirective:'?',
        Directive:'?',
        DirectiveLiteral:'use strict',
        BlockStatement:`for (var i=0;i<10;i++){}`,
        BreakStatement:'while(true){break;}',
        CallExpression:'f.apply();',
        CatchClause:'catch(e){}',
        ConditionalExpression:`i?1:2`,
        ContinueStatement:'while(true){continue;}',
        DebuggerStatement:'debugger',
        DoWhileStatement:' do{ }while(true){',
        EmptyStatement:'label:;',
        ExpressionStatement:'f();'
    }
    _.each(babel.types.TYPES,(type)=>{

    });

    return {
        visitor: {
            Program (program, {opts}) {
                program.traverse ({
                    'La' (path) {
                        console.log(path);
                    }
                });
            }
        }
    }
};