import fspath from "path";
import _ from 'underscore';
import template from "@babel/template";
import {get} from 'lodash';

const $handled = Symbol ('handled');
const $normalized = Symbol ('normalized');

const PRESERVE_CONTEXTS = normalizeEnv (process.env.TRACE_CONTEXT);
const PRESERVE_FILES = normalizeEnv (process.env.TRACE_FILE);
const PRESERVE_LEVELS = normalizeEnv (process.env.TRACE_LEVEL);

/**
 * Normalize an environment variable, used to override plugin options.
 */
function normalizeEnv (input){
    if (!input) {
        return [];
    }
    return input.split (',')
    .map (context => context.toLowerCase ().trim ())
    .filter (id => id);
}

/**
 * Like `template()` but returns an expression, not an expression statement.
 */
function expression (input, template) {
    const fn = template (input);
    return function (ids) {
        const node = fn (ids);
        return node.expression ? node.expression : node;
    };
}

/**
 * The default log() function.
 */
export function getLogFunction ({types: t, template}, logLevel) {
    return function log (message, metadata) {
        let messageExpression = message.messageExpression;
        let prefix = `${metadata.context}:`;
        if (metadata.indent) {
            prefix += (new Array (metadata.indent + 1)).join ('  ');
        }


        if (t.isSequenceExpression (message.content)) {
            return t.callExpression (
                t.memberExpression (
                    t.identifier ('console'),
                    t.identifier (logLevel)
                ),
                [t.stringLiteral (prefix)].concat (message.content.expressions)
            );
        } else {
            const LINE = metadata.path.node.loc.start.line;
            return expression (`VM_RUNNER_TRACE.apply({line:LINE},[LOGLEVEL, PREFIX, MESSAGE,  DATA])`, template) ({
                LOGLEVEL: t.stringLiteral (logLevel),
                PREFIX: t.stringLiteral (prefix),
                DATA: message.content,
                LINE:t.numericLiteral(LINE),
                VM_RUNNER_TRACE:t.identifier ('VM_RUNNER_TRACE'),
                MESSAGE:messageExpression
            });
        }
    }
}

function generatePrefix (dirname, basename) {
    if (basename !== 'index') {
        return basename;
    }
    basename = fspath.basename (dirname);
    if (basename !== 'src' && basename !== 'lib') {
        return basename;
    }
    return fspath.basename (fspath.dirname (dirname));
}

/**
 * Collect the metadata for a given node path, which will be
 * made available to logging functions.
 */
function collectMetadata (path, opts) {
    const filename = fspath.resolve (process.cwd (), path.hub.file.opts.filename);
    const dirname = fspath.dirname (filename);
    const extname = fspath.extname (filename);
    const basename = fspath.basename (filename, extname);
    const prefix = generatePrefix (dirname, basename);
    const names = [];
    let indent = 0;
    let parent;

    const parentName = path.getAncestry ().slice (1).reduce ((parts, item) => {
        if (item.isClassMethod ()) {
            if (!parent) {
                parent = item;
            }
            parts.unshift (item.node.key.type === 'Identifier' ? item.node.key.name : '[computed method]');
        } else if (item.isClassDeclaration ()) {
            if (!parent) {
                parent = item;
            }
            parts.unshift (item.node.id ? item.node.id.name : `[anonymous class@${item.node.loc.start.line}]`);
        } else if (item.isFunction ()) {
            if (!parent) {
                parent = item;
            }
            parts.unshift ((item.node.id && item.node.id.name) || `[anonymous@${item.node.loc.start.line}]`);
        } else if (item.isProgram ()) {
            if (!parent) {
                parent = item;
            }
        } else if (!parent && !item.isClassBody () && !item.isBlockStatement ()) {
            indent++;
        }
        return parts;
    }, []).join (':');

    let hasStartMessage = false;
    let isStartMessage = false;
    if (parent && !parent.isProgram ()) {
        for (let child of parent.get ('body').get ('body')) {
            if (child.node[$handled]) {
                hasStartMessage = true;
                break;
            }
            if (!child.isLabeledStatement ()) {
                break;
            }
            const label = child.get ('label');
            if (opts.aliases[label.node.name]) {
                hasStartMessage = true;
                if (child.node === path.node) {
                    isStartMessage = true;
                }
                break;
            }
        }
    }

    const context = `${prefix}:${parentName}`;
    return {indent, prefix, parentName, context, hasStartMessage, isStartMessage, filename, dirname, basename, extname, path};
}

