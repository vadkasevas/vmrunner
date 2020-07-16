"use strict";var _interopRequireDefault3 = require("@babel/runtime/helpers/interopRequireDefault");var _interopRequireDefault2 = _interopRequireDefault3(require("@babel/runtime/helpers/interopRequireDefault"));Object.defineProperty(exports, "__esModule", { value: true });exports.wrapInProxy = exports.generateRandomHash = exports.convertResult = exports.functionFromScript = exports.getScript = exports.wrapScope = undefined;var _regenerator = require("@babel/runtime/regenerator");var _regeneratorRuntime = (0, _interopRequireDefault2["default"])(_regenerator)["default"];var _typeof2 = require("@babel/runtime/helpers/typeof");var _typeof = (0, _interopRequireDefault2["default"])(_typeof2)["default"];var _underscore = require("underscore");var _ = (0, _interopRequireDefault2["default"])(_underscore)["default"];

var _md = require("md5");var md5 = (0, _interopRequireDefault2["default"])(_md)["default"];
var _ejson = require("ejson");var EJSON = (0, _interopRequireDefault2["default"])(_ejson)["default"];
var _vm = require("vm");var vm = (0, _interopRequireDefault2["default"])(_vm)["default"];



var _MalibunCache = require("./MalibunCache");var MalibunCache = (0, _interopRequireDefault2["default"])(_MalibunCache)["default"];
var _cachedRegExp = require("./cachedRegExp");var cachedRegExp = (0, _interopRequireDefault2["default"])(_cachedRegExp)["default"];





var _generator = require("@babel/generator");var babelGenerate = (0, _interopRequireDefault2["default"])(_generator)["default"];

var _babelPlugin = require("./babel-plugin");var vmBabelPlugin = (0, _interopRequireDefault2["default"])(_babelPlugin)["default"];
var _returnLastBabelPlugin = require("./return-last-babel-plugin");var returnLastBabelPlugin = (0, _interopRequireDefault2["default"])(_returnLastBabelPlugin)["default"];



var _nodeCache = require("node-cache");var NodeCache = (0, _interopRequireDefault2["default"])(_nodeCache)["default"];var esprima = require('esprima');var escodegen = require('escodegen');var functionGenerator = new vm.Script("new Function( 'vm2Options', vm2Code );");var scriptCache = new MalibunCache();var re = cachedRegExp(/^([\s\t\n\r]*return[\s\t\n\r]*)?(\{[\s\S]*\})([\s\t\n\r;]?$)/);var babelParser = require("@babel/parser");var babelCore = require("@babel/core");function generateRandomHash() {return md5(_.random(100000000) + '_' + _.random(100000000) + '_' + Date.now());}

var fbCache = new NodeCache({
  stdTTL: 5 * 60,
  checkperiod: Math.ceil(60),
  useClones: false,
  deleteOnExpire: true });


var functionFromScript = function functionFromScript(expr, vmCtx) {var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var originalExpr = expr;
  var vm2Options = {};
  var vm2OptionsHash = options.__vmRunnerHash ? options.__vmRunnerHash : md5(JSON.stringify(options));
  vm2Options.customOptions = options;
  var useCache = true;

  var keysArr = [
  expr,
  vmCtx.__vmRunnerHash];

  if (options.localScope && !_.isEmpty(options.localScope)) {
    keysArr.push(_.keys(options.localScope).join(':'));
    vm2Options.localScope = options.localScope;
  }
  var key = md5(keysArr.join(':'));
  vm2Options.VM_RUNNER_HASH = key;
  vm2Options.expression = originalExpr;

  if (!useCache || !fbCache.get(key)) {
    if (re.test(expr)) {
      re.lastIndex = 0;
      expr = expr.replace(re, function (m, prefix, body, suffix) {
        if (prefix === undefined)
        prefix = '';
        if (suffix === undefined)
        suffix = '';
        return "".concat(prefix, " new Object(").concat(body, ")").concat(suffix);
      });
    }

    var tokens = babelParser.parse(expr, {
      sourceType: "script",
      plugins: [
      ['decorators', { decoratorsBeforeExport: false }]],

      allowReturnOutsideFunction: true });var _babelCore$transformF =

    babelCore.transformFromAstSync(tokens, expr, {
      filename: options.filename || 'vmrunner.js',
      babelrc: false,
      configFile: false,
      "presets": [["@babel/preset-env", { targets: { node: true, esmodules: false } }]],
      "plugins": [
      ['babel-plugin-transform-line'],
      [vmBabelPlugin, { localScope: options.localScope }],
      [returnLastBabelPlugin, { topLevel: true }],
      "@babel/plugin-transform-runtime",
      ["@babel/plugin-syntax-dynamic-import"],
      ["@babel/plugin-proposal-optional-chaining"],
      ["@babel/plugin-proposal-decorators", { "legacy": true }]],

      //"sourceMaps": 'inline',
      "retainLines": true }),code = _babelCore$transformF.code,map = _babelCore$transformF.map,ast = _babelCore$transformF.ast;

    //console.log(code);
    //console.log(map);
    vmCtx.vm2Code = code;
    var f = functionGenerator.runInContext(vmCtx);
    fbCache.set(key, f, 5 * 60);
  }
  return {
    f: fbCache.get(key),
    vm2Options: vm2Options };

};


