"use strict";var _interopRequireDefault3 = require("@babel/runtime/helpers/interopRequireDefault");var _interopRequireDefault2 = _interopRequireDefault3(require("@babel/runtime/helpers/interopRequireDefault"));Object.defineProperty(exports, "__esModule", { value: true });var _typeof2 = require("@babel/runtime/helpers/typeof");var _typeof = (0, _interopRequireDefault2["default"])(_typeof2)["default"];exports.





































getLogFunction = getLogFunction;exports.






































































































































































handleLabeledStatement = handleLabeledStatement;exports["default"] =




































































































































function (babel) {
  return {
    visitor: {
      Program: function Program(program, _ref3) {var opts = _ref3.opts;
        program.traverse({
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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        */function getLogFunction(_ref, logLevel) {var t = _ref.types,template = _ref.template;return function log(message, metadata) {var prefix = "".concat(metadata.context, ":");if (metadata.indent) {prefix += new Array(metadata.indent + 1).join('  ');}if (t.isSequenceExpression(message.content)) {return t.callExpression(t.memberExpression(t.identifier('console'), t.identifier(logLevel)), [t.stringLiteral(prefix)].concat(message.content.expressions));} else {return expression("VM_RUNNER_TRACE(LOGLEVEL,PREFIX, DATA)", template)({ LOGLEVEL: t.stringLiteral(logLevel), PREFIX: t.stringLiteral(prefix), DATA: message.content, VM_RUNNER_TRACE: t.identifier('VM_RUNNER_TRACE') });}};} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 * Normalize the plugin options.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 */function normalizeOpts(babel, opts) {if (opts[$normalized]) {return opts;}if (!opts.aliases) {var log = getLogFunction(babel, 'log');opts.aliases = { log: getLogFunction(babel, 'log'), trace: getLogFunction(babel, 'trace'), warn: getLogFunction(babel, 'warn') };} else {Object.keys(opts.aliases).forEach(function (key) {if (typeof opts.aliases[key] === 'string' && opts.aliases[key]) {var expr = expression(opts.aliases[key], babel.template);opts.aliases[key] = function (message) {return expr(message);};}});}if (opts.strip === undefined) {opts.strip = { log: { production: true }, trace: false, warn: { production: true } };}opts[$normalized] = true;return opts;}function generatePrefix(dirname, basename) {if (basename !== 'index') {return basename;}basename = fspath.basename(dirname);if (basename !== 'src' && basename !== 'lib') {return basename;}return fspath.basename(fspath.dirname(dirname));} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           * Collect the metadata for a given node path, which will be
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           * made available to logging functions.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           */function collectMetadata(path, opts) {var filename = fspath.resolve(process.cwd(), path.hub.file.opts.filename);var dirname = fspath.dirname(filename);var extname = fspath.extname(filename);var basename = fspath.basename(filename, extname);var prefix = generatePrefix(dirname, basename);var names = [];var indent = 0;var parent;var parentName = path.getAncestry().slice(1).reduce(function (parts, item) {if (item.isClassMethod()) {if (!parent) {parent = item;}parts.unshift(item.node.key.type === 'Identifier' ? item.node.key.name : '[computed method]');} else if (item.isClassDeclaration()) {if (!parent) {parent = item;}parts.unshift(item.node.id ? item.node.id.name : "[anonymous class@".concat(item.node.loc.start.line, "]"));} else if (item.isFunction()) {if (!parent) {parent = item;}parts.unshift(item.node.id && item.node.id.name || "[anonymous@".concat(item.node.loc.start.line, "]"));} else if (item.isProgram()) {if (!parent) {parent = item;}} else if (!parent && !item.isClassBody() && !item.isBlockStatement()) {indent++;}return parts;}, []).join(':');var hasStartMessage = false;var isStartMessage = false;if (parent && !parent.isProgram()) {var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {for (var _iterator = parent.get('body').get('body')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var child = _step.value;if (child.node[$handled]) {hasStartMessage = true;break;}if (!child.isLabeledStatement()) {break;}var label = child.get('label');if (opts.aliases[label.node.name]) {hasStartMessage = true;if (child.node === path.node) {isStartMessage = true;}break;}}} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator["return"] != null) {_iterator["return"]();}} finally {if (_didIteratorError) {throw _iteratorError;}}}}var context = "".concat(prefix, ":").concat(parentName);return { indent: indent, prefix: prefix, parentName: parentName, context: context, hasStartMessage: hasStartMessage, isStartMessage: isStartMessage, filename: filename, dirname: dirname, basename: basename, extname: extname };} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * Determine whether the given logging statement should be stripped.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         */function shouldStrip(name, metadata, _ref2) {var strip = _ref2.strip;switch (_typeof(strip)) {case 'boolean':if (!strip) return false; // strip === true
      break;case 'object':var se = strip[name];if (!se || _typeof(se) === 'object' && !se[process.env.NODE_ENV]) return false; // strip[name] === true || strip[name][env] === true
      break;default:return false;}if (PRESERVE_CONTEXTS.length) {var context = metadata.context.toLowerCase();if (PRESERVE_CONTEXTS.some(function (pc) {return context.includes(pc);})) return false;}if (PRESERVE_FILES.length) {var filename = metadata.filename.toLowerCase();if (PRESERVE_FILES.some(function (pf) {return filename.includes(pf);})) return false;}if (PRESERVE_LEVELS.length) {var level = name.toLowerCase();if (PRESERVE_LEVELS.some(function (pl) {return level === pl;})) return false;}return true;}function handleLabeledStatement(babel, path, opts) {var t = babel.types;var label = path.get('label');opts = normalizeOpts(babel, opts);var labelName = label.node.name;var variables = [];var methodPath = get(path, 'parentPath.parentPath', null);if (methodPath && ['ClassMethod', 'ObjectMethod'].indexOf(methodPath.type) > -1 && !methodPath.node["static"]) {variables.push('this');}_.each(path.scope.bindings, function (val, key) {if (variables.indexOf(key) == -1) variables.push(key);});var alias = opts.aliases[labelName];if (!alias) {return;}var metadata = collectMetadata(path, opts);if (shouldStrip(label.node.name, metadata, opts)) {path.remove();return;}path.traverse({ "EmptyStatement": function EmptyStatement(emptyStatement) {var properties = _.map(variables, function (varName) {var key = t.Identifier(varName);var value;if (varName != 'this') {value = t.Identifier(varName);} else {value = t.thisExpression();}return t.objectProperty(key, value, false);});var replacement = t.objectExpression(properties);replacement[$handled] = true;emptyStatement.replaceWith(replacement);}, "VariableDeclaration|Function|AssignmentExpression|UpdateExpression|YieldExpression|ReturnStatement": function VariableDeclarationFunctionAssignmentExpressionUpdateExpressionYieldExpressionReturnStatement(item) {throw path.buildCodeFrameError("Logging statements cannot have side effects. ".concat(item.type));}, ExpressionStatement: function ExpressionStatement(statement) {if (statement.node[$handled]) {return;}var targetNode = statement.get('expression').node; //console.log(`ExpressionStatement:${targetNode.type}`);
      if (targetNode.type === 'SequenceExpression') {var properties = _.chain(targetNode.expressions).map(function (expressionNode) {if (['Identifier', 'ThisExpression'].indexOf(expressionNode.type) > -1) {var varName = expressionNode.type === 'Identifier' ? expressionNode.name : 'this';var key = t.Identifier(varName);var value;if (expressionNode.type === 'Identifier') {value = t.Identifier(varName);} else {value = t.thisExpression();}return t.objectProperty(key, value, false);}}).compact().value();targetNode = t.objectExpression(properties);}var message = { prefix: t.stringLiteral(metadata.prefix), content: targetNode, hasStartMessage: t.booleanLiteral(metadata.hasStartMessage), isStartMessage: t.booleanLiteral(metadata.isStartMessage), indent: t.numericLiteral(metadata.indent), parentName: t.stringLiteral(metadata.parentName), filename: t.stringLiteral(metadata.filename), dirname: t.stringLiteral(metadata.dirname), basename: t.stringLiteral(metadata.basename), extname: t.stringLiteral(metadata.extname) };var replacement = t.expressionStatement(alias(message, metadata));replacement[$handled] = true;statement.replaceWith(replacement);} });if (path.node) {if (path.get('body').isBlockStatement()) {path.replaceWithMultiple(path.get('body').node.body);} else {path.replaceWith(path.get('body').node);}}}var wrapVmRunner = template("\nvar VM_RUNNER_RUN_ID = '';\n\nfunction generateUid(){\n    var u='',i=0; var four = 4;\n    var pattern = 'xxxxxxxx-xxxx-'+four+'xxx-yxxx-xxxxxxxxxxxx';\n    while(i++<36) {\n        var c=pattern[i-1],\n        r=Math.random()*16|0,v=c=='x'?r:(r&0x3|0x8);\n        u+=(c=='-'||c==four)?c:v.toString(16)\n    }\n    return u;\n} \n\nif( typeof(vm2Options)==='undefined' ){\n  vm2Options = {};\n}\nvar VM_RUNNER_HASH = vm2Options.VM_RUNNER_HASH;\n\nvar customOptions = vm2Options.customOptions || {};\nvar traceOptions = customOptions.trace||{};\n\nvar VM_RUNNER_TRACE = function(logLevel,prefix,data){\n    let alias = traceOptions && traceOptions.aliases && traceOptions.aliases[logLevel] ;\n    if( alias ){\n        return alias.apply(this,[prefix,data]);\n    }\n};\n\n\n\nreturn (function vmRunnerWrapper() {\n    VM_RUNNER_RUN_ID = generateUid();\n    \n    BODY;\n}).apply(this);\n");
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9iYWJlbC1wbHVnaW4uanMiXSwibmFtZXMiOlsiZ2V0TG9nRnVuY3Rpb24iLCJoYW5kbGVMYWJlbGVkU3RhdGVtZW50IiwiYmFiZWwiLCJ2aXNpdG9yIiwiUHJvZ3JhbSIsInByb2dyYW0iLCJvcHRzIiwidHJhdmVyc2UiLCJMYWJlbGVkU3RhdGVtZW50IiwicGF0aCIsInZtUnVubmVyV3JhcHBlciIsIndyYXBwZWQiLCJ3cmFwVm1SdW5uZXIiLCJCT0RZIiwibm9kZSIsImJvZHkiLCJWTV9SVU5ORVJfUlVOX0lEIiwidHlwZXMiLCJpZGVudGlmaWVyIiwiVk1fUlVOTkVSX0hBU0giLCJWTV9SVU5ORVJfVFJBQ0UiLCJyZXBsYWNlV2l0aCIsImRpcmVjdGl2ZXMiLCJmc3BhdGgiLCJfIiwidGVtcGxhdGUiLCJnZXQiLCIkaGFuZGxlZCIsIlN5bWJvbCIsIiRub3JtYWxpemVkIiwiUFJFU0VSVkVfQ09OVEVYVFMiLCJub3JtYWxpemVFbnYiLCJwcm9jZXNzIiwiZW52IiwiVFJBQ0VfQ09OVEVYVCIsIlBSRVNFUlZFX0ZJTEVTIiwiVFJBQ0VfRklMRSIsIlBSRVNFUlZFX0xFVkVMUyIsIlRSQUNFX0xFVkVMIiwiaW5wdXQiLCJzcGxpdCIsIm1hcCIsImNvbnRleHQiLCJ0b0xvd2VyQ2FzZSIsInRyaW0iLCJmaWx0ZXIiLCJpZCIsImV4cHJlc3Npb24iLCJmbiIsImlkcyIsImxvZ0xldmVsIiwidCIsImxvZyIsIm1lc3NhZ2UiLCJtZXRhZGF0YSIsInByZWZpeCIsImluZGVudCIsIkFycmF5Iiwiam9pbiIsImlzU2VxdWVuY2VFeHByZXNzaW9uIiwiY29udGVudCIsImNhbGxFeHByZXNzaW9uIiwibWVtYmVyRXhwcmVzc2lvbiIsInN0cmluZ0xpdGVyYWwiLCJjb25jYXQiLCJleHByZXNzaW9ucyIsIkxPR0xFVkVMIiwiUFJFRklYIiwiREFUQSIsIm5vcm1hbGl6ZU9wdHMiLCJhbGlhc2VzIiwidHJhY2UiLCJ3YXJuIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJrZXkiLCJleHByIiwic3RyaXAiLCJ1bmRlZmluZWQiLCJwcm9kdWN0aW9uIiwiZ2VuZXJhdGVQcmVmaXgiLCJkaXJuYW1lIiwiYmFzZW5hbWUiLCJjb2xsZWN0TWV0YWRhdGEiLCJmaWxlbmFtZSIsInJlc29sdmUiLCJjd2QiLCJodWIiLCJmaWxlIiwiZXh0bmFtZSIsIm5hbWVzIiwicGFyZW50IiwicGFyZW50TmFtZSIsImdldEFuY2VzdHJ5Iiwic2xpY2UiLCJyZWR1Y2UiLCJwYXJ0cyIsIml0ZW0iLCJpc0NsYXNzTWV0aG9kIiwidW5zaGlmdCIsInR5cGUiLCJuYW1lIiwiaXNDbGFzc0RlY2xhcmF0aW9uIiwibG9jIiwic3RhcnQiLCJsaW5lIiwiaXNGdW5jdGlvbiIsImlzUHJvZ3JhbSIsImlzQ2xhc3NCb2R5IiwiaXNCbG9ja1N0YXRlbWVudCIsImhhc1N0YXJ0TWVzc2FnZSIsImlzU3RhcnRNZXNzYWdlIiwiY2hpbGQiLCJpc0xhYmVsZWRTdGF0ZW1lbnQiLCJsYWJlbCIsInNob3VsZFN0cmlwIiwic2UiLCJOT0RFX0VOViIsImxlbmd0aCIsInNvbWUiLCJwYyIsImluY2x1ZGVzIiwicGYiLCJsZXZlbCIsInBsIiwibGFiZWxOYW1lIiwidmFyaWFibGVzIiwibWV0aG9kUGF0aCIsImluZGV4T2YiLCJwdXNoIiwiZWFjaCIsInNjb3BlIiwiYmluZGluZ3MiLCJ2YWwiLCJhbGlhcyIsInJlbW92ZSIsImVtcHR5U3RhdGVtZW50IiwicHJvcGVydGllcyIsInZhck5hbWUiLCJJZGVudGlmaWVyIiwidmFsdWUiLCJ0aGlzRXhwcmVzc2lvbiIsIm9iamVjdFByb3BlcnR5IiwicmVwbGFjZW1lbnQiLCJvYmplY3RFeHByZXNzaW9uIiwiYnVpbGRDb2RlRnJhbWVFcnJvciIsIkV4cHJlc3Npb25TdGF0ZW1lbnQiLCJzdGF0ZW1lbnQiLCJ0YXJnZXROb2RlIiwiY2hhaW4iLCJleHByZXNzaW9uTm9kZSIsImNvbXBhY3QiLCJib29sZWFuTGl0ZXJhbCIsIm51bWVyaWNMaXRlcmFsIiwiZXhwcmVzc2lvblN0YXRlbWVudCIsInJlcGxhY2VXaXRoTXVsdGlwbGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBc0NnQkEsYyxHQUFBQSxjOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXVLQUMsc0IsR0FBQUEsc0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxSUQsVUFBVUMsS0FBVixFQUFpQjtBQUM1QixTQUFPO0FBQ0hDLElBQUFBLE9BQU8sRUFBRTtBQUNMQyxNQUFBQSxPQURLLG1CQUNJQyxPQURKLFNBQ3FCLEtBQVBDLElBQU8sU0FBUEEsSUFBTztBQUN0QkQsUUFBQUEsT0FBTyxDQUFDRSxRQUFSLENBQWtCO0FBQ2RDLFVBQUFBLGdCQURjLDRCQUNJQyxJQURKLEVBQ1U7QUFDcEJSLFlBQUFBLHNCQUFzQixDQUFFQyxLQUFGLEVBQVNPLElBQVQsRUFBZUgsSUFBZixDQUF0QjtBQUNILFdBSGEsRUFBbEI7OztBQU1BLFlBQUksQ0FBQ0QsT0FBTyxDQUFDSyxlQUFiLEVBQThCO0FBQzFCTCxVQUFBQSxPQUFPLENBQUNLLGVBQVIsR0FBMEIsSUFBMUI7QUFDQSxjQUFJQyxPQUFPLEdBQUdDLFlBQVksQ0FBRTtBQUN4QkMsWUFBQUEsSUFBSSxFQUFFUixPQUFPLENBQUNTLElBQVIsQ0FBYUMsSUFESztBQUV4QkMsWUFBQUEsZ0JBQWdCLEVBQUNkLEtBQUssQ0FBQ2UsS0FBTixDQUFZQyxV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QUEwQm5KLElBQUksQ0FBQ2lCLEdBQUwsQ0FBVSxNQUFWLEVBQWtCWixJQUFsQixDQUF1QkMsSUFBakQsRUFDSCxDQUZELE1BRU8sQ0FDSE4sSUFBSSxDQUFDWSxXQUFMLENBQWtCWixJQUFJLENBQUNpQixHQUFMLENBQVUsTUFBVixFQUFrQlosSUFBcEMsRUFDSCxDQUNKLENBQ0osQ0FDRCxJQUFNRixZQUFZLEdBQUdhLFFBQVEsODNCQUE3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmc3BhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUnO1xuaW1wb3J0IHRlbXBsYXRlIGZyb20gXCJAYmFiZWwvdGVtcGxhdGVcIjtcbmltcG9ydCB7Z2V0fSBmcm9tICdsb2Rhc2gnO1xuXG5jb25zdCAkaGFuZGxlZCA9IFN5bWJvbCAoJ2hhbmRsZWQnKTtcbmNvbnN0ICRub3JtYWxpemVkID0gU3ltYm9sICgnbm9ybWFsaXplZCcpO1xuXG5jb25zdCBQUkVTRVJWRV9DT05URVhUUyA9IG5vcm1hbGl6ZUVudiAocHJvY2Vzcy5lbnYuVFJBQ0VfQ09OVEVYVCk7XG5jb25zdCBQUkVTRVJWRV9GSUxFUyA9IG5vcm1hbGl6ZUVudiAocHJvY2Vzcy5lbnYuVFJBQ0VfRklMRSk7XG5jb25zdCBQUkVTRVJWRV9MRVZFTFMgPSBub3JtYWxpemVFbnYgKHByb2Nlc3MuZW52LlRSQUNFX0xFVkVMKTtcblxuLyoqXG4gKiBOb3JtYWxpemUgYW4gZW52aXJvbm1lbnQgdmFyaWFibGUsIHVzZWQgdG8gb3ZlcnJpZGUgcGx1Z2luIG9wdGlvbnMuXG4gKi9cbmZ1bmN0aW9uIG5vcm1hbGl6ZUVudiAoaW5wdXQpe1xuICAgIGlmICghaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICByZXR1cm4gaW5wdXQuc3BsaXQgKCcsJylcbiAgICAubWFwIChjb250ZXh0ID0+IGNvbnRleHQudG9Mb3dlckNhc2UgKCkudHJpbSAoKSlcbiAgICAuZmlsdGVyIChpZCA9PiBpZCk7XG59XG5cbi8qKlxuICogTGlrZSBgdGVtcGxhdGUoKWAgYnV0IHJldHVybnMgYW4gZXhwcmVzc2lvbiwgbm90IGFuIGV4cHJlc3Npb24gc3RhdGVtZW50LlxuICovXG5mdW5jdGlvbiBleHByZXNzaW9uIChpbnB1dCwgdGVtcGxhdGUpIHtcbiAgICBjb25zdCBmbiA9IHRlbXBsYXRlIChpbnB1dCk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChpZHMpIHtcbiAgICAgICAgY29uc3Qgbm9kZSA9IGZuIChpZHMpO1xuICAgICAgICByZXR1cm4gbm9kZS5leHByZXNzaW9uID8gbm9kZS5leHByZXNzaW9uIDogbm9kZTtcbiAgICB9O1xufVxuXG4vKipcbiAqIFRoZSBkZWZhdWx0IGxvZygpIGZ1bmN0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9nRnVuY3Rpb24gKHt0eXBlczogdCwgdGVtcGxhdGV9LCBsb2dMZXZlbCkge1xuICAgIHJldHVybiBmdW5jdGlvbiBsb2cgKG1lc3NhZ2UsIG1ldGFkYXRhKSB7XG4gICAgICAgIGxldCBwcmVmaXggPSBgJHttZXRhZGF0YS5jb250ZXh0fTpgO1xuICAgICAgICBpZiAobWV0YWRhdGEuaW5kZW50KSB7XG4gICAgICAgICAgICBwcmVmaXggKz0gKG5ldyBBcnJheSAobWV0YWRhdGEuaW5kZW50ICsgMSkpLmpvaW4gKCcgICcpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0LmlzU2VxdWVuY2VFeHByZXNzaW9uIChtZXNzYWdlLmNvbnRlbnQpKSB7XG4gICAgICAgICAgICByZXR1cm4gdC5jYWxsRXhwcmVzc2lvbiAoXG4gICAgICAgICAgICAgICAgdC5tZW1iZXJFeHByZXNzaW9uIChcbiAgICAgICAgICAgICAgICAgICAgdC5pZGVudGlmaWVyICgnY29uc29sZScpLFxuICAgICAgICAgICAgICAgICAgICB0LmlkZW50aWZpZXIgKGxvZ0xldmVsKVxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgW3Quc3RyaW5nTGl0ZXJhbCAocHJlZml4KV0uY29uY2F0IChtZXNzYWdlLmNvbnRlbnQuZXhwcmVzc2lvbnMpXG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGV4cHJlc3Npb24gKGBWTV9SVU5ORVJfVFJBQ0UoTE9HTEVWRUwsUFJFRklYLCBEQVRBKWAsIHRlbXBsYXRlKSAoe1xuICAgICAgICAgICAgICAgIExPR0xFVkVMOiB0LnN0cmluZ0xpdGVyYWwgKGxvZ0xldmVsKSxcbiAgICAgICAgICAgICAgICBQUkVGSVg6IHQuc3RyaW5nTGl0ZXJhbCAocHJlZml4KSxcbiAgICAgICAgICAgICAgICBEQVRBOiBtZXNzYWdlLmNvbnRlbnQsXG4gICAgICAgICAgICAgICAgVk1fUlVOTkVSX1RSQUNFOnQuaWRlbnRpZmllciAoJ1ZNX1JVTk5FUl9UUkFDRScpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiBOb3JtYWxpemUgdGhlIHBsdWdpbiBvcHRpb25zLlxuICovXG5mdW5jdGlvbiBub3JtYWxpemVPcHRzIChiYWJlbCwgb3B0cykge1xuICAgIGlmIChvcHRzWyRub3JtYWxpemVkXSkge1xuICAgICAgICByZXR1cm4gb3B0cztcbiAgICB9XG4gICAgaWYgKCFvcHRzLmFsaWFzZXMpIHtcbiAgICAgICAgY29uc3QgbG9nID0gZ2V0TG9nRnVuY3Rpb24gKGJhYmVsLCAnbG9nJyk7XG4gICAgICAgIG9wdHMuYWxpYXNlcyA9IHtcbiAgICAgICAgICAgIGxvZzogZ2V0TG9nRnVuY3Rpb24gKGJhYmVsLCAnbG9nJyksXG4gICAgICAgICAgICB0cmFjZTogZ2V0TG9nRnVuY3Rpb24gKGJhYmVsLCAndHJhY2UnKSxcbiAgICAgICAgICAgIHdhcm46IGdldExvZ0Z1bmN0aW9uIChiYWJlbCwgJ3dhcm4nKVxuICAgICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIE9iamVjdC5rZXlzIChvcHRzLmFsaWFzZXMpLmZvckVhY2ggKGtleSA9PiB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIG9wdHMuYWxpYXNlc1trZXldID09PSAnc3RyaW5nJyAmJiBvcHRzLmFsaWFzZXNba2V5XSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGV4cHIgPSBleHByZXNzaW9uIChvcHRzLmFsaWFzZXNba2V5XSwgYmFiZWwudGVtcGxhdGUpO1xuICAgICAgICAgICAgICAgIG9wdHMuYWxpYXNlc1trZXldID0gKG1lc3NhZ2UpID0+IGV4cHIgKG1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgaWYgKG9wdHMuc3RyaXAgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBvcHRzLnN0cmlwID0ge1xuICAgICAgICAgICAgbG9nOiB7cHJvZHVjdGlvbjogdHJ1ZX0sXG4gICAgICAgICAgICB0cmFjZTogZmFsc2UsXG4gICAgICAgICAgICB3YXJuOiB7cHJvZHVjdGlvbjogdHJ1ZX1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgb3B0c1skbm9ybWFsaXplZF0gPSB0cnVlO1xuICAgIHJldHVybiBvcHRzO1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZVByZWZpeCAoZGlybmFtZSwgYmFzZW5hbWUpIHtcbiAgICBpZiAoYmFzZW5hbWUgIT09ICdpbmRleCcpIHtcbiAgICAgICAgcmV0dXJuIGJhc2VuYW1lO1xuICAgIH1cbiAgICBiYXNlbmFtZSA9IGZzcGF0aC5iYXNlbmFtZSAoZGlybmFtZSk7XG4gICAgaWYgKGJhc2VuYW1lICE9PSAnc3JjJyAmJiBiYXNlbmFtZSAhPT0gJ2xpYicpIHtcbiAgICAgICAgcmV0dXJuIGJhc2VuYW1lO1xuICAgIH1cbiAgICByZXR1cm4gZnNwYXRoLmJhc2VuYW1lIChmc3BhdGguZGlybmFtZSAoZGlybmFtZSkpO1xufVxuXG4vKipcbiAqIENvbGxlY3QgdGhlIG1ldGFkYXRhIGZvciBhIGdpdmVuIG5vZGUgcGF0aCwgd2hpY2ggd2lsbCBiZVxuICogbWFkZSBhdmFpbGFibGUgdG8gbG9nZ2luZyBmdW5jdGlvbnMuXG4gKi9cbmZ1bmN0aW9uIGNvbGxlY3RNZXRhZGF0YSAocGF0aCwgb3B0cykge1xuICAgIGNvbnN0IGZpbGVuYW1lID0gZnNwYXRoLnJlc29sdmUgKHByb2Nlc3MuY3dkICgpLCBwYXRoLmh1Yi5maWxlLm9wdHMuZmlsZW5hbWUpO1xuICAgIGNvbnN0IGRpcm5hbWUgPSBmc3BhdGguZGlybmFtZSAoZmlsZW5hbWUpO1xuICAgIGNvbnN0IGV4dG5hbWUgPSBmc3BhdGguZXh0bmFtZSAoZmlsZW5hbWUpO1xuICAgIGNvbnN0IGJhc2VuYW1lID0gZnNwYXRoLmJhc2VuYW1lIChmaWxlbmFtZSwgZXh0bmFtZSk7XG4gICAgY29uc3QgcHJlZml4ID0gZ2VuZXJhdGVQcmVmaXggKGRpcm5hbWUsIGJhc2VuYW1lKTtcbiAgICBjb25zdCBuYW1lcyA9IFtdO1xuICAgIGxldCBpbmRlbnQgPSAwO1xuICAgIGxldCBwYXJlbnQ7XG5cbiAgICBjb25zdCBwYXJlbnROYW1lID0gcGF0aC5nZXRBbmNlc3RyeSAoKS5zbGljZSAoMSkucmVkdWNlICgocGFydHMsIGl0ZW0pID0+IHtcbiAgICAgICAgaWYgKGl0ZW0uaXNDbGFzc01ldGhvZCAoKSkge1xuICAgICAgICAgICAgaWYgKCFwYXJlbnQpIHtcbiAgICAgICAgICAgICAgICBwYXJlbnQgPSBpdGVtO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGFydHMudW5zaGlmdCAoaXRlbS5ub2RlLmtleS50eXBlID09PSAnSWRlbnRpZmllcicgPyBpdGVtLm5vZGUua2V5Lm5hbWUgOiAnW2NvbXB1dGVkIG1ldGhvZF0nKTtcbiAgICAgICAgfSBlbHNlIGlmIChpdGVtLmlzQ2xhc3NEZWNsYXJhdGlvbiAoKSkge1xuICAgICAgICAgICAgaWYgKCFwYXJlbnQpIHtcbiAgICAgICAgICAgICAgICBwYXJlbnQgPSBpdGVtO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGFydHMudW5zaGlmdCAoaXRlbS5ub2RlLmlkID8gaXRlbS5ub2RlLmlkLm5hbWUgOiBgW2Fub255bW91cyBjbGFzc0Ake2l0ZW0ubm9kZS5sb2Muc3RhcnQubGluZX1dYCk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXRlbS5pc0Z1bmN0aW9uICgpKSB7XG4gICAgICAgICAgICBpZiAoIXBhcmVudCkge1xuICAgICAgICAgICAgICAgIHBhcmVudCA9IGl0ZW07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwYXJ0cy51bnNoaWZ0ICgoaXRlbS5ub2RlLmlkICYmIGl0ZW0ubm9kZS5pZC5uYW1lKSB8fCBgW2Fub255bW91c0Ake2l0ZW0ubm9kZS5sb2Muc3RhcnQubGluZX1dYCk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXRlbS5pc1Byb2dyYW0gKCkpIHtcbiAgICAgICAgICAgIGlmICghcGFyZW50KSB7XG4gICAgICAgICAgICAgICAgcGFyZW50ID0gaXRlbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICghcGFyZW50ICYmICFpdGVtLmlzQ2xhc3NCb2R5ICgpICYmICFpdGVtLmlzQmxvY2tTdGF0ZW1lbnQgKCkpIHtcbiAgICAgICAgICAgIGluZGVudCsrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYXJ0cztcbiAgICB9LCBbXSkuam9pbiAoJzonKTtcblxuICAgIGxldCBoYXNTdGFydE1lc3NhZ2UgPSBmYWxzZTtcbiAgICBsZXQgaXNTdGFydE1lc3NhZ2UgPSBmYWxzZTtcbiAgICBpZiAocGFyZW50ICYmICFwYXJlbnQuaXNQcm9ncmFtICgpKSB7XG4gICAgICAgIGZvciAobGV0IGNoaWxkIG9mIHBhcmVudC5nZXQgKCdib2R5JykuZ2V0ICgnYm9keScpKSB7XG4gICAgICAgICAgICBpZiAoY2hpbGQubm9kZVskaGFuZGxlZF0pIHtcbiAgICAgICAgICAgICAgICBoYXNTdGFydE1lc3NhZ2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFjaGlsZC5pc0xhYmVsZWRTdGF0ZW1lbnQgKCkpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGxhYmVsID0gY2hpbGQuZ2V0ICgnbGFiZWwnKTtcbiAgICAgICAgICAgIGlmIChvcHRzLmFsaWFzZXNbbGFiZWwubm9kZS5uYW1lXSkge1xuICAgICAgICAgICAgICAgIGhhc1N0YXJ0TWVzc2FnZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkLm5vZGUgPT09IHBhdGgubm9kZSkge1xuICAgICAgICAgICAgICAgICAgICBpc1N0YXJ0TWVzc2FnZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgY29udGV4dCA9IGAke3ByZWZpeH06JHtwYXJlbnROYW1lfWA7XG4gICAgcmV0dXJuIHtpbmRlbnQsIHByZWZpeCwgcGFyZW50TmFtZSwgY29udGV4dCwgaGFzU3RhcnRNZXNzYWdlLCBpc1N0YXJ0TWVzc2FnZSwgZmlsZW5hbWUsIGRpcm5hbWUsIGJhc2VuYW1lLCBleHRuYW1lfTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gbG9nZ2luZyBzdGF0ZW1lbnQgc2hvdWxkIGJlIHN0cmlwcGVkLlxuICovXG5mdW5jdGlvbiBzaG91bGRTdHJpcCAobmFtZSwgbWV0YWRhdGEsIHtzdHJpcH0pIHtcbiAgICBzd2l0Y2ggKHR5cGVvZiBzdHJpcCkge1xuICAgICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgICAgIGlmICghc3RyaXApIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIC8vIHN0cmlwID09PSB0cnVlXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgICAgIGNvbnN0IHNlID0gc3RyaXBbbmFtZV07XG4gICAgICAgICAgICBpZiAoIXNlIHx8ICh0eXBlb2Ygc2UgPT09ICdvYmplY3QnICYmICFzZVtwcm9jZXNzLmVudi5OT0RFX0VOVl0pKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAvLyBzdHJpcFtuYW1lXSA9PT0gdHJ1ZSB8fCBzdHJpcFtuYW1lXVtlbnZdID09PSB0cnVlXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKFBSRVNFUlZFX0NPTlRFWFRTLmxlbmd0aCkge1xuICAgICAgICBjb25zdCBjb250ZXh0ID0gbWV0YWRhdGEuY29udGV4dC50b0xvd2VyQ2FzZSAoKTtcbiAgICAgICAgaWYgKFBSRVNFUlZFX0NPTlRFWFRTLnNvbWUgKHBjID0+IGNvbnRleHQuaW5jbHVkZXMgKHBjKSkpIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKFBSRVNFUlZFX0ZJTEVTLmxlbmd0aCkge1xuICAgICAgICBjb25zdCBmaWxlbmFtZSA9IG1ldGFkYXRhLmZpbGVuYW1lLnRvTG93ZXJDYXNlICgpO1xuICAgICAgICBpZiAoUFJFU0VSVkVfRklMRVMuc29tZSAocGYgPT4gZmlsZW5hbWUuaW5jbHVkZXMgKHBmKSkpIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKFBSRVNFUlZFX0xFVkVMUy5sZW5ndGgpIHtcbiAgICAgICAgY29uc3QgbGV2ZWwgPSBuYW1lLnRvTG93ZXJDYXNlICgpO1xuICAgICAgICBpZiAoUFJFU0VSVkVfTEVWRUxTLnNvbWUgKHBsID0+IGxldmVsID09PSBwbCkpIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGVMYWJlbGVkU3RhdGVtZW50IChiYWJlbCwgcGF0aCwgb3B0cykge1xuICAgIGNvbnN0IHQgPSBiYWJlbC50eXBlcztcbiAgICBjb25zdCBsYWJlbCA9IHBhdGguZ2V0ICgnbGFiZWwnKTtcbiAgICBvcHRzID0gbm9ybWFsaXplT3B0cyAoYmFiZWwsIG9wdHMpO1xuXG4gICAgY29uc3QgbGFiZWxOYW1lID0gbGFiZWwubm9kZS5uYW1lO1xuICAgIGNvbnN0IHZhcmlhYmxlcyA9ICBbXTtcblxuICAgIGNvbnN0IG1ldGhvZFBhdGggPSBnZXQocGF0aCwncGFyZW50UGF0aC5wYXJlbnRQYXRoJyxudWxsKTtcbiAgICBpZihtZXRob2RQYXRoICYmWydDbGFzc01ldGhvZCcsJ09iamVjdE1ldGhvZCddLmluZGV4T2YobWV0aG9kUGF0aC50eXBlKT4tMSYmIW1ldGhvZFBhdGgubm9kZS5zdGF0aWMpe1xuICAgICAgICB2YXJpYWJsZXMucHVzaCgndGhpcycpO1xuICAgIH1cbiAgICBfLmVhY2goIHBhdGguc2NvcGUuYmluZGluZ3MgLCAodmFsLGtleSk9PntcbiAgICAgICAgaWYodmFyaWFibGVzLmluZGV4T2Yoa2V5KT09LTEpXG4gICAgICAgICAgICB2YXJpYWJsZXMucHVzaChrZXkpO1xuICAgIH0pO1xuXG5cbiAgICBjb25zdCBhbGlhcyA9IG9wdHMuYWxpYXNlc1tsYWJlbE5hbWVdXG4gICAgaWYgKCFhbGlhcykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG1ldGFkYXRhID0gY29sbGVjdE1ldGFkYXRhIChwYXRoLCBvcHRzKTtcbiAgICBpZiAoc2hvdWxkU3RyaXAgKGxhYmVsLm5vZGUubmFtZSwgbWV0YWRhdGEsIG9wdHMpKSB7XG4gICAgICAgIHBhdGgucmVtb3ZlICgpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcGF0aC50cmF2ZXJzZSAoe1xuICAgICAgICBcIkVtcHR5U3RhdGVtZW50XCIgKGVtcHR5U3RhdGVtZW50KXtcbiAgICAgICAgICAgIGxldCBwcm9wZXJ0aWVzID0gXy5tYXAgKHZhcmlhYmxlcywgKHZhck5hbWUpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQga2V5ID0gdC5JZGVudGlmaWVyICh2YXJOYW1lKTtcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWU7XG4gICAgICAgICAgICAgICAgaWYodmFyTmFtZSE9J3RoaXMnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdC5JZGVudGlmaWVyICh2YXJOYW1lKTtcbiAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB0LnRoaXNFeHByZXNzaW9uKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0Lm9iamVjdFByb3BlcnR5IChrZXksIHZhbHVlLCBmYWxzZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGxldCByZXBsYWNlbWVudCA9IHQub2JqZWN0RXhwcmVzc2lvbiAocHJvcGVydGllcyk7XG4gICAgICAgICAgICByZXBsYWNlbWVudFskaGFuZGxlZF0gPSB0cnVlO1xuICAgICAgICAgICAgZW1wdHlTdGF0ZW1lbnQucmVwbGFjZVdpdGggKHJlcGxhY2VtZW50KTtcbiAgICAgICAgfSxcbiAgICAgICAgXCJWYXJpYWJsZURlY2xhcmF0aW9ufEZ1bmN0aW9ufEFzc2lnbm1lbnRFeHByZXNzaW9ufFVwZGF0ZUV4cHJlc3Npb258WWllbGRFeHByZXNzaW9ufFJldHVyblN0YXRlbWVudFwiIChpdGVtKSB7XG4gICAgICAgICAgICB0aHJvdyBwYXRoLmJ1aWxkQ29kZUZyYW1lRXJyb3IgKGBMb2dnaW5nIHN0YXRlbWVudHMgY2Fubm90IGhhdmUgc2lkZSBlZmZlY3RzLiAke2l0ZW0udHlwZX1gKTtcbiAgICAgICAgfSxcbiAgICAgICAgRXhwcmVzc2lvblN0YXRlbWVudCAoc3RhdGVtZW50KSB7XG4gICAgICAgICAgICBpZiAoc3RhdGVtZW50Lm5vZGVbJGhhbmRsZWRdKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IHRhcmdldE5vZGUgPSBzdGF0ZW1lbnQuZ2V0ICgnZXhwcmVzc2lvbicpLm5vZGU7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGBFeHByZXNzaW9uU3RhdGVtZW50OiR7dGFyZ2V0Tm9kZS50eXBlfWApO1xuICAgICAgICAgICAgaWYodGFyZ2V0Tm9kZS50eXBlPT09J1NlcXVlbmNlRXhwcmVzc2lvbicpe1xuICAgICAgICAgICAgICAgIGxldCBwcm9wZXJ0aWVzID0gXy5jaGFpbih0YXJnZXROb2RlLmV4cHJlc3Npb25zKS5tYXAoKGV4cHJlc3Npb25Ob2RlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmKFsnSWRlbnRpZmllcicsJ1RoaXNFeHByZXNzaW9uJ10uaW5kZXhPZihleHByZXNzaW9uTm9kZS50eXBlKT4tMSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdmFyTmFtZSA9IGV4cHJlc3Npb25Ob2RlLnR5cGU9PT0nSWRlbnRpZmllcic/ZXhwcmVzc2lvbk5vZGUubmFtZTondGhpcyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQga2V5ID0gdC5JZGVudGlmaWVyICh2YXJOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGV4cHJlc3Npb25Ob2RlLnR5cGU9PT0nSWRlbnRpZmllcicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHQuSWRlbnRpZmllciAodmFyTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHQudGhpc0V4cHJlc3Npb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0Lm9iamVjdFByb3BlcnR5IChrZXksIHZhbHVlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KS5jb21wYWN0KCkudmFsdWUoKTtcbiAgICAgICAgICAgICAgICB0YXJnZXROb2RlID0gdC5vYmplY3RFeHByZXNzaW9uIChwcm9wZXJ0aWVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSB7XG4gICAgICAgICAgICAgICAgcHJlZml4OiB0LnN0cmluZ0xpdGVyYWwgKG1ldGFkYXRhLnByZWZpeCksXG4gICAgICAgICAgICAgICAgY29udGVudDogdGFyZ2V0Tm9kZSxcbiAgICAgICAgICAgICAgICBoYXNTdGFydE1lc3NhZ2U6IHQuYm9vbGVhbkxpdGVyYWwgKG1ldGFkYXRhLmhhc1N0YXJ0TWVzc2FnZSksXG4gICAgICAgICAgICAgICAgaXNTdGFydE1lc3NhZ2U6IHQuYm9vbGVhbkxpdGVyYWwgKG1ldGFkYXRhLmlzU3RhcnRNZXNzYWdlKSxcbiAgICAgICAgICAgICAgICBpbmRlbnQ6IHQubnVtZXJpY0xpdGVyYWwgKG1ldGFkYXRhLmluZGVudCksXG4gICAgICAgICAgICAgICAgcGFyZW50TmFtZTogdC5zdHJpbmdMaXRlcmFsIChtZXRhZGF0YS5wYXJlbnROYW1lKSxcbiAgICAgICAgICAgICAgICBmaWxlbmFtZTogdC5zdHJpbmdMaXRlcmFsIChtZXRhZGF0YS5maWxlbmFtZSksXG4gICAgICAgICAgICAgICAgZGlybmFtZTogdC5zdHJpbmdMaXRlcmFsIChtZXRhZGF0YS5kaXJuYW1lKSxcbiAgICAgICAgICAgICAgICBiYXNlbmFtZTogdC5zdHJpbmdMaXRlcmFsIChtZXRhZGF0YS5iYXNlbmFtZSksXG4gICAgICAgICAgICAgICAgZXh0bmFtZTogdC5zdHJpbmdMaXRlcmFsIChtZXRhZGF0YS5leHRuYW1lKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNvbnN0IHJlcGxhY2VtZW50ID0gdC5leHByZXNzaW9uU3RhdGVtZW50IChhbGlhcyAobWVzc2FnZSwgbWV0YWRhdGEpKTtcbiAgICAgICAgICAgIHJlcGxhY2VtZW50WyRoYW5kbGVkXSA9IHRydWU7XG4gICAgICAgICAgICBzdGF0ZW1lbnQucmVwbGFjZVdpdGggKHJlcGxhY2VtZW50KTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHBhdGgubm9kZSkge1xuICAgICAgICBpZiAocGF0aC5nZXQgKCdib2R5JykuaXNCbG9ja1N0YXRlbWVudCAoKSkge1xuICAgICAgICAgICAgcGF0aC5yZXBsYWNlV2l0aE11bHRpcGxlIChwYXRoLmdldCAoJ2JvZHknKS5ub2RlLmJvZHkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGF0aC5yZXBsYWNlV2l0aCAocGF0aC5nZXQgKCdib2R5Jykubm9kZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5jb25zdCB3cmFwVm1SdW5uZXIgPSB0ZW1wbGF0ZSAoYFxudmFyIFZNX1JVTk5FUl9SVU5fSUQgPSAnJztcblxuZnVuY3Rpb24gZ2VuZXJhdGVVaWQoKXtcbiAgICB2YXIgdT0nJyxpPTA7IHZhciBmb3VyID0gNDtcbiAgICB2YXIgcGF0dGVybiA9ICd4eHh4eHh4eC14eHh4LScrZm91cisneHh4LXl4eHgteHh4eHh4eHh4eHh4JztcbiAgICB3aGlsZShpKys8MzYpIHtcbiAgICAgICAgdmFyIGM9cGF0dGVybltpLTFdLFxuICAgICAgICByPU1hdGgucmFuZG9tKCkqMTZ8MCx2PWM9PSd4Jz9yOihyJjB4M3wweDgpO1xuICAgICAgICB1Kz0oYz09Jy0nfHxjPT1mb3VyKT9jOnYudG9TdHJpbmcoMTYpXG4gICAgfVxuICAgIHJldHVybiB1O1xufSBcblxuaWYoIHR5cGVvZih2bTJPcHRpb25zKT09PSd1bmRlZmluZWQnICl7XG4gIHZtMk9wdGlvbnMgPSB7fTtcbn1cbnZhciBWTV9SVU5ORVJfSEFTSCA9IHZtMk9wdGlvbnMuVk1fUlVOTkVSX0hBU0g7XG5cbnZhciBjdXN0b21PcHRpb25zID0gdm0yT3B0aW9ucy5jdXN0b21PcHRpb25zIHx8IHt9O1xudmFyIHRyYWNlT3B0aW9ucyA9IGN1c3RvbU9wdGlvbnMudHJhY2V8fHt9O1xuXG52YXIgVk1fUlVOTkVSX1RSQUNFID0gZnVuY3Rpb24obG9nTGV2ZWwscHJlZml4LGRhdGEpe1xuICAgIGxldCBhbGlhcyA9IHRyYWNlT3B0aW9ucyAmJiB0cmFjZU9wdGlvbnMuYWxpYXNlcyAmJiB0cmFjZU9wdGlvbnMuYWxpYXNlc1tsb2dMZXZlbF0gO1xuICAgIGlmKCBhbGlhcyApe1xuICAgICAgICByZXR1cm4gYWxpYXMuYXBwbHkodGhpcyxbcHJlZml4LGRhdGFdKTtcbiAgICB9XG59O1xuXG5cblxucmV0dXJuIChmdW5jdGlvbiB2bVJ1bm5lcldyYXBwZXIoKSB7XG4gICAgVk1fUlVOTkVSX1JVTl9JRCA9IGdlbmVyYXRlVWlkKCk7XG4gICAgXG4gICAgQk9EWTtcbn0pLmFwcGx5KHRoaXMpO1xuYCk7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChiYWJlbCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHZpc2l0b3I6IHtcbiAgICAgICAgICAgIFByb2dyYW0gKHByb2dyYW0sIHtvcHRzfSkge1xuICAgICAgICAgICAgICAgIHByb2dyYW0udHJhdmVyc2UgKHtcbiAgICAgICAgICAgICAgICAgICAgTGFiZWxlZFN0YXRlbWVudCAocGF0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlTGFiZWxlZFN0YXRlbWVudCAoYmFiZWwsIHBhdGgsIG9wdHMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIXByb2dyYW0udm1SdW5uZXJXcmFwcGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb2dyYW0udm1SdW5uZXJXcmFwcGVyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHdyYXBwZWQgPSB3cmFwVm1SdW5uZXIgKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEJPRFk6IHByb2dyYW0ubm9kZS5ib2R5LFxuICAgICAgICAgICAgICAgICAgICAgICAgVk1fUlVOTkVSX1JVTl9JRDpiYWJlbC50eXBlcy5pZGVudGlmaWVyICgnVk1fUlVOTkVSX1JVTl9JRCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgVk1fUlVOTkVSX0hBU0g6YmFiZWwudHlwZXMuaWRlbnRpZmllciAoJ1ZNX1JVTk5FUl9IQVNIJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBWTV9SVU5ORVJfVFJBQ0U6YmFiZWwudHlwZXMuaWRlbnRpZmllciAoJ1ZNX1JVTk5FUl9UUkFDRScpLFxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBwcm9ncmFtLnJlcGxhY2VXaXRoIChcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhYmVsLnR5cGVzLnByb2dyYW0gKHdyYXBwZWQpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHByb2dyYW0ubm9kZS5kaXJlY3RpdmVzID0gW107XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59XG4iXX0=