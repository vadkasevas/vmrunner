"use strict";var _interopRequireDefault3 = require("@babel/runtime/helpers/interopRequireDefault");var _interopRequireDefault2 = _interopRequireDefault3(require("@babel/runtime/helpers/interopRequireDefault"));Object.defineProperty(exports, "__esModule", { value: true });var _typeof2 = require("@babel/runtime/helpers/typeof");var _typeof = (0, _interopRequireDefault2["default"])(_typeof2)["default"];exports.





































getLogFunction = getLogFunction;exports.











































































































































handleLabeledStatement = handleLabeledStatement;exports["default"] =




























































































































































































































function (babel) {
  return {
    visitor: {
      Program: function Program(program, _ref3) {var opts = _ref3.opts;
        program.traverse({
          DirectiveLiteral: function DirectiveLiteral(path) {
            if (_.isEmpty(program.node.body)) {
              var returnStatement = babel.types.returnStatement(babel.types.stringLiteral(path.node.value));
              program.unshiftContainer('body', returnStatement);
            }
          },
          LabeledStatement: function LabeledStatement(path) {
            handleLabeledStatement(babel, path, opts);
          } });


        if (!program.vmRunnerWrapper) {
          program.vmRunnerWrapper = true;
          var wrapped = wrapVmRunner({
            BODY: program.node.body,
            VM_RUNNER_RUN_ID: babel.types.identifier('VM_RUNNER_RUN_ID'),
            VM_RUNNER_HASH: babel.types.identifier('VM_RUNNER_HASH'),
            VM_RUNNER_TRACE: babel.types.identifier('VM_RUNNER_TRACE') });


          program.replaceWith(
          babel.types.program(wrapped));

        }
        program.node.directives = [];

      } } };


};var _path = require("path");var fspath = (0, _interopRequireDefault2["default"])(_path)["default"];var _underscore = require("underscore");var _ = (0, _interopRequireDefault2["default"])(_underscore)["default"];var _template = require("@babel/template");var template = (0, _interopRequireDefault2["default"])(_template)["default"];var _lodash = require("lodash");var get = _lodash.get;var $handled = Symbol('handled');var $normalized = Symbol('normalized');var PRESERVE_CONTEXTS = normalizeEnv(process.env.TRACE_CONTEXT);var PRESERVE_FILES = normalizeEnv(process.env.TRACE_FILE);var PRESERVE_LEVELS = normalizeEnv(process.env.TRACE_LEVEL); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * Normalize an environment variable, used to override plugin options.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   */function normalizeEnv(input) {if (!input) {return [];}return input.split(',').map(function (context) {return context.toLowerCase().trim();}).filter(function (id) {return id;});} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        * Like `template()` but returns an expression, not an expression statement.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        */function expression(input, template) {var fn = template(input);return function (ids) {var node = fn(ids);return node.expression ? node.expression : node;};} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        * The default log() function.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        */function getLogFunction(_ref, logLevel) {var t = _ref.types,template = _ref.template;return function log(message, metadata) {var messageExpression = message.messageExpression;var prefix = "".concat(metadata.context, ":");if (metadata.indent) {prefix += new Array(metadata.indent + 1).join('  ');}if (t.isSequenceExpression(message.content)) {return t.callExpression(t.memberExpression(t.identifier('console'), t.identifier(logLevel)), [t.stringLiteral(prefix)].concat(message.content.expressions));} else {var LINE = metadata.path.node.loc.start.line;return expression("VM_RUNNER_TRACE.apply({line:LINE},[LOGLEVEL, PREFIX, MESSAGE,  DATA])", template)({ LOGLEVEL: t.stringLiteral(logLevel), PREFIX: t.stringLiteral(prefix), DATA: message.content, LINE: t.numericLiteral(LINE), VM_RUNNER_TRACE: t.identifier('VM_RUNNER_TRACE'), MESSAGE: messageExpression });}};}function generatePrefix(dirname, basename) {if (basename !== 'index') {return basename;}basename = fspath.basename(dirname);if (basename !== 'src' && basename !== 'lib') {return basename;}return fspath.basename(fspath.dirname(dirname));} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Collect the metadata for a given node path, which will be
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * made available to logging functions.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */function collectMetadata(path, opts) {var filename = fspath.resolve(process.cwd(), path.hub.file.opts.filename);var dirname = fspath.dirname(filename);var extname = fspath.extname(filename);var basename = fspath.basename(filename, extname);var prefix = generatePrefix(dirname, basename);var names = [];var indent = 0;var parent;var parentName = path.getAncestry().slice(1).reduce(function (parts, item) {if (item.isClassMethod()) {if (!parent) {parent = item;}parts.unshift(item.node.key.type === 'Identifier' ? item.node.key.name : '[computed method]');} else if (item.isClassDeclaration()) {if (!parent) {parent = item;}parts.unshift(item.node.id ? item.node.id.name : "[anonymous class@".concat(item.node.loc.start.line, "]"));} else if (item.isFunction()) {if (!parent) {parent = item;}parts.unshift(item.node.id && item.node.id.name || "[anonymous@".concat(item.node.loc.start.line, "]"));} else if (item.isProgram()) {if (!parent) {parent = item;}} else if (!parent && !item.isClassBody() && !item.isBlockStatement()) {indent++;}return parts;}, []).join(':');var hasStartMessage = false;var isStartMessage = false;if (parent && !parent.isProgram()) {var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {for (var _iterator = parent.get('body').get('body')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var child = _step.value;if (child.node[$handled]) {hasStartMessage = true;break;}if (!child.isLabeledStatement()) {break;}var label = child.get('label');if (opts.aliases[label.node.name]) {hasStartMessage = true;if (child.node === path.node) {isStartMessage = true;}break;}}} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator["return"] != null) {_iterator["return"]();}} finally {if (_didIteratorError) {throw _iteratorError;}}}}var context = "".concat(prefix, ":").concat(parentName);return { indent: indent, prefix: prefix, parentName: parentName, context: context, hasStartMessage: hasStartMessage, isStartMessage: isStartMessage, filename: filename, dirname: dirname, basename: basename, extname: extname, path: path };} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Determine whether the given logging statement should be stripped.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */function shouldStrip(name, metadata, _ref2) {var strip = _ref2.strip;switch (_typeof(strip)) {case 'boolean':if (!strip) return false; // strip === true
      break;case 'object':var se = strip[name];if (!se || _typeof(se) === 'object' && !se[process.env.NODE_ENV]) return false; // strip[name] === true || strip[name][env] === true
      break;default:return false;}if (PRESERVE_CONTEXTS.length) {var context = metadata.context.toLowerCase();if (PRESERVE_CONTEXTS.some(function (pc) {return context.includes(pc);})) return false;}if (PRESERVE_FILES.length) {var filename = metadata.filename.toLowerCase();if (PRESERVE_FILES.some(function (pf) {return filename.includes(pf);})) return false;}if (PRESERVE_LEVELS.length) {var level = name.toLowerCase();if (PRESERVE_LEVELS.some(function (pl) {return level === pl;})) return false;}return true;}function handleLabeledStatement(babel, path, opts) {var t = babel.types;var label = path.get('label');opts = function normalizeOpts(babel, opts) {if (opts[$normalized]) {return opts;}if (!opts.aliases) {opts.aliases = { log: getLogFunction(babel, 'log'), trace: getLogFunction(babel, 'trace'), warn: getLogFunction(babel, 'warn'), error: getLogFunction(babel, 'error'), debug: getLogFunction(babel, 'debug') };} else {Object.keys(opts.aliases).forEach(function (key) {if (typeof opts.aliases[key] === 'string' && opts.aliases[key]) {var expr = expression(opts.aliases[key], babel.template);opts.aliases[key] = function (message) {return expr(message);};}});}if (opts.strip === undefined) {opts.strip = { log: { production: true }, trace: false, warn: { production: true } };}opts[$normalized] = true;return opts;}(babel, opts);var labelName = label.node.name;var variables = [];var methodPath = get(path, 'parentPath.parentPath', null);if (methodPath && ['ClassMethod', 'ObjectMethod'].indexOf(methodPath.type) > -1 && !methodPath.node["static"]) {variables.push('this');}_.each(path.scope.bindings, function (val, key) {if (variables.indexOf(key) == -1) variables.push(key);});var alias = opts.aliases[labelName];if (!alias) {return;}var metadata = collectMetadata(path, opts);if (shouldStrip(label.node.name, metadata, opts)) {path.remove();return;}path.traverse({ "EmptyStatement": function EmptyStatement(emptyStatement) {var properties = _.map(variables, function (varName) {var key = t.Identifier(varName);var value;if (varName != 'this') {value = t.Identifier(varName);} else {value = t.thisExpression();}return t.objectProperty(key, value, false);});var replacement = t.objectExpression(properties);replacement[$handled] = true;emptyStatement.replaceWith(replacement);}, /*"TemplateLiteral|StringLiteral"(item){
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  },*/"VariableDeclaration|Function|AssignmentExpression|UpdateExpression|YieldExpression|ReturnStatement": function VariableDeclarationFunctionAssignmentExpressionUpdateExpressionYieldExpressionReturnStatement(item) {throw path.buildCodeFrameError("Logging statements cannot have side effects. ".concat(item.type));}, ExpressionStatement: function ExpressionStatement(statement) {if (statement.node[$handled]) {return;}var targetNode = statement.get('expression').node;var messageElements = [];if (targetNode.type === 'SequenceExpression') {var properties = _.chain(targetNode.expressions).map(function (expressionNode) {if (['Identifier', 'ThisExpression'].indexOf(expressionNode.type) > -1) {var varName = expressionNode.type === 'Identifier' ? expressionNode.name : 'this';var key = t.Identifier(varName);var value;if (expressionNode.type === 'Identifier') {value = t.Identifier(varName);} else {value = t.thisExpression();}return t.objectProperty(key, value, false);} else if (['StringLiteral', 'TemplateLiteral'].indexOf(expressionNode.type) > -1) {messageElements.push(expressionNode);}}).compact().value();if (_.isEmpty(properties) && !_.isEmpty(messageElements)) {var _properties = _.map(variables, function (varName) {var key = t.Identifier(varName);var value;if (varName != 'this') {value = t.Identifier(varName);} else {value = t.thisExpression();}return t.objectProperty(key, value, false);});targetNode = t.objectExpression(_properties);} else targetNode = t.objectExpression(properties);} else if (['TemplateLiteral', 'StringLiteral'].indexOf(targetNode.type) > -1) {messageElements.push(targetNode);var _properties2 = _.map(variables, function (varName) {var key = t.Identifier(varName);var value;if (varName != 'this') {value = t.Identifier(varName);} else {value = t.thisExpression();}return t.objectProperty(key, value, false);});targetNode = t.objectExpression(_properties2);}var messageExpression = t.callExpression(t.memberExpression(t.arrayExpression(messageElements), //object
      t.identifier('join'), //property
      false //computed
      ), [t.stringLiteral(' ')]);var message = { messageExpression: messageExpression, prefix: t.stringLiteral(metadata.prefix), content: targetNode, hasStartMessage: t.booleanLiteral(metadata.hasStartMessage), isStartMessage: t.booleanLiteral(metadata.isStartMessage), indent: t.numericLiteral(metadata.indent), parentName: t.stringLiteral(metadata.parentName), filename: t.stringLiteral(metadata.filename), dirname: t.stringLiteral(metadata.dirname), basename: t.stringLiteral(metadata.basename), extname: t.stringLiteral(metadata.extname) };var replacement = t.expressionStatement(alias(message, metadata));replacement[$handled] = true;statement.replaceWith(replacement);} });if (path.node) {if (path.get('body').isBlockStatement()) {path.replaceWithMultiple(path.get('body').node.body);} else {path.replaceWith(path.get('body').node);}}}var wrapVmRunner = template("\nlet VM_RUNNER_RUN_ID = '';\n\nfunction generateUid(){\n    var u='',i=0; var four = 4;\n    var pattern = 'xxxxxxxx-xxxx-'+four+'xxx-yxxx-xxxxxxxxxxxx';\n    while(i++<36) {\n        var c=pattern[i-1],\n        r=Math.random()*16|0,v=c=='x'?r:(r&0x3|0x8);\n        u+=(c=='-'||c==four)?c:v.toString(16)\n    }\n    return u;\n} \n\nif( typeof(vm2Options)==='undefined' ){\n  vm2Options = {};\n}\nlet VM_RUNNER_HASH = vm2Options.VM_RUNNER_HASH;\nlet customOptions = vm2Options.customOptions || {};\nlet traceOptions = customOptions.trace||{};\nlet vm2Expression = vm2Options.expression || null;\nvm2Expression = String(vm2Expression);\n\n\nlet VM_RUNNER_TRACE = function(logLevel,prefix,message,data){\n    var alias = traceOptions && traceOptions.aliases && traceOptions.aliases[logLevel] ;\n    var messageObj = {\n        frame:vmCodeFrame(vm2Expression,this.line),\n        prefix:prefix,\n        message:message,\n        logLevel:logLevel,\n        data:data,\n        line:this.line,\n        date:new Date()\n    }\n    if( alias ){\n        try{\n            return alias.apply(this,[messageObj]);\n        }catch(e){\n            console.error(e);\n        }\n    }\n};\n\nreturn (function vmRunnerWrapper() {\n    VM_RUNNER_RUN_ID = generateUid();\n    \n    BODY;\n}).apply(this);\n");
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9iYWJlbC1wbHVnaW4uanMiXSwibmFtZXMiOlsiZ2V0TG9nRnVuY3Rpb24iLCJoYW5kbGVMYWJlbGVkU3RhdGVtZW50IiwiYmFiZWwiLCJ2aXNpdG9yIiwiUHJvZ3JhbSIsInByb2dyYW0iLCJvcHRzIiwidHJhdmVyc2UiLCJEaXJlY3RpdmVMaXRlcmFsIiwicGF0aCIsIl8iLCJpc0VtcHR5Iiwibm9kZSIsImJvZHkiLCJyZXR1cm5TdGF0ZW1lbnQiLCJ0eXBlcyIsInN0cmluZ0xpdGVyYWwiLCJ2YWx1ZSIsInVuc2hpZnRDb250YWluZXIiLCJMYWJlbGVkU3RhdGVtZW50Iiwidm1SdW5uZXJXcmFwcGVyIiwid3JhcHBlZCIsIndyYXBWbVJ1bm5lciIsIkJPRFkiLCJWTV9SVU5ORVJfUlVOX0lEIiwiaWRlbnRpZmllciIsIlZNX1JVTk5FUl9IQVNIIiwiVk1fUlVOTkVSX1RSQUNFIiwicmVwbGFjZVdpdGgiLCJkaXJlY3RpdmVzIiwiZnNwYXRoIiwidGVtcGxhdGUiLCJnZXQiLCIkaGFuZGxlZCIsIlN5bWJvbCIsIiRub3JtYWxpemVkIiwiUFJFU0VSVkVfQ09OVEVYVFMiLCJub3JtYWxpemVFbnYiLCJwcm9jZXNzIiwiZW52IiwiVFJBQ0VfQ09OVEVYVCIsIlBSRVNFUlZFX0ZJTEVTIiwiVFJBQ0VfRklMRSIsIlBSRVNFUlZFX0xFVkVMUyIsIlRSQUNFX0xFVkVMIiwiaW5wdXQiLCJzcGxpdCIsIm1hcCIsImNvbnRleHQiLCJ0b0xvd2VyQ2FzZSIsInRyaW0iLCJmaWx0ZXIiLCJpZCIsImV4cHJlc3Npb24iLCJmbiIsImlkcyIsImxvZ0xldmVsIiwidCIsImxvZyIsIm1lc3NhZ2UiLCJtZXRhZGF0YSIsIm1lc3NhZ2VFeHByZXNzaW9uIiwicHJlZml4IiwiaW5kZW50IiwiQXJyYXkiLCJqb2luIiwiaXNTZXF1ZW5jZUV4cHJlc3Npb24iLCJjb250ZW50IiwiY2FsbEV4cHJlc3Npb24iLCJtZW1iZXJFeHByZXNzaW9uIiwiY29uY2F0IiwiZXhwcmVzc2lvbnMiLCJMSU5FIiwibG9jIiwic3RhcnQiLCJsaW5lIiwiTE9HTEVWRUwiLCJQUkVGSVgiLCJEQVRBIiwibnVtZXJpY0xpdGVyYWwiLCJNRVNTQUdFIiwiZ2VuZXJhdGVQcmVmaXgiLCJkaXJuYW1lIiwiYmFzZW5hbWUiLCJjb2xsZWN0TWV0YWRhdGEiLCJmaWxlbmFtZSIsInJlc29sdmUiLCJjd2QiLCJodWIiLCJmaWxlIiwiZXh0bmFtZSIsIm5hbWVzIiwicGFyZW50IiwicGFyZW50TmFtZSIsImdldEFuY2VzdHJ5Iiwic2xpY2UiLCJyZWR1Y2UiLCJwYXJ0cyIsIml0ZW0iLCJpc0NsYXNzTWV0aG9kIiwidW5zaGlmdCIsImtleSIsInR5cGUiLCJuYW1lIiwiaXNDbGFzc0RlY2xhcmF0aW9uIiwiaXNGdW5jdGlvbiIsImlzUHJvZ3JhbSIsImlzQ2xhc3NCb2R5IiwiaXNCbG9ja1N0YXRlbWVudCIsImhhc1N0YXJ0TWVzc2FnZSIsImlzU3RhcnRNZXNzYWdlIiwiY2hpbGQiLCJpc0xhYmVsZWRTdGF0ZW1lbnQiLCJsYWJlbCIsImFsaWFzZXMiLCJzaG91bGRTdHJpcCIsInN0cmlwIiwic2UiLCJOT0RFX0VOViIsImxlbmd0aCIsInNvbWUiLCJwYyIsImluY2x1ZGVzIiwicGYiLCJsZXZlbCIsInBsIiwibm9ybWFsaXplT3B0cyIsInRyYWNlIiwid2FybiIsImVycm9yIiwiZGVidWciLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsImV4cHIiLCJ1bmRlZmluZWQiLCJwcm9kdWN0aW9uIiwibGFiZWxOYW1lIiwidmFyaWFibGVzIiwibWV0aG9kUGF0aCIsImluZGV4T2YiLCJwdXNoIiwiZWFjaCIsInNjb3BlIiwiYmluZGluZ3MiLCJ2YWwiLCJhbGlhcyIsInJlbW92ZSIsImVtcHR5U3RhdGVtZW50IiwicHJvcGVydGllcyIsInZhck5hbWUiLCJJZGVudGlmaWVyIiwidGhpc0V4cHJlc3Npb24iLCJvYmplY3RQcm9wZXJ0eSIsInJlcGxhY2VtZW50Iiwib2JqZWN0RXhwcmVzc2lvbiIsImJ1aWxkQ29kZUZyYW1lRXJyb3IiLCJFeHByZXNzaW9uU3RhdGVtZW50Iiwic3RhdGVtZW50IiwidGFyZ2V0Tm9kZSIsIm1lc3NhZ2VFbGVtZW50cyIsImNoYWluIiwiZXhwcmVzc2lvbk5vZGUiLCJjb21wYWN0IiwiYXJyYXlFeHByZXNzaW9uIiwiYm9vbGVhbkxpdGVyYWwiLCJleHByZXNzaW9uU3RhdGVtZW50IiwicmVwbGFjZVdpdGhNdWx0aXBsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFzQ2dCQSxjLEdBQUFBLGM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNElBQyxzQixHQUFBQSxzQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE2TkQsVUFBVUMsS0FBVixFQUFpQjtBQUM1QixTQUFPO0FBQ0hDLElBQUFBLE9BQU8sRUFBRTtBQUNMQyxNQUFBQSxPQURLLG1CQUNJQyxPQURKLFNBQ3FCLEtBQVBDLElBQU8sU0FBUEEsSUFBTztBQUN0QkQsUUFBQUEsT0FBTyxDQUFDRSxRQUFSLENBQWtCO0FBQ2RDLFVBQUFBLGdCQURjLDRCQUNHQyxJQURILEVBQ1E7QUFDbEIsZ0JBQUdDLENBQUMsQ0FBQ0MsT0FBRixDQUFVTixPQUFPLENBQUNPLElBQVIsQ0FBYUMsSUFBdkIsQ0FBSCxFQUFnQztBQUM1QixrQkFBTUMsZUFBZSxHQUFHWixLQUFLLENBQUNhLEtBQU4sQ0FBWUQsZUFBWixDQUE0QlosS0FBSyxDQUFDYSxLQUFOLENBQVlDLGFBQVosQ0FBMEJQLElBQUksQ0FBQ0csSUFBTCxDQUFVSyxLQUFwQyxDQUE1QixDQUF4QjtBQUNBWixjQUFBQSxPQUFPLENBQUNhLGdCQUFSLENBQXlCLE1BQXpCLEVBQWlDSixlQUFqQztBQUNIO0FBQ0osV0FOYTtBQU9kSyxVQUFBQSxnQkFQYyw0QkFPSVYsSUFQSixFQU9VO0FBQ3BCUixZQUFBQSxzQkFBc0IsQ0FBRUMsS0FBRixFQUFTTyxJQUFULEVBQWVILElBQWYsQ0FBdEI7QUFDSCxXQVRhLEVBQWxCOzs7QUFZQSxZQUFJLENBQUNELE9BQU8sQ0FBQ2UsZUFBYixFQUE4QjtBQUMxQmYsVUFBQUEsT0FBTyxDQUFDZSxlQUFSLEdBQTBCLElBQTFCO0FBQ0EsY0FBSUMsT0FBTyxHQUFHQyxZQUFZLENBQUU7QUFDeEJDLFlBQUFBLElBQUksRUFBRWxCLE9BQU8sQ0FBQ08sSUFBUixDQUFhQyxJQURLO0FBRXhCVyxZQUFBQSxnQkFBZ0IsRUFBQ3RCLEtBQUssQ0FBQ2EsS0FBTixDQUFZVSxVQUFaLENBQXdCLGtCQUF4QixDQUZPO0FBR3hCQyxZQUFBQSxjQUFjLEVBQUN4QixLQUFLLENBQUNhLEtBQU4sQ0FBWVUsVUFBWixDQUF3QixnQkFBeEIsQ0FIUztBQUl4QkUsWUFBQUEsZUFBZSxFQUFDekIsS0FBSyxDQUFDYSxLQUFOLENBQVlVLFVBQVosQ0FBd0IsaUJBQXhCLENBSlEsRUFBRixDQUExQjs7O0FBT0FwQixVQUFBQSxPQUFPLENBQUN1QixXQUFSO0FBQ0kxQixVQUFBQSxLQUFLLENBQUNhLEtBQU4sQ0FBWVYsT0FBWixDQUFxQmdCLE9BQXJCLENBREo7O0FBR0g7QUFDRGhCLFFBQUFBLE9BQU8sQ0FBQ08sSUFBUixDQUFhaUIsVUFBYixHQUEwQixFQUExQjs7QUFFSCxPQTdCSSxFQUROLEVBQVA7OztBQWlDSCxDLENBamJELDRCLElBQU9DLE0sNkRBQ1Asd0MsSUFBT3BCLEMsbUVBQ1AsMkMsSUFBT3FCLFEsaUVBQ1AsZ0MsSUFBUUMsRyxXQUFBQSxHLENBRVIsSUFBTUMsUUFBUSxHQUFHQyxNQUFNLENBQUUsU0FBRixDQUF2QixDQUNBLElBQU1DLFdBQVcsR0FBR0QsTUFBTSxDQUFFLFlBQUYsQ0FBMUIsQ0FFQSxJQUFNRSxpQkFBaUIsR0FBR0MsWUFBWSxDQUFFQyxPQUFPLENBQUNDLEdBQVIsQ0FBWUMsYUFBZCxDQUF0QyxDQUNBLElBQU1DLGNBQWMsR0FBR0osWUFBWSxDQUFFQyxPQUFPLENBQUNDLEdBQVIsQ0FBWUcsVUFBZCxDQUFuQyxDQUNBLElBQU1DLGVBQWUsR0FBR04sWUFBWSxDQUFFQyxPQUFPLENBQUNDLEdBQVIsQ0FBWUssV0FBZCxDQUFwQyxDLENBRUE7O3FvQkFHQSxTQUFTUCxZQUFULENBQXVCUSxLQUF2QixFQUE2QixDQUN6QixJQUFJLENBQUNBLEtBQUwsRUFBWSxDQUNSLE9BQU8sRUFBUCxDQUNILENBQ0QsT0FBT0EsS0FBSyxDQUFDQyxLQUFOLENBQWEsR0FBYixFQUNOQyxHQURNLENBQ0QsVUFBQUMsT0FBTyxVQUFJQSxPQUFPLENBQUNDLFdBQVIsR0FBdUJDLElBQXZCLEVBQUosRUFETixFQUVOQyxNQUZNLENBRUUsVUFBQUMsRUFBRSxVQUFJQSxFQUFKLEVBRkosQ0FBUCxDQUdILEMsQ0FFRDs7MHpCQUdBLFNBQVNDLFVBQVQsQ0FBcUJSLEtBQXJCLEVBQTRCZCxRQUE1QixFQUFzQyxDQUNsQyxJQUFNdUIsRUFBRSxHQUFHdkIsUUFBUSxDQUFFYyxLQUFGLENBQW5CLENBQ0EsT0FBTyxVQUFVVSxHQUFWLEVBQWUsQ0FDbEIsSUFBTTNDLElBQUksR0FBRzBDLEVBQUUsQ0FBRUMsR0FBRixDQUFmLENBQ0EsT0FBTzNDLElBQUksQ0FBQ3lDLFVBQUwsR0FBa0J6QyxJQUFJLENBQUN5QyxVQUF2QixHQUFvQ3pDLElBQTNDLENBQ0gsQ0FIRCxDQUlILEMsQ0FFRDs7MDlCQUdPLFNBQVNaLGNBQVQsT0FBK0N3RCxRQUEvQyxFQUF5RCxLQUF4QkMsQ0FBd0IsUUFBL0IxQyxLQUErQixDQUFyQmdCLFFBQXFCLFFBQXJCQSxRQUFxQixDQUM1RCxPQUFPLFNBQVMyQixHQUFULENBQWNDLE9BQWQsRUFBdUJDLFFBQXZCLEVBQWlDLENBQ3BDLElBQUlDLGlCQUFpQixHQUFHRixPQUFPLENBQUNFLGlCQUFoQyxDQUNBLElBQUlDLE1BQU0sYUFBTUYsUUFBUSxDQUFDWixPQUFmLE1BQVYsQ0FDQSxJQUFJWSxRQUFRLENBQUNHLE1BQWIsRUFBcUIsQ0FDakJELE1BQU0sSUFBSyxJQUFJRSxLQUFKLENBQVdKLFFBQVEsQ0FBQ0csTUFBVCxHQUFrQixDQUE3QixDQUFELENBQWtDRSxJQUFsQyxDQUF3QyxJQUF4QyxDQUFWLENBQ0gsQ0FHRCxJQUFJUixDQUFDLENBQUNTLG9CQUFGLENBQXdCUCxPQUFPLENBQUNRLE9BQWhDLENBQUosRUFBOEMsQ0FDMUMsT0FBT1YsQ0FBQyxDQUFDVyxjQUFGLENBQ0hYLENBQUMsQ0FBQ1ksZ0JBQUYsQ0FDSVosQ0FBQyxDQUFDaEMsVUFBRixDQUFjLFNBQWQsQ0FESixFQUVJZ0MsQ0FBQyxDQUFDaEMsVUFBRixDQUFjK0IsUUFBZCxDQUZKLENBREcsRUFLSCxDQUFDQyxDQUFDLENBQUN6QyxhQUFGLENBQWlCOEMsTUFBakIsQ0FBRCxFQUEyQlEsTUFBM0IsQ0FBbUNYLE9BQU8sQ0FBQ1EsT0FBUixDQUFnQkksV0FBbkQsQ0FMRyxDQUFQLENBT0gsQ0FSRCxNQVFPLENBQ0gsSUFBTUMsSUFBSSxHQUFHWixRQUFRLENBQUNuRCxJQUFULENBQWNHLElBQWQsQ0FBbUI2RCxHQUFuQixDQUF1QkMsS0FBdkIsQ0FBNkJDLElBQTFDLENBQ0EsT0FBT3RCLFVBQVUsMEVBQTJFdEIsUUFBM0UsQ0FBVixDQUFnRyxFQUNuRzZDLFFBQVEsRUFBRW5CLENBQUMsQ0FBQ3pDLGFBQUYsQ0FBaUJ3QyxRQUFqQixDQUR5RixFQUVuR3FCLE1BQU0sRUFBRXBCLENBQUMsQ0FBQ3pDLGFBQUYsQ0FBaUI4QyxNQUFqQixDQUYyRixFQUduR2dCLElBQUksRUFBRW5CLE9BQU8sQ0FBQ1EsT0FIcUYsRUFJbkdLLElBQUksRUFBQ2YsQ0FBQyxDQUFDc0IsY0FBRixDQUFpQlAsSUFBakIsQ0FKOEYsRUFLbkc3QyxlQUFlLEVBQUM4QixDQUFDLENBQUNoQyxVQUFGLENBQWMsaUJBQWQsQ0FMbUYsRUFNbkd1RCxPQUFPLEVBQUNuQixpQkFOMkYsRUFBaEcsQ0FBUCxDQVFILENBQ0osQ0EzQkQsQ0E0QkgsQ0FFRCxTQUFTb0IsY0FBVCxDQUF5QkMsT0FBekIsRUFBa0NDLFFBQWxDLEVBQTRDLENBQ3hDLElBQUlBLFFBQVEsS0FBSyxPQUFqQixFQUEwQixDQUN0QixPQUFPQSxRQUFQLENBQ0gsQ0FDREEsUUFBUSxHQUFHckQsTUFBTSxDQUFDcUQsUUFBUCxDQUFpQkQsT0FBakIsQ0FBWCxDQUNBLElBQUlDLFFBQVEsS0FBSyxLQUFiLElBQXNCQSxRQUFRLEtBQUssS0FBdkMsRUFBOEMsQ0FDMUMsT0FBT0EsUUFBUCxDQUNILENBQ0QsT0FBT3JELE1BQU0sQ0FBQ3FELFFBQVAsQ0FBaUJyRCxNQUFNLENBQUNvRCxPQUFQLENBQWdCQSxPQUFoQixDQUFqQixDQUFQLENBQ0gsQyxDQUVEOzs7d2lFQUlBLFNBQVNFLGVBQVQsQ0FBMEIzRSxJQUExQixFQUFnQ0gsSUFBaEMsRUFBc0MsQ0FDbEMsSUFBTStFLFFBQVEsR0FBR3ZELE1BQU0sQ0FBQ3dELE9BQVAsQ0FBZ0JoRCxPQUFPLENBQUNpRCxHQUFSLEVBQWhCLEVBQWdDOUUsSUFBSSxDQUFDK0UsR0FBTCxDQUFTQyxJQUFULENBQWNuRixJQUFkLENBQW1CK0UsUUFBbkQsQ0FBakIsQ0FDQSxJQUFNSCxPQUFPLEdBQUdwRCxNQUFNLENBQUNvRCxPQUFQLENBQWdCRyxRQUFoQixDQUFoQixDQUNBLElBQU1LLE9BQU8sR0FBRzVELE1BQU0sQ0FBQzRELE9BQVAsQ0FBZ0JMLFFBQWhCLENBQWhCLENBQ0EsSUFBTUYsUUFBUSxHQUFHckQsTUFBTSxDQUFDcUQsUUFBUCxDQUFpQkUsUUFBakIsRUFBMkJLLE9BQTNCLENBQWpCLENBQ0EsSUFBTTVCLE1BQU0sR0FBR21CLGNBQWMsQ0FBRUMsT0FBRixFQUFXQyxRQUFYLENBQTdCLENBQ0EsSUFBTVEsS0FBSyxHQUFHLEVBQWQsQ0FDQSxJQUFJNUIsTUFBTSxHQUFHLENBQWIsQ0FDQSxJQUFJNkIsTUFBSixDQUVBLElBQU1DLFVBQVUsR0FBR3BGLElBQUksQ0FBQ3FGLFdBQUwsR0FBb0JDLEtBQXBCLENBQTJCLENBQTNCLEVBQThCQyxNQUE5QixDQUFzQyxVQUFDQyxLQUFELEVBQVFDLElBQVIsRUFBaUIsQ0FDdEUsSUFBSUEsSUFBSSxDQUFDQyxhQUFMLEVBQUosRUFBMkIsQ0FDdkIsSUFBSSxDQUFDUCxNQUFMLEVBQWEsQ0FDVEEsTUFBTSxHQUFHTSxJQUFULENBQ0gsQ0FDREQsS0FBSyxDQUFDRyxPQUFOLENBQWVGLElBQUksQ0FBQ3RGLElBQUwsQ0FBVXlGLEdBQVYsQ0FBY0MsSUFBZCxLQUF1QixZQUF2QixHQUFzQ0osSUFBSSxDQUFDdEYsSUFBTCxDQUFVeUYsR0FBVixDQUFjRSxJQUFwRCxHQUEyRCxtQkFBMUUsRUFDSCxDQUxELE1BS08sSUFBSUwsSUFBSSxDQUFDTSxrQkFBTCxFQUFKLEVBQWdDLENBQ25DLElBQUksQ0FBQ1osTUFBTCxFQUFhLENBQ1RBLE1BQU0sR0FBR00sSUFBVCxDQUNILENBQ0RELEtBQUssQ0FBQ0csT0FBTixDQUFlRixJQUFJLENBQUN0RixJQUFMLENBQVV3QyxFQUFWLEdBQWU4QyxJQUFJLENBQUN0RixJQUFMLENBQVV3QyxFQUFWLENBQWFtRCxJQUE1Qiw4QkFBdURMLElBQUksQ0FBQ3RGLElBQUwsQ0FBVTZELEdBQVYsQ0FBY0MsS0FBZCxDQUFvQkMsSUFBM0UsTUFBZixFQUNILENBTE0sTUFLQSxJQUFJdUIsSUFBSSxDQUFDTyxVQUFMLEVBQUosRUFBd0IsQ0FDM0IsSUFBSSxDQUFDYixNQUFMLEVBQWEsQ0FDVEEsTUFBTSxHQUFHTSxJQUFULENBQ0gsQ0FDREQsS0FBSyxDQUFDRyxPQUFOLENBQWdCRixJQUFJLENBQUN0RixJQUFMLENBQVV3QyxFQUFWLElBQWdCOEMsSUFBSSxDQUFDdEYsSUFBTCxDQUFVd0MsRUFBVixDQUFhbUQsSUFBOUIseUJBQXFETCxJQUFJLENBQUN0RixJQUFMLENBQVU2RCxHQUFWLENBQWNDLEtBQWQsQ0FBb0JDLElBQXpFLE1BQWYsRUFDSCxDQUxNLE1BS0EsSUFBSXVCLElBQUksQ0FBQ1EsU0FBTCxFQUFKLEVBQXVCLENBQzFCLElBQUksQ0FBQ2QsTUFBTCxFQUFhLENBQ1RBLE1BQU0sR0FBR00sSUFBVCxDQUNILENBQ0osQ0FKTSxNQUlBLElBQUksQ0FBQ04sTUFBRCxJQUFXLENBQUNNLElBQUksQ0FBQ1MsV0FBTCxFQUFaLElBQW1DLENBQUNULElBQUksQ0FBQ1UsZ0JBQUwsRUFBeEMsRUFBa0UsQ0FDckU3QyxNQUFNLEdBQ1QsQ0FDRCxPQUFPa0MsS0FBUCxDQUNILENBeEJrQixFQXdCaEIsRUF4QmdCLEVBd0JaaEMsSUF4QlksQ0F3Qk4sR0F4Qk0sQ0FBbkIsQ0EwQkEsSUFBSTRDLGVBQWUsR0FBRyxLQUF0QixDQUNBLElBQUlDLGNBQWMsR0FBRyxLQUFyQixDQUNBLElBQUlsQixNQUFNLElBQUksQ0FBQ0EsTUFBTSxDQUFDYyxTQUFQLEVBQWYsRUFBb0Msd0dBQ2hDLHFCQUFrQmQsTUFBTSxDQUFDNUQsR0FBUCxDQUFZLE1BQVosRUFBb0JBLEdBQXBCLENBQXlCLE1BQXpCLENBQWxCLDhIQUFvRCxLQUEzQytFLEtBQTJDLGVBQ2hELElBQUlBLEtBQUssQ0FBQ25HLElBQU4sQ0FBV3FCLFFBQVgsQ0FBSixFQUEwQixDQUN0QjRFLGVBQWUsR0FBRyxJQUFsQixDQUNBLE1BQ0gsQ0FDRCxJQUFJLENBQUNFLEtBQUssQ0FBQ0Msa0JBQU4sRUFBTCxFQUFrQyxDQUM5QixNQUNILENBQ0QsSUFBTUMsS0FBSyxHQUFHRixLQUFLLENBQUMvRSxHQUFOLENBQVcsT0FBWCxDQUFkLENBQ0EsSUFBSTFCLElBQUksQ0FBQzRHLE9BQUwsQ0FBYUQsS0FBSyxDQUFDckcsSUFBTixDQUFXMkYsSUFBeEIsQ0FBSixFQUFtQyxDQUMvQk0sZUFBZSxHQUFHLElBQWxCLENBQ0EsSUFBSUUsS0FBSyxDQUFDbkcsSUFBTixLQUFlSCxJQUFJLENBQUNHLElBQXhCLEVBQThCLENBQzFCa0csY0FBYyxHQUFHLElBQWpCLENBQ0gsQ0FDRCxNQUNILENBQ0osQ0FqQitCLCtOQWtCbkMsQ0FFRCxJQUFNOUQsT0FBTyxhQUFNYyxNQUFOLGNBQWdCK0IsVUFBaEIsQ0FBYixDQUNBLE9BQU8sRUFBQzlCLE1BQU0sRUFBTkEsTUFBRCxFQUFTRCxNQUFNLEVBQU5BLE1BQVQsRUFBaUIrQixVQUFVLEVBQVZBLFVBQWpCLEVBQTZCN0MsT0FBTyxFQUFQQSxPQUE3QixFQUFzQzZELGVBQWUsRUFBZkEsZUFBdEMsRUFBdURDLGNBQWMsRUFBZEEsY0FBdkQsRUFBdUV6QixRQUFRLEVBQVJBLFFBQXZFLEVBQWlGSCxPQUFPLEVBQVBBLE9BQWpGLEVBQTBGQyxRQUFRLEVBQVJBLFFBQTFGLEVBQW9HTyxPQUFPLEVBQVBBLE9BQXBHLEVBQTZHakYsSUFBSSxFQUFKQSxJQUE3RyxFQUFQLENBQ0gsQyxDQUVEOztrdUlBR0EsU0FBUzBHLFdBQVQsQ0FBc0JaLElBQXRCLEVBQTRCM0MsUUFBNUIsU0FBK0MsS0FBUndELEtBQVEsU0FBUkEsS0FBUSxDQUMzQyxnQkFBZUEsS0FBZixJQUNJLEtBQUssU0FBTCxDQUNJLElBQUksQ0FBQ0EsS0FBTCxFQUFZLE9BQU8sS0FBUCxDQURoQixDQUVJO0FBQ0EsWUFDSixLQUFLLFFBQUwsQ0FDSSxJQUFNQyxFQUFFLEdBQUdELEtBQUssQ0FBQ2IsSUFBRCxDQUFoQixDQUNBLElBQUksQ0FBQ2MsRUFBRCxJQUFRLFFBQU9BLEVBQVAsTUFBYyxRQUFkLElBQTBCLENBQUNBLEVBQUUsQ0FBQy9FLE9BQU8sQ0FBQ0MsR0FBUixDQUFZK0UsUUFBYixDQUF6QyxFQUFrRSxPQUFPLEtBQVAsQ0FGdEUsQ0FHSTtBQUNBLFlBQ0osUUFDSSxPQUFPLEtBQVAsQ0FYUixDQWFBLElBQUlsRixpQkFBaUIsQ0FBQ21GLE1BQXRCLEVBQThCLENBQzFCLElBQU12RSxPQUFPLEdBQUdZLFFBQVEsQ0FBQ1osT0FBVCxDQUFpQkMsV0FBakIsRUFBaEIsQ0FDQSxJQUFJYixpQkFBaUIsQ0FBQ29GLElBQWxCLENBQXdCLFVBQUFDLEVBQUUsVUFBSXpFLE9BQU8sQ0FBQzBFLFFBQVIsQ0FBa0JELEVBQWxCLENBQUosRUFBMUIsQ0FBSixFQUEwRCxPQUFPLEtBQVAsQ0FDN0QsQ0FDRCxJQUFJaEYsY0FBYyxDQUFDOEUsTUFBbkIsRUFBMkIsQ0FDdkIsSUFBTWxDLFFBQVEsR0FBR3pCLFFBQVEsQ0FBQ3lCLFFBQVQsQ0FBa0JwQyxXQUFsQixFQUFqQixDQUNBLElBQUlSLGNBQWMsQ0FBQytFLElBQWYsQ0FBcUIsVUFBQUcsRUFBRSxVQUFJdEMsUUFBUSxDQUFDcUMsUUFBVCxDQUFtQkMsRUFBbkIsQ0FBSixFQUF2QixDQUFKLEVBQXdELE9BQU8sS0FBUCxDQUMzRCxDQUNELElBQUloRixlQUFlLENBQUM0RSxNQUFwQixFQUE0QixDQUN4QixJQUFNSyxLQUFLLEdBQUdyQixJQUFJLENBQUN0RCxXQUFMLEVBQWQsQ0FDQSxJQUFJTixlQUFlLENBQUM2RSxJQUFoQixDQUFzQixVQUFBSyxFQUFFLFVBQUlELEtBQUssS0FBS0MsRUFBZCxFQUF4QixDQUFKLEVBQStDLE9BQU8sS0FBUCxDQUNsRCxDQUNELE9BQU8sSUFBUCxDQUNILENBRU0sU0FBUzVILHNCQUFULENBQWlDQyxLQUFqQyxFQUF3Q08sSUFBeEMsRUFBOENILElBQTlDLEVBQW9ELENBQ3ZELElBQU1tRCxDQUFDLEdBQUd2RCxLQUFLLENBQUNhLEtBQWhCLENBQ0EsSUFBTWtHLEtBQUssR0FBR3hHLElBQUksQ0FBQ3VCLEdBQUwsQ0FBVSxPQUFWLENBQWQsQ0FDQTFCLElBQUksR0FBSSxTQUFTd0gsYUFBVCxDQUF3QjVILEtBQXhCLEVBQStCSSxJQUEvQixFQUFxQyxDQUN6QyxJQUFJQSxJQUFJLENBQUM2QixXQUFELENBQVIsRUFBdUIsQ0FDbkIsT0FBTzdCLElBQVAsQ0FDSCxDQUNELElBQUksQ0FBQ0EsSUFBSSxDQUFDNEcsT0FBVixFQUFtQixDQUNmNUcsSUFBSSxDQUFDNEcsT0FBTCxHQUFlLEVBQ1h4RCxHQUFHLEVBQUUxRCxjQUFjLENBQUVFLEtBQUYsRUFBUyxLQUFULENBRFIsRUFFWDZILEtBQUssRUFBRS9ILGNBQWMsQ0FBRUUsS0FBRixFQUFTLE9BQVQsQ0FGVixFQUdYOEgsSUFBSSxFQUFFaEksY0FBYyxDQUFFRSxLQUFGLEVBQVMsTUFBVCxDQUhULEVBSVgrSCxLQUFLLEVBQUNqSSxjQUFjLENBQUNFLEtBQUQsRUFBTyxPQUFQLENBSlQsRUFLWGdJLEtBQUssRUFBQ2xJLGNBQWMsQ0FBQ0UsS0FBRCxFQUFPLE9BQVAsQ0FMVCxFQUFmLENBT0gsQ0FSRCxNQVFPLENBQ0hpSSxNQUFNLENBQUNDLElBQVAsQ0FBYTlILElBQUksQ0FBQzRHLE9BQWxCLEVBQTJCbUIsT0FBM0IsQ0FBb0MsVUFBQWhDLEdBQUcsRUFBSSxDQUN2QyxJQUFJLE9BQU8vRixJQUFJLENBQUM0RyxPQUFMLENBQWFiLEdBQWIsQ0FBUCxLQUE2QixRQUE3QixJQUF5Qy9GLElBQUksQ0FBQzRHLE9BQUwsQ0FBYWIsR0FBYixDQUE3QyxFQUFnRSxDQUM1RCxJQUFNaUMsSUFBSSxHQUFHakYsVUFBVSxDQUFFL0MsSUFBSSxDQUFDNEcsT0FBTCxDQUFhYixHQUFiLENBQUYsRUFBcUJuRyxLQUFLLENBQUM2QixRQUEzQixDQUF2QixDQUNBekIsSUFBSSxDQUFDNEcsT0FBTCxDQUFhYixHQUFiLElBQW9CLFVBQUMxQyxPQUFELFVBQWEyRSxJQUFJLENBQUUzRSxPQUFGLENBQWpCLEVBQXBCLENBQ0gsQ0FDSixDQUxELEVBTUgsQ0FDRCxJQUFJckQsSUFBSSxDQUFDOEcsS0FBTCxLQUFlbUIsU0FBbkIsRUFBOEIsQ0FDMUJqSSxJQUFJLENBQUM4RyxLQUFMLEdBQWEsRUFDVDFELEdBQUcsRUFBRSxFQUFDOEUsVUFBVSxFQUFFLElBQWIsRUFESSxFQUVUVCxLQUFLLEVBQUUsS0FGRSxFQUdUQyxJQUFJLEVBQUUsRUFBQ1EsVUFBVSxFQUFFLElBQWIsRUFIRyxFQUFiLENBS0gsQ0FDRGxJLElBQUksQ0FBQzZCLFdBQUQsQ0FBSixHQUFvQixJQUFwQixDQUNBLE9BQU83QixJQUFQLENBQ0gsQ0E3Qk0sQ0E2QkpKLEtBN0JJLEVBNkJHSSxJQTdCSCxDQUFQLENBK0JBLElBQU1tSSxTQUFTLEdBQUd4QixLQUFLLENBQUNyRyxJQUFOLENBQVcyRixJQUE3QixDQUNBLElBQU1tQyxTQUFTLEdBQUksRUFBbkIsQ0FFQSxJQUFNQyxVQUFVLEdBQUczRyxHQUFHLENBQUN2QixJQUFELEVBQU0sdUJBQU4sRUFBOEIsSUFBOUIsQ0FBdEIsQ0FDQSxJQUFHa0ksVUFBVSxJQUFHLENBQUMsYUFBRCxFQUFlLGNBQWYsRUFBK0JDLE9BQS9CLENBQXVDRCxVQUFVLENBQUNyQyxJQUFsRCxJQUF3RCxDQUFDLENBQXRFLElBQXlFLENBQUNxQyxVQUFVLENBQUMvSCxJQUFYLFVBQTdFLEVBQW9HLENBQ2hHOEgsU0FBUyxDQUFDRyxJQUFWLENBQWUsTUFBZixFQUNILENBQ0RuSSxDQUFDLENBQUNvSSxJQUFGLENBQVFySSxJQUFJLENBQUNzSSxLQUFMLENBQVdDLFFBQW5CLEVBQThCLFVBQUNDLEdBQUQsRUFBSzVDLEdBQUwsRUFBVyxDQUNyQyxJQUFHcUMsU0FBUyxDQUFDRSxPQUFWLENBQWtCdkMsR0FBbEIsS0FBd0IsQ0FBQyxDQUE1QixFQUNJcUMsU0FBUyxDQUFDRyxJQUFWLENBQWV4QyxHQUFmLEVBQ1AsQ0FIRCxFQU1BLElBQU02QyxLQUFLLEdBQUc1SSxJQUFJLENBQUM0RyxPQUFMLENBQWF1QixTQUFiLENBQWQsQ0FDQSxJQUFJLENBQUNTLEtBQUwsRUFBWSxDQUNSLE9BQ0gsQ0FDRCxJQUFNdEYsUUFBUSxHQUFHd0IsZUFBZSxDQUFFM0UsSUFBRixFQUFRSCxJQUFSLENBQWhDLENBQ0EsSUFBSTZHLFdBQVcsQ0FBRUYsS0FBSyxDQUFDckcsSUFBTixDQUFXMkYsSUFBYixFQUFtQjNDLFFBQW5CLEVBQTZCdEQsSUFBN0IsQ0FBZixFQUFtRCxDQUMvQ0csSUFBSSxDQUFDMEksTUFBTCxHQUNBLE9BQ0gsQ0FFRDFJLElBQUksQ0FBQ0YsUUFBTCxDQUFlLEVBQ1gsZ0JBRFcsMEJBQ082SSxjQURQLEVBQ3NCLENBQzdCLElBQUlDLFVBQVUsR0FBRzNJLENBQUMsQ0FBQ3FDLEdBQUYsQ0FBTzJGLFNBQVAsRUFBa0IsVUFBQ1ksT0FBRCxFQUFhLENBQzVDLElBQUlqRCxHQUFHLEdBQUc1QyxDQUFDLENBQUM4RixVQUFGLENBQWNELE9BQWQsQ0FBVixDQUNBLElBQUlySSxLQUFKLENBQ0EsSUFBR3FJLE9BQU8sSUFBRSxNQUFaLEVBQW9CLENBQ2hCckksS0FBSyxHQUFHd0MsQ0FBQyxDQUFDOEYsVUFBRixDQUFjRCxPQUFkLENBQVIsQ0FDSCxDQUZELE1BRUssQ0FDRHJJLEtBQUssR0FBR3dDLENBQUMsQ0FBQytGLGNBQUYsRUFBUixDQUNILENBQ0QsT0FBTy9GLENBQUMsQ0FBQ2dHLGNBQUYsQ0FBa0JwRCxHQUFsQixFQUF1QnBGLEtBQXZCLEVBQThCLEtBQTlCLENBQVAsQ0FDSCxDQVRnQixDQUFqQixDQVVBLElBQUl5SSxXQUFXLEdBQUdqRyxDQUFDLENBQUNrRyxnQkFBRixDQUFvQk4sVUFBcEIsQ0FBbEIsQ0FDQUssV0FBVyxDQUFDekgsUUFBRCxDQUFYLEdBQXdCLElBQXhCLENBQ0FtSCxjQUFjLENBQUN4SCxXQUFmLENBQTRCOEgsV0FBNUIsRUFDSCxDQWZVLEVBZ0JYO3N2RUFHQSxvR0FuQlcseUdBbUIyRnhELElBbkIzRixFQW1CaUcsQ0FDeEcsTUFBTXpGLElBQUksQ0FBQ21KLG1CQUFMLHdEQUEwRTFELElBQUksQ0FBQ0ksSUFBL0UsRUFBTixDQUNILENBckJVLEVBc0JYdUQsbUJBdEJXLCtCQXNCVUMsU0F0QlYsRUFzQnFCLENBQzVCLElBQUlBLFNBQVMsQ0FBQ2xKLElBQVYsQ0FBZXFCLFFBQWYsQ0FBSixFQUE4QixDQUMxQixPQUNILENBQ0QsSUFBSThILFVBQVUsR0FBR0QsU0FBUyxDQUFDOUgsR0FBVixDQUFlLFlBQWYsRUFBNkJwQixJQUE5QyxDQUNBLElBQU1vSixlQUFlLEdBQUcsRUFBeEIsQ0FDQSxJQUFHRCxVQUFVLENBQUN6RCxJQUFYLEtBQWtCLG9CQUFyQixFQUEwQyxDQUN0QyxJQUFJK0MsVUFBVSxHQUFHM0ksQ0FBQyxDQUFDdUosS0FBRixDQUFRRixVQUFVLENBQUN4RixXQUFuQixFQUFnQ3hCLEdBQWhDLENBQW9DLFVBQUNtSCxjQUFELEVBQW9CLENBQ3JFLElBQUcsQ0FBQyxZQUFELEVBQWMsZ0JBQWQsRUFBZ0N0QixPQUFoQyxDQUF3Q3NCLGNBQWMsQ0FBQzVELElBQXZELElBQTZELENBQUMsQ0FBakUsRUFBbUUsQ0FDL0QsSUFBSWdELE9BQU8sR0FBR1ksY0FBYyxDQUFDNUQsSUFBZixLQUFzQixZQUF0QixHQUFtQzRELGNBQWMsQ0FBQzNELElBQWxELEdBQXVELE1BQXJFLENBQ0EsSUFBSUYsR0FBRyxHQUFHNUMsQ0FBQyxDQUFDOEYsVUFBRixDQUFjRCxPQUFkLENBQVYsQ0FDQSxJQUFJckksS0FBSixDQUNBLElBQUdpSixjQUFjLENBQUM1RCxJQUFmLEtBQXNCLFlBQXpCLEVBQXVDLENBQ25DckYsS0FBSyxHQUFHd0MsQ0FBQyxDQUFDOEYsVUFBRixDQUFjRCxPQUFkLENBQVIsQ0FDSCxDQUZELE1BRUssQ0FDRHJJLEtBQUssR0FBR3dDLENBQUMsQ0FBQytGLGNBQUYsRUFBUixDQUNILENBQ0QsT0FBTy9GLENBQUMsQ0FBQ2dHLGNBQUYsQ0FBa0JwRCxHQUFsQixFQUF1QnBGLEtBQXZCLEVBQThCLEtBQTlCLENBQVAsQ0FDSCxDQVZELE1BVU0sSUFBRyxDQUFDLGVBQUQsRUFBaUIsaUJBQWpCLEVBQW9DMkgsT0FBcEMsQ0FBNENzQixjQUFjLENBQUM1RCxJQUEzRCxJQUFpRSxDQUFDLENBQXJFLEVBQXVFLENBQ3pFMEQsZUFBZSxDQUFDbkIsSUFBaEIsQ0FBcUJxQixjQUFyQixFQUNILENBQ0osQ0FkZ0IsRUFjZEMsT0FkYyxHQWNKbEosS0FkSSxFQUFqQixDQWVBLElBQUlQLENBQUMsQ0FBQ0MsT0FBRixDQUFVMEksVUFBVixLQUF5QixDQUFDM0ksQ0FBQyxDQUFDQyxPQUFGLENBQVVxSixlQUFWLENBQTlCLEVBQTBELENBQ3RELElBQUlYLFdBQVUsR0FBRzNJLENBQUMsQ0FBQ3FDLEdBQUYsQ0FBTzJGLFNBQVAsRUFBa0IsVUFBQ1ksT0FBRCxFQUFhLENBQzVDLElBQUlqRCxHQUFHLEdBQUc1QyxDQUFDLENBQUM4RixVQUFGLENBQWNELE9BQWQsQ0FBVixDQUNBLElBQUlySSxLQUFKLENBQ0EsSUFBR3FJLE9BQU8sSUFBRSxNQUFaLEVBQW9CLENBQ2hCckksS0FBSyxHQUFHd0MsQ0FBQyxDQUFDOEYsVUFBRixDQUFjRCxPQUFkLENBQVIsQ0FDSCxDQUZELE1BRUssQ0FDRHJJLEtBQUssR0FBR3dDLENBQUMsQ0FBQytGLGNBQUYsRUFBUixDQUNILENBQ0QsT0FBTy9GLENBQUMsQ0FBQ2dHLGNBQUYsQ0FBa0JwRCxHQUFsQixFQUF1QnBGLEtBQXZCLEVBQThCLEtBQTlCLENBQVAsQ0FDSCxDQVRnQixDQUFqQixDQVVBOEksVUFBVSxHQUFHdEcsQ0FBQyxDQUFDa0csZ0JBQUYsQ0FBb0JOLFdBQXBCLENBQWIsQ0FDSCxDQVpELE1BY0lVLFVBQVUsR0FBR3RHLENBQUMsQ0FBQ2tHLGdCQUFGLENBQW9CTixVQUFwQixDQUFiLENBQ1AsQ0EvQkQsTUErQk0sSUFBRyxDQUFDLGlCQUFELEVBQW1CLGVBQW5CLEVBQW9DVCxPQUFwQyxDQUE0Q21CLFVBQVUsQ0FBQ3pELElBQXZELElBQTZELENBQUMsQ0FBakUsRUFBbUUsQ0FDckUwRCxlQUFlLENBQUNuQixJQUFoQixDQUFxQmtCLFVBQXJCLEVBRUEsSUFBSVYsWUFBVSxHQUFHM0ksQ0FBQyxDQUFDcUMsR0FBRixDQUFPMkYsU0FBUCxFQUFrQixVQUFDWSxPQUFELEVBQWEsQ0FDNUMsSUFBSWpELEdBQUcsR0FBRzVDLENBQUMsQ0FBQzhGLFVBQUYsQ0FBY0QsT0FBZCxDQUFWLENBQ0EsSUFBSXJJLEtBQUosQ0FDQSxJQUFHcUksT0FBTyxJQUFFLE1BQVosRUFBb0IsQ0FDaEJySSxLQUFLLEdBQUd3QyxDQUFDLENBQUM4RixVQUFGLENBQWNELE9BQWQsQ0FBUixDQUNILENBRkQsTUFFSyxDQUNEckksS0FBSyxHQUFHd0MsQ0FBQyxDQUFDK0YsY0FBRixFQUFSLENBQ0gsQ0FDRCxPQUFPL0YsQ0FBQyxDQUFDZ0csY0FBRixDQUFrQnBELEdBQWxCLEVBQXVCcEYsS0FBdkIsRUFBOEIsS0FBOUIsQ0FBUCxDQUNILENBVGdCLENBQWpCLENBVUE4SSxVQUFVLEdBQUd0RyxDQUFDLENBQUNrRyxnQkFBRixDQUFvQk4sWUFBcEIsQ0FBYixDQUNILENBR0QsSUFBTXhGLGlCQUFpQixHQUFHSixDQUFDLENBQUNXLGNBQUYsQ0FDdEJYLENBQUMsQ0FBQ1ksZ0JBQUYsQ0FDSVosQ0FBQyxDQUFDMkcsZUFBRixDQUFrQkosZUFBbEIsQ0FESixFQUN1QztBQUNuQ3ZHLE1BQUFBLENBQUMsQ0FBQ2hDLFVBQUYsQ0FBYSxNQUFiLENBRkosRUFFeUI7QUFDckIsV0FISixDQUdTO0FBSFQsT0FEc0IsRUFNcEIsQ0FDRWdDLENBQUMsQ0FBQ3pDLGFBQUYsQ0FBZ0IsR0FBaEIsQ0FERixDQU5vQixDQUExQixDQVVBLElBQU0yQyxPQUFPLEdBQUcsRUFDWkUsaUJBQWlCLEVBQWpCQSxpQkFEWSxFQUVaQyxNQUFNLEVBQUVMLENBQUMsQ0FBQ3pDLGFBQUYsQ0FBaUI0QyxRQUFRLENBQUNFLE1BQTFCLENBRkksRUFHWkssT0FBTyxFQUFFNEYsVUFIRyxFQUlabEQsZUFBZSxFQUFFcEQsQ0FBQyxDQUFDNEcsY0FBRixDQUFrQnpHLFFBQVEsQ0FBQ2lELGVBQTNCLENBSkwsRUFLWkMsY0FBYyxFQUFFckQsQ0FBQyxDQUFDNEcsY0FBRixDQUFrQnpHLFFBQVEsQ0FBQ2tELGNBQTNCLENBTEosRUFNWi9DLE1BQU0sRUFBRU4sQ0FBQyxDQUFDc0IsY0FBRixDQUFrQm5CLFFBQVEsQ0FBQ0csTUFBM0IsQ0FOSSxFQU9aOEIsVUFBVSxFQUFFcEMsQ0FBQyxDQUFDekMsYUFBRixDQUFpQjRDLFFBQVEsQ0FBQ2lDLFVBQTFCLENBUEEsRUFRWlIsUUFBUSxFQUFFNUIsQ0FBQyxDQUFDekMsYUFBRixDQUFpQjRDLFFBQVEsQ0FBQ3lCLFFBQTFCLENBUkUsRUFTWkgsT0FBTyxFQUFFekIsQ0FBQyxDQUFDekMsYUFBRixDQUFpQjRDLFFBQVEsQ0FBQ3NCLE9BQTFCLENBVEcsRUFVWkMsUUFBUSxFQUFFMUIsQ0FBQyxDQUFDekMsYUFBRixDQUFpQjRDLFFBQVEsQ0FBQ3VCLFFBQTFCLENBVkUsRUFXWk8sT0FBTyxFQUFFakMsQ0FBQyxDQUFDekMsYUFBRixDQUFpQjRDLFFBQVEsQ0FBQzhCLE9BQTFCLENBWEcsRUFBaEIsQ0FhQSxJQUFNZ0UsV0FBVyxHQUFHakcsQ0FBQyxDQUFDNkcsbUJBQUYsQ0FBdUJwQixLQUFLLENBQUV2RixPQUFGLEVBQVdDLFFBQVgsQ0FBNUIsQ0FBcEIsQ0FDQThGLFdBQVcsQ0FBQ3pILFFBQUQsQ0FBWCxHQUF3QixJQUF4QixDQUNBNkgsU0FBUyxDQUFDbEksV0FBVixDQUF1QjhILFdBQXZCLEVBQ0gsQ0F0R1UsRUFBZixFQXlHQSxJQUFJakosSUFBSSxDQUFDRyxJQUFULEVBQWUsQ0FDWCxJQUFJSCxJQUFJLENBQUN1QixHQUFMLENBQVUsTUFBVixFQUFrQjRFLGdCQUFsQixFQUFKLEVBQTJDLENBQ3ZDbkcsSUFBSSxDQUFDOEosbUJBQUwsQ0FBMEI5SixJQUFJLENBQUN1QixHQUFMLENBQVUsTUFBVixFQUFrQnBCLElBQWxCLENBQXVCQyxJQUFqRCxFQUNILENBRkQsTUFFTyxDQUNISixJQUFJLENBQUNtQixXQUFMLENBQWtCbkIsSUFBSSxDQUFDdUIsR0FBTCxDQUFVLE1BQVYsRUFBa0JwQixJQUFwQyxFQUNILENBQ0osQ0FDSixDQUNELElBQU1VLFlBQVksR0FBR1MsUUFBUSxxeENBQTdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZzcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZSc7XG5pbXBvcnQgdGVtcGxhdGUgZnJvbSBcIkBiYWJlbC90ZW1wbGF0ZVwiO1xuaW1wb3J0IHtnZXR9IGZyb20gJ2xvZGFzaCc7XG5cbmNvbnN0ICRoYW5kbGVkID0gU3ltYm9sICgnaGFuZGxlZCcpO1xuY29uc3QgJG5vcm1hbGl6ZWQgPSBTeW1ib2wgKCdub3JtYWxpemVkJyk7XG5cbmNvbnN0IFBSRVNFUlZFX0NPTlRFWFRTID0gbm9ybWFsaXplRW52IChwcm9jZXNzLmVudi5UUkFDRV9DT05URVhUKTtcbmNvbnN0IFBSRVNFUlZFX0ZJTEVTID0gbm9ybWFsaXplRW52IChwcm9jZXNzLmVudi5UUkFDRV9GSUxFKTtcbmNvbnN0IFBSRVNFUlZFX0xFVkVMUyA9IG5vcm1hbGl6ZUVudiAocHJvY2Vzcy5lbnYuVFJBQ0VfTEVWRUwpO1xuXG4vKipcbiAqIE5vcm1hbGl6ZSBhbiBlbnZpcm9ubWVudCB2YXJpYWJsZSwgdXNlZCB0byBvdmVycmlkZSBwbHVnaW4gb3B0aW9ucy5cbiAqL1xuZnVuY3Rpb24gbm9ybWFsaXplRW52IChpbnB1dCl7XG4gICAgaWYgKCFpbnB1dCkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIHJldHVybiBpbnB1dC5zcGxpdCAoJywnKVxuICAgIC5tYXAgKGNvbnRleHQgPT4gY29udGV4dC50b0xvd2VyQ2FzZSAoKS50cmltICgpKVxuICAgIC5maWx0ZXIgKGlkID0+IGlkKTtcbn1cblxuLyoqXG4gKiBMaWtlIGB0ZW1wbGF0ZSgpYCBidXQgcmV0dXJucyBhbiBleHByZXNzaW9uLCBub3QgYW4gZXhwcmVzc2lvbiBzdGF0ZW1lbnQuXG4gKi9cbmZ1bmN0aW9uIGV4cHJlc3Npb24gKGlucHV0LCB0ZW1wbGF0ZSkge1xuICAgIGNvbnN0IGZuID0gdGVtcGxhdGUgKGlucHV0KTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGlkcykge1xuICAgICAgICBjb25zdCBub2RlID0gZm4gKGlkcyk7XG4gICAgICAgIHJldHVybiBub2RlLmV4cHJlc3Npb24gPyBub2RlLmV4cHJlc3Npb24gOiBub2RlO1xuICAgIH07XG59XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgbG9nKCkgZnVuY3Rpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRMb2dGdW5jdGlvbiAoe3R5cGVzOiB0LCB0ZW1wbGF0ZX0sIGxvZ0xldmVsKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIGxvZyAobWVzc2FnZSwgbWV0YWRhdGEpIHtcbiAgICAgICAgbGV0IG1lc3NhZ2VFeHByZXNzaW9uID0gbWVzc2FnZS5tZXNzYWdlRXhwcmVzc2lvbjtcbiAgICAgICAgbGV0IHByZWZpeCA9IGAke21ldGFkYXRhLmNvbnRleHR9OmA7XG4gICAgICAgIGlmIChtZXRhZGF0YS5pbmRlbnQpIHtcbiAgICAgICAgICAgIHByZWZpeCArPSAobmV3IEFycmF5IChtZXRhZGF0YS5pbmRlbnQgKyAxKSkuam9pbiAoJyAgJyk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIGlmICh0LmlzU2VxdWVuY2VFeHByZXNzaW9uIChtZXNzYWdlLmNvbnRlbnQpKSB7XG4gICAgICAgICAgICByZXR1cm4gdC5jYWxsRXhwcmVzc2lvbiAoXG4gICAgICAgICAgICAgICAgdC5tZW1iZXJFeHByZXNzaW9uIChcbiAgICAgICAgICAgICAgICAgICAgdC5pZGVudGlmaWVyICgnY29uc29sZScpLFxuICAgICAgICAgICAgICAgICAgICB0LmlkZW50aWZpZXIgKGxvZ0xldmVsKVxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgW3Quc3RyaW5nTGl0ZXJhbCAocHJlZml4KV0uY29uY2F0IChtZXNzYWdlLmNvbnRlbnQuZXhwcmVzc2lvbnMpXG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgTElORSA9IG1ldGFkYXRhLnBhdGgubm9kZS5sb2Muc3RhcnQubGluZTtcbiAgICAgICAgICAgIHJldHVybiBleHByZXNzaW9uIChgVk1fUlVOTkVSX1RSQUNFLmFwcGx5KHtsaW5lOkxJTkV9LFtMT0dMRVZFTCwgUFJFRklYLCBNRVNTQUdFLCAgREFUQV0pYCwgdGVtcGxhdGUpICh7XG4gICAgICAgICAgICAgICAgTE9HTEVWRUw6IHQuc3RyaW5nTGl0ZXJhbCAobG9nTGV2ZWwpLFxuICAgICAgICAgICAgICAgIFBSRUZJWDogdC5zdHJpbmdMaXRlcmFsIChwcmVmaXgpLFxuICAgICAgICAgICAgICAgIERBVEE6IG1lc3NhZ2UuY29udGVudCxcbiAgICAgICAgICAgICAgICBMSU5FOnQubnVtZXJpY0xpdGVyYWwoTElORSksXG4gICAgICAgICAgICAgICAgVk1fUlVOTkVSX1RSQUNFOnQuaWRlbnRpZmllciAoJ1ZNX1JVTk5FUl9UUkFDRScpLFxuICAgICAgICAgICAgICAgIE1FU1NBR0U6bWVzc2FnZUV4cHJlc3Npb25cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZVByZWZpeCAoZGlybmFtZSwgYmFzZW5hbWUpIHtcbiAgICBpZiAoYmFzZW5hbWUgIT09ICdpbmRleCcpIHtcbiAgICAgICAgcmV0dXJuIGJhc2VuYW1lO1xuICAgIH1cbiAgICBiYXNlbmFtZSA9IGZzcGF0aC5iYXNlbmFtZSAoZGlybmFtZSk7XG4gICAgaWYgKGJhc2VuYW1lICE9PSAnc3JjJyAmJiBiYXNlbmFtZSAhPT0gJ2xpYicpIHtcbiAgICAgICAgcmV0dXJuIGJhc2VuYW1lO1xuICAgIH1cbiAgICByZXR1cm4gZnNwYXRoLmJhc2VuYW1lIChmc3BhdGguZGlybmFtZSAoZGlybmFtZSkpO1xufVxuXG4vKipcbiAqIENvbGxlY3QgdGhlIG1ldGFkYXRhIGZvciBhIGdpdmVuIG5vZGUgcGF0aCwgd2hpY2ggd2lsbCBiZVxuICogbWFkZSBhdmFpbGFibGUgdG8gbG9nZ2luZyBmdW5jdGlvbnMuXG4gKi9cbmZ1bmN0aW9uIGNvbGxlY3RNZXRhZGF0YSAocGF0aCwgb3B0cykge1xuICAgIGNvbnN0IGZpbGVuYW1lID0gZnNwYXRoLnJlc29sdmUgKHByb2Nlc3MuY3dkICgpLCBwYXRoLmh1Yi5maWxlLm9wdHMuZmlsZW5hbWUpO1xuICAgIGNvbnN0IGRpcm5hbWUgPSBmc3BhdGguZGlybmFtZSAoZmlsZW5hbWUpO1xuICAgIGNvbnN0IGV4dG5hbWUgPSBmc3BhdGguZXh0bmFtZSAoZmlsZW5hbWUpO1xuICAgIGNvbnN0IGJhc2VuYW1lID0gZnNwYXRoLmJhc2VuYW1lIChmaWxlbmFtZSwgZXh0bmFtZSk7XG4gICAgY29uc3QgcHJlZml4ID0gZ2VuZXJhdGVQcmVmaXggKGRpcm5hbWUsIGJhc2VuYW1lKTtcbiAgICBjb25zdCBuYW1lcyA9IFtdO1xuICAgIGxldCBpbmRlbnQgPSAwO1xuICAgIGxldCBwYXJlbnQ7XG5cbiAgICBjb25zdCBwYXJlbnROYW1lID0gcGF0aC5nZXRBbmNlc3RyeSAoKS5zbGljZSAoMSkucmVkdWNlICgocGFydHMsIGl0ZW0pID0+IHtcbiAgICAgICAgaWYgKGl0ZW0uaXNDbGFzc01ldGhvZCAoKSkge1xuICAgICAgICAgICAgaWYgKCFwYXJlbnQpIHtcbiAgICAgICAgICAgICAgICBwYXJlbnQgPSBpdGVtO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGFydHMudW5zaGlmdCAoaXRlbS5ub2RlLmtleS50eXBlID09PSAnSWRlbnRpZmllcicgPyBpdGVtLm5vZGUua2V5Lm5hbWUgOiAnW2NvbXB1dGVkIG1ldGhvZF0nKTtcbiAgICAgICAgfSBlbHNlIGlmIChpdGVtLmlzQ2xhc3NEZWNsYXJhdGlvbiAoKSkge1xuICAgICAgICAgICAgaWYgKCFwYXJlbnQpIHtcbiAgICAgICAgICAgICAgICBwYXJlbnQgPSBpdGVtO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGFydHMudW5zaGlmdCAoaXRlbS5ub2RlLmlkID8gaXRlbS5ub2RlLmlkLm5hbWUgOiBgW2Fub255bW91cyBjbGFzc0Ake2l0ZW0ubm9kZS5sb2Muc3RhcnQubGluZX1dYCk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXRlbS5pc0Z1bmN0aW9uICgpKSB7XG4gICAgICAgICAgICBpZiAoIXBhcmVudCkge1xuICAgICAgICAgICAgICAgIHBhcmVudCA9IGl0ZW07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwYXJ0cy51bnNoaWZ0ICgoaXRlbS5ub2RlLmlkICYmIGl0ZW0ubm9kZS5pZC5uYW1lKSB8fCBgW2Fub255bW91c0Ake2l0ZW0ubm9kZS5sb2Muc3RhcnQubGluZX1dYCk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXRlbS5pc1Byb2dyYW0gKCkpIHtcbiAgICAgICAgICAgIGlmICghcGFyZW50KSB7XG4gICAgICAgICAgICAgICAgcGFyZW50ID0gaXRlbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICghcGFyZW50ICYmICFpdGVtLmlzQ2xhc3NCb2R5ICgpICYmICFpdGVtLmlzQmxvY2tTdGF0ZW1lbnQgKCkpIHtcbiAgICAgICAgICAgIGluZGVudCsrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYXJ0cztcbiAgICB9LCBbXSkuam9pbiAoJzonKTtcblxuICAgIGxldCBoYXNTdGFydE1lc3NhZ2UgPSBmYWxzZTtcbiAgICBsZXQgaXNTdGFydE1lc3NhZ2UgPSBmYWxzZTtcbiAgICBpZiAocGFyZW50ICYmICFwYXJlbnQuaXNQcm9ncmFtICgpKSB7XG4gICAgICAgIGZvciAobGV0IGNoaWxkIG9mIHBhcmVudC5nZXQgKCdib2R5JykuZ2V0ICgnYm9keScpKSB7XG4gICAgICAgICAgICBpZiAoY2hpbGQubm9kZVskaGFuZGxlZF0pIHtcbiAgICAgICAgICAgICAgICBoYXNTdGFydE1lc3NhZ2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFjaGlsZC5pc0xhYmVsZWRTdGF0ZW1lbnQgKCkpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGxhYmVsID0gY2hpbGQuZ2V0ICgnbGFiZWwnKTtcbiAgICAgICAgICAgIGlmIChvcHRzLmFsaWFzZXNbbGFiZWwubm9kZS5uYW1lXSkge1xuICAgICAgICAgICAgICAgIGhhc1N0YXJ0TWVzc2FnZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkLm5vZGUgPT09IHBhdGgubm9kZSkge1xuICAgICAgICAgICAgICAgICAgICBpc1N0YXJ0TWVzc2FnZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgY29udGV4dCA9IGAke3ByZWZpeH06JHtwYXJlbnROYW1lfWA7XG4gICAgcmV0dXJuIHtpbmRlbnQsIHByZWZpeCwgcGFyZW50TmFtZSwgY29udGV4dCwgaGFzU3RhcnRNZXNzYWdlLCBpc1N0YXJ0TWVzc2FnZSwgZmlsZW5hbWUsIGRpcm5hbWUsIGJhc2VuYW1lLCBleHRuYW1lLCBwYXRofTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gbG9nZ2luZyBzdGF0ZW1lbnQgc2hvdWxkIGJlIHN0cmlwcGVkLlxuICovXG5mdW5jdGlvbiBzaG91bGRTdHJpcCAobmFtZSwgbWV0YWRhdGEsIHtzdHJpcH0pIHtcbiAgICBzd2l0Y2ggKHR5cGVvZiBzdHJpcCkge1xuICAgICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgICAgIGlmICghc3RyaXApIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIC8vIHN0cmlwID09PSB0cnVlXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgICAgIGNvbnN0IHNlID0gc3RyaXBbbmFtZV07XG4gICAgICAgICAgICBpZiAoIXNlIHx8ICh0eXBlb2Ygc2UgPT09ICdvYmplY3QnICYmICFzZVtwcm9jZXNzLmVudi5OT0RFX0VOVl0pKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAvLyBzdHJpcFtuYW1lXSA9PT0gdHJ1ZSB8fCBzdHJpcFtuYW1lXVtlbnZdID09PSB0cnVlXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKFBSRVNFUlZFX0NPTlRFWFRTLmxlbmd0aCkge1xuICAgICAgICBjb25zdCBjb250ZXh0ID0gbWV0YWRhdGEuY29udGV4dC50b0xvd2VyQ2FzZSAoKTtcbiAgICAgICAgaWYgKFBSRVNFUlZFX0NPTlRFWFRTLnNvbWUgKHBjID0+IGNvbnRleHQuaW5jbHVkZXMgKHBjKSkpIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKFBSRVNFUlZFX0ZJTEVTLmxlbmd0aCkge1xuICAgICAgICBjb25zdCBmaWxlbmFtZSA9IG1ldGFkYXRhLmZpbGVuYW1lLnRvTG93ZXJDYXNlICgpO1xuICAgICAgICBpZiAoUFJFU0VSVkVfRklMRVMuc29tZSAocGYgPT4gZmlsZW5hbWUuaW5jbHVkZXMgKHBmKSkpIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKFBSRVNFUlZFX0xFVkVMUy5sZW5ndGgpIHtcbiAgICAgICAgY29uc3QgbGV2ZWwgPSBuYW1lLnRvTG93ZXJDYXNlICgpO1xuICAgICAgICBpZiAoUFJFU0VSVkVfTEVWRUxTLnNvbWUgKHBsID0+IGxldmVsID09PSBwbCkpIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGVMYWJlbGVkU3RhdGVtZW50IChiYWJlbCwgcGF0aCwgb3B0cykge1xuICAgIGNvbnN0IHQgPSBiYWJlbC50eXBlcztcbiAgICBjb25zdCBsYWJlbCA9IHBhdGguZ2V0ICgnbGFiZWwnKTtcbiAgICBvcHRzID0gKGZ1bmN0aW9uIG5vcm1hbGl6ZU9wdHMgKGJhYmVsLCBvcHRzKSB7XG4gICAgICAgIGlmIChvcHRzWyRub3JtYWxpemVkXSkge1xuICAgICAgICAgICAgcmV0dXJuIG9wdHM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFvcHRzLmFsaWFzZXMpIHtcbiAgICAgICAgICAgIG9wdHMuYWxpYXNlcyA9IHtcbiAgICAgICAgICAgICAgICBsb2c6IGdldExvZ0Z1bmN0aW9uIChiYWJlbCwgJ2xvZycpLFxuICAgICAgICAgICAgICAgIHRyYWNlOiBnZXRMb2dGdW5jdGlvbiAoYmFiZWwsICd0cmFjZScpLFxuICAgICAgICAgICAgICAgIHdhcm46IGdldExvZ0Z1bmN0aW9uIChiYWJlbCwgJ3dhcm4nKSxcbiAgICAgICAgICAgICAgICBlcnJvcjpnZXRMb2dGdW5jdGlvbihiYWJlbCwnZXJyb3InKSxcbiAgICAgICAgICAgICAgICBkZWJ1ZzpnZXRMb2dGdW5jdGlvbihiYWJlbCwnZGVidWcnKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzIChvcHRzLmFsaWFzZXMpLmZvckVhY2ggKGtleSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRzLmFsaWFzZXNba2V5XSA9PT0gJ3N0cmluZycgJiYgb3B0cy5hbGlhc2VzW2tleV0pIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXhwciA9IGV4cHJlc3Npb24gKG9wdHMuYWxpYXNlc1trZXldLCBiYWJlbC50ZW1wbGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgIG9wdHMuYWxpYXNlc1trZXldID0gKG1lc3NhZ2UpID0+IGV4cHIgKG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRzLnN0cmlwID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIG9wdHMuc3RyaXAgPSB7XG4gICAgICAgICAgICAgICAgbG9nOiB7cHJvZHVjdGlvbjogdHJ1ZX0sXG4gICAgICAgICAgICAgICAgdHJhY2U6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHdhcm46IHtwcm9kdWN0aW9uOiB0cnVlfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBvcHRzWyRub3JtYWxpemVkXSA9IHRydWU7XG4gICAgICAgIHJldHVybiBvcHRzO1xuICAgIH0pKGJhYmVsLCBvcHRzKTtcblxuICAgIGNvbnN0IGxhYmVsTmFtZSA9IGxhYmVsLm5vZGUubmFtZTtcbiAgICBjb25zdCB2YXJpYWJsZXMgPSAgW107XG5cbiAgICBjb25zdCBtZXRob2RQYXRoID0gZ2V0KHBhdGgsJ3BhcmVudFBhdGgucGFyZW50UGF0aCcsbnVsbCk7XG4gICAgaWYobWV0aG9kUGF0aCAmJlsnQ2xhc3NNZXRob2QnLCdPYmplY3RNZXRob2QnXS5pbmRleE9mKG1ldGhvZFBhdGgudHlwZSk+LTEmJiFtZXRob2RQYXRoLm5vZGUuc3RhdGljKXtcbiAgICAgICAgdmFyaWFibGVzLnB1c2goJ3RoaXMnKTtcbiAgICB9XG4gICAgXy5lYWNoKCBwYXRoLnNjb3BlLmJpbmRpbmdzICwgKHZhbCxrZXkpPT57XG4gICAgICAgIGlmKHZhcmlhYmxlcy5pbmRleE9mKGtleSk9PS0xKVxuICAgICAgICAgICAgdmFyaWFibGVzLnB1c2goa2V5KTtcbiAgICB9KTtcblxuXG4gICAgY29uc3QgYWxpYXMgPSBvcHRzLmFsaWFzZXNbbGFiZWxOYW1lXVxuICAgIGlmICghYWxpYXMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBtZXRhZGF0YSA9IGNvbGxlY3RNZXRhZGF0YSAocGF0aCwgb3B0cyk7XG4gICAgaWYgKHNob3VsZFN0cmlwIChsYWJlbC5ub2RlLm5hbWUsIG1ldGFkYXRhLCBvcHRzKSkge1xuICAgICAgICBwYXRoLnJlbW92ZSAoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHBhdGgudHJhdmVyc2UgKHtcbiAgICAgICAgXCJFbXB0eVN0YXRlbWVudFwiIChlbXB0eVN0YXRlbWVudCl7XG4gICAgICAgICAgICBsZXQgcHJvcGVydGllcyA9IF8ubWFwICh2YXJpYWJsZXMsICh2YXJOYW1lKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGtleSA9IHQuSWRlbnRpZmllciAodmFyTmFtZSk7XG4gICAgICAgICAgICAgICAgbGV0IHZhbHVlO1xuICAgICAgICAgICAgICAgIGlmKHZhck5hbWUhPSd0aGlzJykge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHQuSWRlbnRpZmllciAodmFyTmFtZSk7XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdC50aGlzRXhwcmVzc2lvbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdC5vYmplY3RQcm9wZXJ0eSAoa2V5LCB2YWx1ZSwgZmFsc2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBsZXQgcmVwbGFjZW1lbnQgPSB0Lm9iamVjdEV4cHJlc3Npb24gKHByb3BlcnRpZXMpO1xuICAgICAgICAgICAgcmVwbGFjZW1lbnRbJGhhbmRsZWRdID0gdHJ1ZTtcbiAgICAgICAgICAgIGVtcHR5U3RhdGVtZW50LnJlcGxhY2VXaXRoIChyZXBsYWNlbWVudCk7XG4gICAgICAgIH0sXG4gICAgICAgIC8qXCJUZW1wbGF0ZUxpdGVyYWx8U3RyaW5nTGl0ZXJhbFwiKGl0ZW0pe1xuXG4gICAgICAgIH0sKi9cbiAgICAgICAgXCJWYXJpYWJsZURlY2xhcmF0aW9ufEZ1bmN0aW9ufEFzc2lnbm1lbnRFeHByZXNzaW9ufFVwZGF0ZUV4cHJlc3Npb258WWllbGRFeHByZXNzaW9ufFJldHVyblN0YXRlbWVudFwiIChpdGVtKSB7XG4gICAgICAgICAgICB0aHJvdyBwYXRoLmJ1aWxkQ29kZUZyYW1lRXJyb3IgKGBMb2dnaW5nIHN0YXRlbWVudHMgY2Fubm90IGhhdmUgc2lkZSBlZmZlY3RzLiAke2l0ZW0udHlwZX1gKTtcbiAgICAgICAgfSxcbiAgICAgICAgRXhwcmVzc2lvblN0YXRlbWVudCAoc3RhdGVtZW50KSB7XG4gICAgICAgICAgICBpZiAoc3RhdGVtZW50Lm5vZGVbJGhhbmRsZWRdKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IHRhcmdldE5vZGUgPSBzdGF0ZW1lbnQuZ2V0ICgnZXhwcmVzc2lvbicpLm5vZGU7XG4gICAgICAgICAgICBjb25zdCBtZXNzYWdlRWxlbWVudHMgPSBbXTtcbiAgICAgICAgICAgIGlmKHRhcmdldE5vZGUudHlwZT09PSdTZXF1ZW5jZUV4cHJlc3Npb24nKXtcbiAgICAgICAgICAgICAgICBsZXQgcHJvcGVydGllcyA9IF8uY2hhaW4odGFyZ2V0Tm9kZS5leHByZXNzaW9ucykubWFwKChleHByZXNzaW9uTm9kZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZihbJ0lkZW50aWZpZXInLCdUaGlzRXhwcmVzc2lvbiddLmluZGV4T2YoZXhwcmVzc2lvbk5vZGUudHlwZSk+LTEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHZhck5hbWUgPSBleHByZXNzaW9uTm9kZS50eXBlPT09J0lkZW50aWZpZXInP2V4cHJlc3Npb25Ob2RlLm5hbWU6J3RoaXMnO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGtleSA9IHQuSWRlbnRpZmllciAodmFyTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihleHByZXNzaW9uTm9kZS50eXBlPT09J0lkZW50aWZpZXInKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB0LklkZW50aWZpZXIgKHZhck5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB0LnRoaXNFeHByZXNzaW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdC5vYmplY3RQcm9wZXJ0eSAoa2V5LCB2YWx1ZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICB9ZWxzZSBpZihbJ1N0cmluZ0xpdGVyYWwnLCdUZW1wbGF0ZUxpdGVyYWwnXS5pbmRleE9mKGV4cHJlc3Npb25Ob2RlLnR5cGUpPi0xKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VFbGVtZW50cy5wdXNoKGV4cHJlc3Npb25Ob2RlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pLmNvbXBhY3QoKS52YWx1ZSgpO1xuICAgICAgICAgICAgICAgIGlmKCBfLmlzRW1wdHkocHJvcGVydGllcykgJiYgIV8uaXNFbXB0eShtZXNzYWdlRWxlbWVudHMpICl7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwcm9wZXJ0aWVzID0gXy5tYXAgKHZhcmlhYmxlcywgKHZhck5hbWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBrZXkgPSB0LklkZW50aWZpZXIgKHZhck5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYodmFyTmFtZSE9J3RoaXMnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB0LklkZW50aWZpZXIgKHZhck5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB0LnRoaXNFeHByZXNzaW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdC5vYmplY3RQcm9wZXJ0eSAoa2V5LCB2YWx1ZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0Tm9kZSA9IHQub2JqZWN0RXhwcmVzc2lvbiAocHJvcGVydGllcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0Tm9kZSA9IHQub2JqZWN0RXhwcmVzc2lvbiAocHJvcGVydGllcyk7XG4gICAgICAgICAgICB9ZWxzZSBpZihbJ1RlbXBsYXRlTGl0ZXJhbCcsJ1N0cmluZ0xpdGVyYWwnXS5pbmRleE9mKHRhcmdldE5vZGUudHlwZSk+LTEpe1xuICAgICAgICAgICAgICAgIG1lc3NhZ2VFbGVtZW50cy5wdXNoKHRhcmdldE5vZGUpO1xuXG4gICAgICAgICAgICAgICAgbGV0IHByb3BlcnRpZXMgPSBfLm1hcCAodmFyaWFibGVzLCAodmFyTmFtZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQga2V5ID0gdC5JZGVudGlmaWVyICh2YXJOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBpZih2YXJOYW1lIT0ndGhpcycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdC5JZGVudGlmaWVyICh2YXJOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHQudGhpc0V4cHJlc3Npb24oKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdC5vYmplY3RQcm9wZXJ0eSAoa2V5LCB2YWx1ZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRhcmdldE5vZGUgPSB0Lm9iamVjdEV4cHJlc3Npb24gKHByb3BlcnRpZXMpO1xuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2VFeHByZXNzaW9uID0gdC5jYWxsRXhwcmVzc2lvbihcbiAgICAgICAgICAgICAgICB0Lm1lbWJlckV4cHJlc3Npb24oXG4gICAgICAgICAgICAgICAgICAgIHQuYXJyYXlFeHByZXNzaW9uKG1lc3NhZ2VFbGVtZW50cyksLy9vYmplY3RcbiAgICAgICAgICAgICAgICAgICAgdC5pZGVudGlmaWVyKCdqb2luJyksLy9wcm9wZXJ0eVxuICAgICAgICAgICAgICAgICAgICBmYWxzZS8vY29tcHV0ZWRcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgLCBbXG4gICAgICAgICAgICAgICAgICAgIHQuc3RyaW5nTGl0ZXJhbCgnICcpXG4gICAgICAgICAgICAgICAgXSk7XG5cbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZUV4cHJlc3Npb24sXG4gICAgICAgICAgICAgICAgcHJlZml4OiB0LnN0cmluZ0xpdGVyYWwgKG1ldGFkYXRhLnByZWZpeCksXG4gICAgICAgICAgICAgICAgY29udGVudDogdGFyZ2V0Tm9kZSxcbiAgICAgICAgICAgICAgICBoYXNTdGFydE1lc3NhZ2U6IHQuYm9vbGVhbkxpdGVyYWwgKG1ldGFkYXRhLmhhc1N0YXJ0TWVzc2FnZSksXG4gICAgICAgICAgICAgICAgaXNTdGFydE1lc3NhZ2U6IHQuYm9vbGVhbkxpdGVyYWwgKG1ldGFkYXRhLmlzU3RhcnRNZXNzYWdlKSxcbiAgICAgICAgICAgICAgICBpbmRlbnQ6IHQubnVtZXJpY0xpdGVyYWwgKG1ldGFkYXRhLmluZGVudCksXG4gICAgICAgICAgICAgICAgcGFyZW50TmFtZTogdC5zdHJpbmdMaXRlcmFsIChtZXRhZGF0YS5wYXJlbnROYW1lKSxcbiAgICAgICAgICAgICAgICBmaWxlbmFtZTogdC5zdHJpbmdMaXRlcmFsIChtZXRhZGF0YS5maWxlbmFtZSksXG4gICAgICAgICAgICAgICAgZGlybmFtZTogdC5zdHJpbmdMaXRlcmFsIChtZXRhZGF0YS5kaXJuYW1lKSxcbiAgICAgICAgICAgICAgICBiYXNlbmFtZTogdC5zdHJpbmdMaXRlcmFsIChtZXRhZGF0YS5iYXNlbmFtZSksXG4gICAgICAgICAgICAgICAgZXh0bmFtZTogdC5zdHJpbmdMaXRlcmFsIChtZXRhZGF0YS5leHRuYW1lKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNvbnN0IHJlcGxhY2VtZW50ID0gdC5leHByZXNzaW9uU3RhdGVtZW50IChhbGlhcyAobWVzc2FnZSwgbWV0YWRhdGEpKTtcbiAgICAgICAgICAgIHJlcGxhY2VtZW50WyRoYW5kbGVkXSA9IHRydWU7XG4gICAgICAgICAgICBzdGF0ZW1lbnQucmVwbGFjZVdpdGggKHJlcGxhY2VtZW50KTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHBhdGgubm9kZSkge1xuICAgICAgICBpZiAocGF0aC5nZXQgKCdib2R5JykuaXNCbG9ja1N0YXRlbWVudCAoKSkge1xuICAgICAgICAgICAgcGF0aC5yZXBsYWNlV2l0aE11bHRpcGxlIChwYXRoLmdldCAoJ2JvZHknKS5ub2RlLmJvZHkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGF0aC5yZXBsYWNlV2l0aCAocGF0aC5nZXQgKCdib2R5Jykubm9kZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5jb25zdCB3cmFwVm1SdW5uZXIgPSB0ZW1wbGF0ZSAoYFxubGV0IFZNX1JVTk5FUl9SVU5fSUQgPSAnJztcblxuZnVuY3Rpb24gZ2VuZXJhdGVVaWQoKXtcbiAgICB2YXIgdT0nJyxpPTA7IHZhciBmb3VyID0gNDtcbiAgICB2YXIgcGF0dGVybiA9ICd4eHh4eHh4eC14eHh4LScrZm91cisneHh4LXl4eHgteHh4eHh4eHh4eHh4JztcbiAgICB3aGlsZShpKys8MzYpIHtcbiAgICAgICAgdmFyIGM9cGF0dGVybltpLTFdLFxuICAgICAgICByPU1hdGgucmFuZG9tKCkqMTZ8MCx2PWM9PSd4Jz9yOihyJjB4M3wweDgpO1xuICAgICAgICB1Kz0oYz09Jy0nfHxjPT1mb3VyKT9jOnYudG9TdHJpbmcoMTYpXG4gICAgfVxuICAgIHJldHVybiB1O1xufSBcblxuaWYoIHR5cGVvZih2bTJPcHRpb25zKT09PSd1bmRlZmluZWQnICl7XG4gIHZtMk9wdGlvbnMgPSB7fTtcbn1cbmxldCBWTV9SVU5ORVJfSEFTSCA9IHZtMk9wdGlvbnMuVk1fUlVOTkVSX0hBU0g7XG5sZXQgY3VzdG9tT3B0aW9ucyA9IHZtMk9wdGlvbnMuY3VzdG9tT3B0aW9ucyB8fCB7fTtcbmxldCB0cmFjZU9wdGlvbnMgPSBjdXN0b21PcHRpb25zLnRyYWNlfHx7fTtcbmxldCB2bTJFeHByZXNzaW9uID0gdm0yT3B0aW9ucy5leHByZXNzaW9uIHx8IG51bGw7XG52bTJFeHByZXNzaW9uID0gU3RyaW5nKHZtMkV4cHJlc3Npb24pO1xuXG5cbmxldCBWTV9SVU5ORVJfVFJBQ0UgPSBmdW5jdGlvbihsb2dMZXZlbCxwcmVmaXgsbWVzc2FnZSxkYXRhKXtcbiAgICB2YXIgYWxpYXMgPSB0cmFjZU9wdGlvbnMgJiYgdHJhY2VPcHRpb25zLmFsaWFzZXMgJiYgdHJhY2VPcHRpb25zLmFsaWFzZXNbbG9nTGV2ZWxdIDtcbiAgICB2YXIgbWVzc2FnZU9iaiA9IHtcbiAgICAgICAgZnJhbWU6dm1Db2RlRnJhbWUodm0yRXhwcmVzc2lvbix0aGlzLmxpbmUpLFxuICAgICAgICBwcmVmaXg6cHJlZml4LFxuICAgICAgICBtZXNzYWdlOm1lc3NhZ2UsXG4gICAgICAgIGxvZ0xldmVsOmxvZ0xldmVsLFxuICAgICAgICBkYXRhOmRhdGEsXG4gICAgICAgIGxpbmU6dGhpcy5saW5lLFxuICAgICAgICBkYXRlOm5ldyBEYXRlKClcbiAgICB9XG4gICAgaWYoIGFsaWFzICl7XG4gICAgICAgIHRyeXtcbiAgICAgICAgICAgIHJldHVybiBhbGlhcy5hcHBseSh0aGlzLFttZXNzYWdlT2JqXSk7XG4gICAgICAgIH1jYXRjaChlKXtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5yZXR1cm4gKGZ1bmN0aW9uIHZtUnVubmVyV3JhcHBlcigpIHtcbiAgICBWTV9SVU5ORVJfUlVOX0lEID0gZ2VuZXJhdGVVaWQoKTtcbiAgICBcbiAgICBCT0RZO1xufSkuYXBwbHkodGhpcyk7XG5gKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKGJhYmVsKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdmlzaXRvcjoge1xuICAgICAgICAgICAgUHJvZ3JhbSAocHJvZ3JhbSwge29wdHN9KSB7XG4gICAgICAgICAgICAgICAgcHJvZ3JhbS50cmF2ZXJzZSAoe1xuICAgICAgICAgICAgICAgICAgICBEaXJlY3RpdmVMaXRlcmFsKHBhdGgpe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoXy5pc0VtcHR5KHByb2dyYW0ubm9kZS5ib2R5KSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmV0dXJuU3RhdGVtZW50ID0gYmFiZWwudHlwZXMucmV0dXJuU3RhdGVtZW50KGJhYmVsLnR5cGVzLnN0cmluZ0xpdGVyYWwocGF0aC5ub2RlLnZhbHVlKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9ncmFtLnVuc2hpZnRDb250YWluZXIoJ2JvZHknLCByZXR1cm5TdGF0ZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBMYWJlbGVkU3RhdGVtZW50IChwYXRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVMYWJlbGVkU3RhdGVtZW50IChiYWJlbCwgcGF0aCwgb3B0cyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGlmICghcHJvZ3JhbS52bVJ1bm5lcldyYXBwZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvZ3JhbS52bVJ1bm5lcldyYXBwZXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB2YXIgd3JhcHBlZCA9IHdyYXBWbVJ1bm5lciAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgQk9EWTogcHJvZ3JhbS5ub2RlLmJvZHksXG4gICAgICAgICAgICAgICAgICAgICAgICBWTV9SVU5ORVJfUlVOX0lEOmJhYmVsLnR5cGVzLmlkZW50aWZpZXIgKCdWTV9SVU5ORVJfUlVOX0lEJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBWTV9SVU5ORVJfSEFTSDpiYWJlbC50eXBlcy5pZGVudGlmaWVyICgnVk1fUlVOTkVSX0hBU0gnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFZNX1JVTk5FUl9UUkFDRTpiYWJlbC50eXBlcy5pZGVudGlmaWVyICgnVk1fUlVOTkVSX1RSQUNFJyksXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHByb2dyYW0ucmVwbGFjZVdpdGggKFxuICAgICAgICAgICAgICAgICAgICAgICAgYmFiZWwudHlwZXMucHJvZ3JhbSAod3JhcHBlZClcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcHJvZ3JhbS5ub2RlLmRpcmVjdGl2ZXMgPSBbXTtcblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbn1cbiJdfQ==