/**
 * Determine whether the given logging statement should be stripped.
 */
function shouldStrip (name, metadata, {strip}) {
    switch (typeof strip) {
        case 'boolean':
            if (!strip) return false;
            // strip === true
            break;
        case 'object':
            const se = strip[name];
            if (!se || (typeof se === 'object' && !se[process.env.NODE_ENV])) return false;
            // strip[name] === true || strip[name][env] === true
            break;
        default:
            return false;
    }
    if (PRESERVE_CONTEXTS.length) {
        const context = metadata.context.toLowerCase ();
        if (PRESERVE_CONTEXTS.some (pc => context.includes (pc))) return false;
    }
    if (PRESERVE_FILES.length) {
        const filename = metadata.filename.toLowerCase ();
        if (PRESERVE_FILES.some (pf => filename.includes (pf))) return false;
    }
    if (PRESERVE_LEVELS.length) {
        const level = name.toLowerCase ();
        if (PRESERVE_LEVELS.some (pl => level === pl)) return false;
    }
    return true;
}

export function handleLabeledStatement (babel, path, opts) {
    const t = babel.types;
    const label = path.get ('label');
    opts = (function normalizeOpts (babel, opts) {
        if (opts[$normalized]) {
            return opts;
        }
        if (!opts.aliases) {
            opts.aliases = {
                log: getLogFunction (babel, 'log'),
                trace: getLogFunction (babel, 'trace'),
                warn: getLogFunction (babel, 'warn'),
                error:getLogFunction(babel,'error'),
                debug:getLogFunction(babel,'debug')
            };
        } else {
            Object.keys (opts.aliases).forEach (key => {
                if (typeof opts.aliases[key] === 'string' && opts.aliases[key]) {
                    const expr = expression (opts.aliases[key], babel.template);
                    opts.aliases[key] = (message) => expr (message);
                }
            });
        }
        if (opts.strip === undefined) {
            opts.strip = {
                log: {production: true},
                trace: false,
                warn: {production: true}
            };
        }
        opts[$normalized] = true;
        return opts;
    })(babel, opts);

    const labelName = label.node.name;
    const variables =  [];

    const methodPath = get(path,'parentPath.parentPath',null);
    if(methodPath &&['ClassMethod','ObjectMethod'].indexOf(methodPath.type)>-1&&!methodPath.node.static){
        variables.push('this');
    }
    _.each( path.scope.bindings , (val,key)=>{
        if(variables.indexOf(key)==-1)
            variables.push(key);
    });


    const alias = opts.aliases[labelName]
    if (!alias) {
        return;
    }
    const metadata = collectMetadata (path, opts);
    if (shouldStrip (label.node.name, metadata, opts)) {
        path.remove ();
        return;
    }

    path.traverse ({
        "EmptyStatement" (emptyStatement){
            let properties = _.map (variables, (varName) => {
                let key = t.Identifier (varName);
                let value;
                if(varName!='this') {
                    value = t.Identifier (varName);
                }else{
                    value = t.thisExpression();
                }
                return t.objectProperty (key, value, false);
            });
            let replacement = t.objectExpression (properties);
            replacement[$handled] = true;
            emptyStatement.replaceWith (replacement);
        },
        /*"TemplateLiteral|StringLiteral"(item){

        },*/
        "VariableDeclaration|Function|AssignmentExpression|UpdateExpression|YieldExpression|ReturnStatement" (item) {
            throw path.buildCodeFrameError (`Logging statements cannot have side effects. ${item.type}`);
        },
        ExpressionStatement (statement) {
            if (statement.node[$handled]) {
                return;
            }
            let targetNode = statement.get ('expression').node;
            const messageElements = [];
            if(targetNode.type==='SequenceExpression'){
                let properties = _.chain(targetNode.expressions).map((expressionNode) => {
                    if(['Identifier','ThisExpression'].indexOf(expressionNode.type)>-1){
                        let varName = expressionNode.type==='Identifier'?expressionNode.name:'this';
                        let key = t.Identifier (varName);
                        let value;
                        if(expressionNode.type==='Identifier') {
                            value = t.Identifier (varName);
                        }else{
                            value = t.thisExpression();
                        }
                        return t.objectProperty (key, value, false);
                    }else if(['StringLiteral','TemplateLiteral'].indexOf(expressionNode.type)>-1){
                        messageElements.push(expressionNode);
                    }
                }).compact().value();
                if( _.isEmpty(properties) && !_.isEmpty(messageElements) ){
                    let properties = _.map (variables, (varName) => {
                        let key = t.Identifier (varName);
                        let value;
                        if(varName!='this') {
                            value = t.Identifier (varName);
                        }else{
                            value = t.thisExpression();
                        }
                        return t.objectProperty (key, value, false);
                    });
                    targetNode = t.objectExpression (properties);
                }
                else
                    targetNode = t.objectExpression (properties);
            }else if(['TemplateLiteral','StringLiteral'].indexOf(targetNode.type)>-1){
                messageElements.push(targetNode);

                let properties = _.map (variables, (varName) => {
                    let key = t.Identifier (varName);
                    let value;
                    if(varName!='this') {
                        value = t.Identifier (varName);
                    }else{
                        value = t.thisExpression();
                    }
                    return t.objectProperty (key, value, false);
                });
                targetNode = t.objectExpression (properties);
            }


            const messageExpression = t.callExpression(
                t.memberExpression(
                    t.arrayExpression(messageElements),//object
                    t.identifier('join'),//property
                    false//computed
                )
                , [
                    t.stringLiteral(' ')
                ]);

            const message = {
                messageExpression,
                prefix: t.stringLiteral (metadata.prefix),
                content: targetNode,
                hasStartMessage: t.booleanLiteral (metadata.hasStartMessage),
                isStartMessage: t.booleanLiteral (metadata.isStartMessage),
                indent: t.numericLiteral (metadata.indent),
                parentName: t.stringLiteral (metadata.parentName),
                filename: t.stringLiteral (metadata.filename),
                dirname: t.stringLiteral (metadata.dirname),
                basename: t.stringLiteral (metadata.basename),
                extname: t.stringLiteral (metadata.extname)
            };
            const replacement = t.expressionStatement (alias (message, metadata));
            replacement[$handled] = true;
            statement.replaceWith (replacement);
        }
    });

    if (path.node) {
        if (path.get ('body').isBlockStatement ()) {
            path.replaceWithMultiple (path.get ('body').node.body);
        } else {
            path.replaceWith (path.get ('body').node);
        }
    }
}
const wrapVmRunner = template (`
let VM_RUNNER_RUN_ID = '';

function generateUid(){
    var u='',i=0; var four = 4;
    var pattern = 'xxxxxxxx-xxxx-'+four+'xxx-yxxx-xxxxxxxxxxxx';
    while(i++<36) {
        var c=pattern[i-1],
        r=Math.random()*16|0,v=c=='x'?r:(r&0x3|0x8);
        u+=(c=='-'||c==four)?c:v.toString(16)
    }
    return u;
} 

if( typeof(vm2Options)==='undefined' ){
  vm2Options = {};
}
let VM_RUNNER_HASH = vm2Options.VM_RUNNER_HASH;
let customOptions = vm2Options.customOptions || {};
let traceOptions = customOptions.trace||{};
let vm2Expression = vm2Options.expression || null;
vm2Expression = String(vm2Expression);


let VM_RUNNER_TRACE = function(logLevel,prefix,message,data){
    var alias = traceOptions && traceOptions.aliases && traceOptions.aliases[logLevel] ;
    var messageObj = {
        frame:vmCodeFrame(vm2Expression,this.line),
        prefix:prefix,
        message:message,
        logLevel:logLevel,
        data:data,
        line:this.line,
        date:new Date()
    }
    if( alias ){
        try{
            return alias.apply(this,[messageObj]);
        }catch(e){
            console.error(e);
        }
    }
};

return (function vmRunnerWrapper() {
    VM_RUNNER_RUN_ID = generateUid();
    
    BODY;
}).apply(this);
`);

export default function (babel) {
    return {
        visitor: {
            Program (program, {opts}) {
                program.traverse ({
                    LabeledStatement (path) {
                        handleLabeledStatement (babel, path, opts);
                    }
                });

                if (!program.vmRunnerWrapper) {
                    program.vmRunnerWrapper = true;
                    var wrapped = wrapVmRunner ({
                        BODY: program.node.body,
                        VM_RUNNER_RUN_ID:babel.types.identifier ('VM_RUNNER_RUN_ID'),
                        VM_RUNNER_HASH:babel.types.identifier ('VM_RUNNER_HASH'),
                        VM_RUNNER_TRACE:babel.types.identifier ('VM_RUNNER_TRACE'),
                    });

                    program.replaceWith (
                        babel.types.program (wrapped)
                    );
                }
                program.node.directives = [];

            }
        }
    };
}