/**
    * @returns {Object} scope
    * @returns {Object} scope.vm
    * @returns {Object} scope.original
    * @param {VMRunner} runner
    * */
function wrapScope(scope, runner, vm2Options) {
  var scopeCopy = {}; //Object.assign({},scope);

  _.each(scope, function (instance, key) {
    var wrapped = null;
    if (_.isObject(instance)) {
      wrapped = new Proxy(instance, {
        get: function get(target, property) {
          return target[property];
        },
        set: function set(target, key, value, receiver) {
          //console.log('set key:',key,'value:',value);
        },
        getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, name) {
          return Object.getOwnPropertyDescriptor(target, name);
        },
        ownKeys: function ownKeys(target) {
          return Object.getOwnPropertyNames(target);
        },
        defineProperty: function defineProperty(target, name, propertyDescriptor) {

        },
        deleteProperty: function deleteProperty(target, name) {

        },
        preventExtensions: function preventExtensions(target) {

        },
        has: function has(target, name) {
          return name in target;
        } });

    } else {
      wrapped = instance;
    }
    scopeCopy[key] = wrapped;
  });

  scopeCopy.vm2Options = vm2Options;

  var vmContext = vm.createContext(scopeCopy);
  return {
    vm: vmContext,
    original: scopeCopy };

}

function getScript(code) {
  if (!_.isString(code) || !code) {
    return null;
  }
  if (!scriptCache.has(code)) {
    try {
      var script = new vm.Script(code);
      scriptCache.set(code, script, 5 * 60 * 1000);
    } catch (e) {
      return null;
    }
  }
  return scriptCache.get(code);
}

function convertResult(result) {var converted, check;return _regeneratorRuntime.async(function convertResult$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
          converted = result;if (!
          _.isDate(result)) {_context.next = 5;break;}
          converted = new Date(result.getTime());_context.next = 12;break;case 5:if (!(
          result && _.isFunction(result.then))) {_context.next = 11;break;}_context.next = 8;return _regeneratorRuntime.awrap(
          result);case 8:converted = _context.sent;_context.next = 12;break;case 11:
          if (result && _typeof(result) == 'object') {

            check = function check(target, source, key) {
              var val = source[key];
              if (typeof val == 'function') {
                target[key] = val;
              } else if (_.isDate(val)) {
                target[key] = new Date(val);
              } else if (_.isArray(val) || _.isObject(val)) {
                _.each(_.keys(val), function (valKey) {
                  check(target[key], val, valKey);
                });
              }
            };converted = EJSON.clone(result);
            _.each(_.keys(result), function (key) {
              check(converted, result, key);
            });
          }case 12:return _context.abrupt("return",
          converted);case 13:case "end":return _context.stop();}}});}


function wrapInProxy(instance) {
  return new Proxy(instance, {
    get: function get(target, property) {
      return target[property];
    },
    set: function set(target, key, value, receiver) {

    },
    getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, name) {
      return Object.getOwnPropertyDescriptor(target, name);
    },
    ownKeys: function ownKeys(target) {
      return Object.getOwnPropertyNames(target);
    },
    defineProperty: function defineProperty(target, name, propertyDescriptor) {

    },
    deleteProperty: function deleteProperty(target, name) {

    },
    preventExtensions: function preventExtensions(target) {

    },
    has: function has(target, name) {
      return name in target;
    } });

}exports.



wrapScope = wrapScope;exports.getScript = getScript;exports.functionFromScript = functionFromScript;exports.convertResult = convertResult;exports.generateRandomHash = generateRandomHash;exports.wrapInProxy = wrapInProxy;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy5qcyJdLCJuYW1lcyI6WyJfIiwibWQ1IiwiRUpTT04iLCJ2bSIsIk1hbGlidW5DYWNoZSIsImNhY2hlZFJlZ0V4cCIsImJhYmVsR2VuZXJhdGUiLCJ2bUJhYmVsUGx1Z2luIiwicmV0dXJuTGFzdEJhYmVsUGx1Z2luIiwiTm9kZUNhY2hlIiwiZXNwcmltYSIsInJlcXVpcmUiLCJlc2NvZGVnZW4iLCJmdW5jdGlvbkdlbmVyYXRvciIsIlNjcmlwdCIsInNjcmlwdENhY2hlIiwicmUiLCJiYWJlbFBhcnNlciIsImJhYmVsQ29yZSIsImdlbmVyYXRlUmFuZG9tSGFzaCIsInJhbmRvbSIsIkRhdGUiLCJub3ciLCJmYkNhY2hlIiwic3RkVFRMIiwiY2hlY2twZXJpb2QiLCJNYXRoIiwiY2VpbCIsInVzZUNsb25lcyIsImRlbGV0ZU9uRXhwaXJlIiwiZnVuY3Rpb25Gcm9tU2NyaXB0IiwiZXhwciIsInZtQ3R4Iiwib3B0aW9ucyIsIm9yaWdpbmFsRXhwciIsInZtMk9wdGlvbnMiLCJ2bTJPcHRpb25zSGFzaCIsIl9fdm1SdW5uZXJIYXNoIiwiSlNPTiIsInN0cmluZ2lmeSIsImN1c3RvbU9wdGlvbnMiLCJ1c2VDYWNoZSIsImtleXNBcnIiLCJsb2NhbFNjb3BlIiwiaXNFbXB0eSIsInB1c2giLCJrZXlzIiwiam9pbiIsImtleSIsIlZNX1JVTk5FUl9IQVNIIiwiZXhwcmVzc2lvbiIsImdldCIsInRlc3QiLCJsYXN0SW5kZXgiLCJyZXBsYWNlIiwibSIsInByZWZpeCIsImJvZHkiLCJzdWZmaXgiLCJ1bmRlZmluZWQiLCJ0b2tlbnMiLCJwYXJzZSIsInNvdXJjZVR5cGUiLCJwbHVnaW5zIiwiZGVjb3JhdG9yc0JlZm9yZUV4cG9ydCIsImFsbG93UmV0dXJuT3V0c2lkZUZ1bmN0aW9uIiwidHJhbnNmb3JtRnJvbUFzdFN5bmMiLCJmaWxlbmFtZSIsImJhYmVscmMiLCJjb25maWdGaWxlIiwidGFyZ2V0cyIsIm5vZGUiLCJlc21vZHVsZXMiLCJ0b3BMZXZlbCIsImNvZGUiLCJtYXAiLCJhc3QiLCJ2bTJDb2RlIiwiZiIsInJ1bkluQ29udGV4dCIsInNldCIsIndyYXBTY29wZSIsInNjb3BlIiwicnVubmVyIiwic2NvcGVDb3B5IiwiZWFjaCIsImluc3RhbmNlIiwid3JhcHBlZCIsImlzT2JqZWN0IiwiUHJveHkiLCJ0YXJnZXQiLCJwcm9wZXJ0eSIsInZhbHVlIiwicmVjZWl2ZXIiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJuYW1lIiwiT2JqZWN0Iiwib3duS2V5cyIsImdldE93blByb3BlcnR5TmFtZXMiLCJkZWZpbmVQcm9wZXJ0eSIsInByb3BlcnR5RGVzY3JpcHRvciIsImRlbGV0ZVByb3BlcnR5IiwicHJldmVudEV4dGVuc2lvbnMiLCJoYXMiLCJ2bUNvbnRleHQiLCJjcmVhdGVDb250ZXh0Iiwib3JpZ2luYWwiLCJnZXRTY3JpcHQiLCJpc1N0cmluZyIsInNjcmlwdCIsImUiLCJjb252ZXJ0UmVzdWx0IiwicmVzdWx0IiwiY29udmVydGVkIiwiaXNEYXRlIiwiZ2V0VGltZSIsImlzRnVuY3Rpb24iLCJ0aGVuIiwiY2hlY2siLCJzb3VyY2UiLCJ2YWwiLCJpc0FycmF5IiwidmFsS2V5IiwiY2xvbmUiLCJ3cmFwSW5Qcm94eSJdLCJtYXBwaW5ncyI6ImlzQkFBQSx3QyxJQUFPQSxDOztBQUVQLHlCLElBQU9DLEc7QUFDUCw4QixJQUFPQyxLO0FBQ1Asd0IsSUFBT0MsRTs7OztBQUlQLDhDLElBQU9DLFk7QUFDUCw4QyxJQUFPQyxZOzs7Ozs7QUFNUCw2QyxJQUFPQyxhOztBQUVQLDZDLElBQU9DLGE7QUFDUCxtRSxJQUFPQyxxQjs7OztBQUlQLHVDLElBQU9DLFMsa0VBaEJQLElBQU1DLE9BQU8sR0FBR0MsT0FBTyxDQUFDLFNBQUQsQ0FBdkIsQ0FDQSxJQUFNQyxTQUFTLEdBQUdELE9BQU8sQ0FBQyxXQUFELENBQXpCLENBSUEsSUFBTUUsaUJBQWlCLEdBQUcsSUFBSVYsRUFBRSxDQUFDVyxNQUFQLDBDQUExQixDQUNBLElBQU1D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dEJDLElBQUFBLHdCQVBzQixvQ0FPR0osTUFQSCxFQU9XSyxJQVBYLEVBT2dCO0FBQ2xDLGFBQU9DLE1BQU0sQ0FBQ0Ysd0JBQVAsQ0FBZ0NKLE1BQWhDLEVBQXdDSyxJQUF4QyxDQUFQO0FBQ0gsS0FUcUI7QUFVdEJFLElBQUFBLE9BVnNCLG1CQVVkUCxNQVZjLEVBVVA7QUFDWCxhQUFPTSxNQUFNLENBQUNFLG1CQUFQLENBQTJCUixNQUEzQixDQUFQO0FBQ0gsS0FacUI7QUFhdEJTLElBQUFBLGNBYnNCLDBCQWFQVCxNQWJPLEVBYUNLLElBYkQsRUFhT0ssa0JBYlAsRUFhMEI7O0FBRS9DLEtBZnFCO0FBZ0J0QkMsSUFBQUEsY0FoQnNCLDBCQWdCUFgsTUFoQk8sRUFnQkNLLElBaEJELEVBZ0JNOztBQUUzQixLQWxCcUI7QUFtQnRCTyxJQUFBQSxpQkFuQnNCLDZCQW1CSlosTUFuQkksRUFtQkc7O0FBRXhCLEtBckJxQjtBQXNCdEJhLElBQUFBLEdBdEJzQixlQXNCbEJiLE1BdEJrQixFQXNCVkssSUF0QlUsRUFzQkw7QUFDYixhQUFPQSxJQUFJLElBQUlMLE1BQWY7QUFDSCxLQXhCcUIsRUFBbkIsQ0FBUDs7QUEwQkgsQzs7OztBQUlHVCxTLEdBQUFBLFMsU0FBVTBCLFMsR0FBQUEsUyxTQUFVN0Usa0IsR0FBQUEsa0IsU0FBbUJpRixhLEdBQUFBLGEsU0FBYzVGLGtCLEdBQUFBLGtCLFNBQW1CeUcsVyxHQUFBQSxXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZSc7XG5cbmltcG9ydCBtZDUgZnJvbSAnbWQ1JztcbmltcG9ydCBFSlNPTiBmcm9tICdlanNvbic7XG5pbXBvcnQgdm0gZnJvbSAndm0nO1xuXG5jb25zdCBlc3ByaW1hID0gcmVxdWlyZSgnZXNwcmltYScpO1xuY29uc3QgZXNjb2RlZ2VuID0gcmVxdWlyZSgnZXNjb2RlZ2VuJyk7XG5pbXBvcnQgTWFsaWJ1bkNhY2hlIGZyb20gXCIuL01hbGlidW5DYWNoZVwiO1xuaW1wb3J0IGNhY2hlZFJlZ0V4cCBmcm9tICcuL2NhY2hlZFJlZ0V4cCc7XG5cbmNvbnN0IGZ1bmN0aW9uR2VuZXJhdG9yID0gbmV3IHZtLlNjcmlwdCggYG5ldyBGdW5jdGlvbiggJ3ZtMk9wdGlvbnMnLCB2bTJDb2RlICk7YCApO1xuY29uc3Qgc2NyaXB0Q2FjaGUgPSBuZXcgTWFsaWJ1bkNhY2hlKCk7XG5jb25zdCByZSA9IGNhY2hlZFJlZ0V4cCgvXihbXFxzXFx0XFxuXFxyXSpyZXR1cm5bXFxzXFx0XFxuXFxyXSopPyhcXHtbXFxzXFxTXSpcXH0pKFtcXHNcXHRcXG5cXHI7XT8kKS8pO1xuY29uc3QgYmFiZWxQYXJzZXIgPSByZXF1aXJlKFwiQGJhYmVsL3BhcnNlclwiKTtcbmltcG9ydCBiYWJlbEdlbmVyYXRlIGZyb20gJ0BiYWJlbC9nZW5lcmF0b3InO1xuY29uc3QgYmFiZWxDb3JlID0gcmVxdWlyZShcIkBiYWJlbC9jb3JlXCIpXG5pbXBvcnQgdm1CYWJlbFBsdWdpbiBmcm9tICcuL2JhYmVsLXBsdWdpbic7XG5pbXBvcnQgcmV0dXJuTGFzdEJhYmVsUGx1Z2luIGZyb20gJy4vcmV0dXJuLWxhc3QtYmFiZWwtcGx1Z2luJztcbmZ1bmN0aW9uIGdlbmVyYXRlUmFuZG9tSGFzaCgpIHtcbiAgICByZXR1cm4gbWQ1KF8ucmFuZG9tKDEwMDAwMDAwMCkgKyAnXycgKyBfLnJhbmRvbSgxMDAwMDAwMDApICsgJ18nICsgRGF0ZS5ub3coKSk7XG59XG5pbXBvcnQgTm9kZUNhY2hlIGZyb20gJ25vZGUtY2FjaGUnO1xuXG5jb25zdCBmYkNhY2hlID0gbmV3IE5vZGVDYWNoZSh7XG4gICAgc3RkVFRMOjUqNjAsXG4gICAgY2hlY2twZXJpb2Q6TWF0aC5jZWlsKDYwKSxcbiAgICB1c2VDbG9uZXM6ZmFsc2UsXG4gICAgZGVsZXRlT25FeHBpcmU6dHJ1ZVxufSk7XG5cbmNvbnN0IGZ1bmN0aW9uRnJvbVNjcmlwdCA9IGZ1bmN0aW9uKGV4cHIsdm1DdHgsb3B0aW9ucz17fSl7XG4gICAgbGV0IG9yaWdpbmFsRXhwciA9IGV4cHI7XG4gICAgbGV0IHZtMk9wdGlvbnMgPSB7fTtcbiAgICBsZXQgdm0yT3B0aW9uc0hhc2ggPSBvcHRpb25zLl9fdm1SdW5uZXJIYXNoP29wdGlvbnMuX192bVJ1bm5lckhhc2g6bWQ1KEpTT04uc3RyaW5naWZ5KG9wdGlvbnMpKTtcbiAgICB2bTJPcHRpb25zLmN1c3RvbU9wdGlvbnMgPSBvcHRpb25zO1xuICAgIGNvbnN0IHVzZUNhY2hlID0gdHJ1ZTtcblxuICAgIGxldCBrZXlzQXJyID0gW1xuICAgICAgICBleHByICxcbiAgICAgICAgdm1DdHguX192bVJ1bm5lckhhc2hcbiAgICBdO1xuICAgIGlmKG9wdGlvbnMubG9jYWxTY29wZSYmIV8uaXNFbXB0eShvcHRpb25zLmxvY2FsU2NvcGUpKXtcbiAgICAgICAga2V5c0Fyci5wdXNoKCBfLmtleXMob3B0aW9ucy5sb2NhbFNjb3BlKS5qb2luKCc6JykgKTtcbiAgICAgICAgdm0yT3B0aW9ucy5sb2NhbFNjb3BlID0gb3B0aW9ucy5sb2NhbFNjb3BlO1xuICAgIH1cbiAgICBsZXQga2V5ID0gbWQ1KCBrZXlzQXJyLmpvaW4oJzonKSApO1xuICAgIHZtMk9wdGlvbnMuVk1fUlVOTkVSX0hBU0ggPSBrZXk7XG4gICAgdm0yT3B0aW9ucy5leHByZXNzaW9uID0gb3JpZ2luYWxFeHByO1xuXG4gICAgaWYoIXVzZUNhY2hlfHwhZmJDYWNoZS5nZXQoa2V5KSkge1xuICAgICAgICBpZihyZS50ZXN0KGV4cHIpKXtcbiAgICAgICAgICAgIHJlLmxhc3RJbmRleCA9IDA7XG4gICAgICAgICAgICBleHByID0gZXhwci5yZXBsYWNlKHJlLChtLHByZWZpeCxib2R5LHN1ZmZpeCk9PntcbiAgICAgICAgICAgICAgICBpZihwcmVmaXg9PT11bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgIHByZWZpeCA9ICcnO1xuICAgICAgICAgICAgICAgIGlmKHN1ZmZpeD09PXVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgc3VmZml4ID0gJyc7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGAke3ByZWZpeH0gbmV3IE9iamVjdCgke2JvZHl9KSR7c3VmZml4fWA7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB0b2tlbnMgPSBiYWJlbFBhcnNlci5wYXJzZShleHByLCB7XG4gICAgICAgICAgICBzb3VyY2VUeXBlOiBcInNjcmlwdFwiLFxuICAgICAgICAgICAgcGx1Z2luczogW1xuICAgICAgICAgICAgICAgIFsnZGVjb3JhdG9ycycsIHsgZGVjb3JhdG9yc0JlZm9yZUV4cG9ydDogZmFsc2UgfV1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBhbGxvd1JldHVybk91dHNpZGVGdW5jdGlvbjp0cnVlLFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgeyBjb2RlLCBtYXAsIGFzdCB9ID0gYmFiZWxDb3JlLnRyYW5zZm9ybUZyb21Bc3RTeW5jKHRva2VucywgZXhwciwge1xuICAgICAgICAgICAgZmlsZW5hbWU6IG9wdGlvbnMuZmlsZW5hbWV8fCd2bXJ1bm5lci5qcycsXG4gICAgICAgICAgICBiYWJlbHJjOiBmYWxzZSxcbiAgICAgICAgICAgIGNvbmZpZ0ZpbGU6IGZhbHNlLFxuICAgICAgICAgICAgXCJwcmVzZXRzXCI6IFtbXCJAYmFiZWwvcHJlc2V0LWVudlwiLHt0YXJnZXRzOntub2RlOnRydWUsZXNtb2R1bGVzOmZhbHNlfX1dXSxcbiAgICAgICAgICAgIFwicGx1Z2luc1wiOiBbXG4gICAgICAgICAgICAgICAgWydiYWJlbC1wbHVnaW4tdHJhbnNmb3JtLWxpbmUnXSxcbiAgICAgICAgICAgICAgICBbdm1CYWJlbFBsdWdpbix7bG9jYWxTY29wZTpvcHRpb25zLmxvY2FsU2NvcGV9XSxcbiAgICAgICAgICAgICAgICBbcmV0dXJuTGFzdEJhYmVsUGx1Z2luLHsgdG9wTGV2ZWw6IHRydWUgfV0sXG4gICAgICAgICAgICAgICAgXCJAYmFiZWwvcGx1Z2luLXRyYW5zZm9ybS1ydW50aW1lXCIsXG4gICAgICAgICAgICAgICAgW1wiQGJhYmVsL3BsdWdpbi1zeW50YXgtZHluYW1pYy1pbXBvcnRcIl0sXG4gICAgICAgICAgICAgICAgW1wiQGJhYmVsL3BsdWdpbi1wcm9wb3NhbC1vcHRpb25hbC1jaGFpbmluZ1wiXSxcbiAgICAgICAgICAgICAgICBbXCJAYmFiZWwvcGx1Z2luLXByb3Bvc2FsLWRlY29yYXRvcnNcIiwge1wibGVnYWN5XCI6IHRydWV9XSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAvL1wic291cmNlTWFwc1wiOiAnaW5saW5lJyxcbiAgICAgICAgICAgIFwicmV0YWluTGluZXNcIjogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhjb2RlKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhtYXApO1xuICAgICAgICB2bUN0eC52bTJDb2RlID0gY29kZTtcbiAgICAgICAgbGV0IGYgPSBmdW5jdGlvbkdlbmVyYXRvci5ydW5JbkNvbnRleHQgKCB2bUN0eCApO1xuICAgICAgICBmYkNhY2hlLnNldChrZXksIGYsIDUgKiA2MCk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGY6ZmJDYWNoZS5nZXQoa2V5KSxcbiAgICAgICAgdm0yT3B0aW9uczp2bTJPcHRpb25zXG4gICAgfTtcbn07XG5cblxuLyoqXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBzY29wZVxuICogQHJldHVybnMge09iamVjdH0gc2NvcGUudm1cbiAqIEByZXR1cm5zIHtPYmplY3R9IHNjb3BlLm9yaWdpbmFsXG4gKiBAcGFyYW0ge1ZNUnVubmVyfSBydW5uZXJcbiAqICovXG5mdW5jdGlvbiB3cmFwU2NvcGUoc2NvcGUscnVubmVyLHZtMk9wdGlvbnMpe1xuICAgIGxldCBzY29wZUNvcHkgPSB7fTsvL09iamVjdC5hc3NpZ24oe30sc2NvcGUpO1xuXG4gICAgXy5lYWNoKHNjb3BlLChpbnN0YW5jZSxrZXkpPT57XG4gICAgICAgIGxldCB3cmFwcGVkID0gbnVsbDtcbiAgICAgICAgaWYoXy5pc09iamVjdChpbnN0YW5jZSkgKXtcbiAgICAgICAgICAgIHdyYXBwZWQgPSBuZXcgUHJveHkoaW5zdGFuY2Use1xuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24odGFyZ2V0LCBwcm9wZXJ0eSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0W3Byb3BlcnR5XTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHRhcmdldCwga2V5LCB2YWx1ZSwgcmVjZWl2ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnc2V0IGtleTonLGtleSwndmFsdWU6Jyx2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBuYW1lKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBuYW1lKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG93bktleXModGFyZ2V0KXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRhcmdldCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUsIHByb3BlcnR5RGVzY3JpcHRvcil7XG5cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRlbGV0ZVByb3BlcnR5KHRhcmdldCwgbmFtZSl7XG5cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHByZXZlbnRFeHRlbnNpb25zKHRhcmdldCl7XG5cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGhhcyh0YXJnZXQsIG5hbWUpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmFtZSBpbiB0YXJnZXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgd3JhcHBlZCA9IGluc3RhbmNlO1xuICAgICAgICB9XG4gICAgICAgIHNjb3BlQ29weVtrZXldID0gd3JhcHBlZDtcbiAgICB9KTtcblxuICAgIHNjb3BlQ29weS52bTJPcHRpb25zID0gdm0yT3B0aW9ucztcblxuICAgIGxldCB2bUNvbnRleHQgPSB2bS5jcmVhdGVDb250ZXh0KCBzY29wZUNvcHkgKTtcbiAgICByZXR1cm4ge1xuICAgICAgICB2bTp2bUNvbnRleHQsXG4gICAgICAgIG9yaWdpbmFsOnNjb3BlQ29weVxuICAgIH1cbn1cblxuZnVuY3Rpb24gZ2V0U2NyaXB0KGNvZGUpe1xuICAgIGlmKCFfLmlzU3RyaW5nKGNvZGUpfHwhY29kZSl7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZighc2NyaXB0Q2FjaGUuaGFzKGNvZGUpKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHNjcmlwdCA9IG5ldyB2bS5TY3JpcHQoY29kZSk7XG4gICAgICAgICAgICBzY3JpcHRDYWNoZS5zZXQoY29kZSwgc2NyaXB0LCA1ICogNjAgKiAxMDAwKTtcbiAgICAgICAgfWNhdGNoKGUpe1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNjcmlwdENhY2hlLmdldChjb2RlKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gY29udmVydFJlc3VsdChyZXN1bHQpe1xuICAgIGxldCBjb252ZXJ0ZWQgPSByZXN1bHQ7XG4gICAgaWYoXy5pc0RhdGUocmVzdWx0KSl7XG4gICAgICAgIGNvbnZlcnRlZCA9IG5ldyBEYXRlKCByZXN1bHQuZ2V0VGltZSgpICk7XG4gICAgfWVsc2UgaWYocmVzdWx0ICYmIF8uaXNGdW5jdGlvbihyZXN1bHQudGhlbikpe1xuICAgICAgICBjb252ZXJ0ZWQgPSBhd2FpdCByZXN1bHQ7XG4gICAgfWVsc2UgaWYocmVzdWx0JiZ0eXBlb2YgcmVzdWx0PT0nb2JqZWN0Jyl7XG4gICAgICAgIGNvbnZlcnRlZCA9IEVKU09OLmNsb25lKHJlc3VsdCk7XG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrKHRhcmdldCxzb3VyY2Usa2V5KXtcbiAgICAgICAgICAgIGxldCB2YWwgPSBzb3VyY2Vba2V5XTtcbiAgICAgICAgICAgIGlmKHR5cGVvZiB2YWw9PSdmdW5jdGlvbicpe1xuICAgICAgICAgICAgICAgIHRhcmdldFtrZXldPXZhbDtcbiAgICAgICAgICAgIH1lbHNlIGlmKF8uaXNEYXRlKHZhbCkpe1xuICAgICAgICAgICAgICAgIHRhcmdldFtrZXldID0gbmV3IERhdGUoIHZhbCApO1xuICAgICAgICAgICAgfWVsc2UgaWYoXy5pc0FycmF5KHZhbCl8fF8uaXNPYmplY3QodmFsKSl7XG4gICAgICAgICAgICAgICAgXy5lYWNoKF8ua2V5cyh2YWwpLCh2YWxLZXkpPT57XG4gICAgICAgICAgICAgICAgICAgIGNoZWNrKCB0YXJnZXRba2V5XSAsIHZhbCwgdmFsS2V5KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBfLmVhY2goXy5rZXlzKHJlc3VsdCksKGtleSk9PntcbiAgICAgICAgICAgIGNoZWNrKGNvbnZlcnRlZCxyZXN1bHQsa2V5KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBjb252ZXJ0ZWQ7XG59XG5cbmZ1bmN0aW9uIHdyYXBJblByb3h5KGluc3RhbmNlKXtcbiAgICByZXR1cm4gbmV3IFByb3h5KGluc3RhbmNlLHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbih0YXJnZXQsIHByb3BlcnR5KSB7XG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0W3Byb3BlcnR5XTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodGFyZ2V0LCBrZXksIHZhbHVlLCByZWNlaXZlcikge1xuXG4gICAgICAgIH0sXG4gICAgICAgIGdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIG5hbWUpe1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBuYW1lKTtcbiAgICAgICAgfSxcbiAgICAgICAgb3duS2V5cyh0YXJnZXQpe1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRhcmdldCk7XG4gICAgICAgIH0sXG4gICAgICAgIGRlZmluZVByb3BlcnR5KHRhcmdldCwgbmFtZSwgcHJvcGVydHlEZXNjcmlwdG9yKXtcblxuICAgICAgICB9LFxuICAgICAgICBkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpe1xuXG4gICAgICAgIH0sXG4gICAgICAgIHByZXZlbnRFeHRlbnNpb25zKHRhcmdldCl7XG5cbiAgICAgICAgfSxcbiAgICAgICAgaGFzKHRhcmdldCwgbmFtZSl7XG4gICAgICAgICAgICByZXR1cm4gbmFtZSBpbiB0YXJnZXQ7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuXG5leHBvcnQge1xuICAgIHdyYXBTY29wZSxnZXRTY3JpcHQsZnVuY3Rpb25Gcm9tU2NyaXB0LGNvbnZlcnRSZXN1bHQsZ2VuZXJhdGVSYW5kb21IYXNoLHdyYXBJblByb3h5XG59XG5cbiJdfQ==