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

  var key = md5(expr + ':' + vmCtx.__vmRunnerHash);
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
      [vmBabelPlugin],
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy5qcyJdLCJuYW1lcyI6WyJfIiwibWQ1IiwiRUpTT04iLCJ2bSIsIk1hbGlidW5DYWNoZSIsImNhY2hlZFJlZ0V4cCIsImJhYmVsR2VuZXJhdGUiLCJ2bUJhYmVsUGx1Z2luIiwicmV0dXJuTGFzdEJhYmVsUGx1Z2luIiwiTm9kZUNhY2hlIiwiZXNwcmltYSIsInJlcXVpcmUiLCJlc2NvZGVnZW4iLCJmdW5jdGlvbkdlbmVyYXRvciIsIlNjcmlwdCIsInNjcmlwdENhY2hlIiwicmUiLCJiYWJlbFBhcnNlciIsImJhYmVsQ29yZSIsImdlbmVyYXRlUmFuZG9tSGFzaCIsInJhbmRvbSIsIkRhdGUiLCJub3ciLCJmYkNhY2hlIiwic3RkVFRMIiwiY2hlY2twZXJpb2QiLCJNYXRoIiwiY2VpbCIsInVzZUNsb25lcyIsImRlbGV0ZU9uRXhwaXJlIiwiZnVuY3Rpb25Gcm9tU2NyaXB0IiwiZXhwciIsInZtQ3R4Iiwib3B0aW9ucyIsIm9yaWdpbmFsRXhwciIsInZtMk9wdGlvbnMiLCJ2bTJPcHRpb25zSGFzaCIsIl9fdm1SdW5uZXJIYXNoIiwiSlNPTiIsInN0cmluZ2lmeSIsImN1c3RvbU9wdGlvbnMiLCJ1c2VDYWNoZSIsImtleSIsIlZNX1JVTk5FUl9IQVNIIiwiZXhwcmVzc2lvbiIsImdldCIsInRlc3QiLCJsYXN0SW5kZXgiLCJyZXBsYWNlIiwibSIsInByZWZpeCIsImJvZHkiLCJzdWZmaXgiLCJ1bmRlZmluZWQiLCJ0b2tlbnMiLCJwYXJzZSIsInNvdXJjZVR5cGUiLCJwbHVnaW5zIiwiZGVjb3JhdG9yc0JlZm9yZUV4cG9ydCIsImFsbG93UmV0dXJuT3V0c2lkZUZ1bmN0aW9uIiwidHJhbnNmb3JtRnJvbUFzdFN5bmMiLCJmaWxlbmFtZSIsImJhYmVscmMiLCJjb25maWdGaWxlIiwidGFyZ2V0cyIsIm5vZGUiLCJlc21vZHVsZXMiLCJ0b3BMZXZlbCIsImNvZGUiLCJtYXAiLCJhc3QiLCJ2bTJDb2RlIiwiZiIsInJ1bkluQ29udGV4dCIsInNldCIsIndyYXBTY29wZSIsInNjb3BlIiwicnVubmVyIiwic2NvcGVDb3B5IiwiZWFjaCIsImluc3RhbmNlIiwid3JhcHBlZCIsImlzT2JqZWN0IiwiUHJveHkiLCJ0YXJnZXQiLCJwcm9wZXJ0eSIsInZhbHVlIiwicmVjZWl2ZXIiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJuYW1lIiwiT2JqZWN0Iiwib3duS2V5cyIsImdldE93blByb3BlcnR5TmFtZXMiLCJkZWZpbmVQcm9wZXJ0eSIsInByb3BlcnR5RGVzY3JpcHRvciIsImRlbGV0ZVByb3BlcnR5IiwicHJldmVudEV4dGVuc2lvbnMiLCJoYXMiLCJ2bUNvbnRleHQiLCJjcmVhdGVDb250ZXh0Iiwib3JpZ2luYWwiLCJnZXRTY3JpcHQiLCJpc1N0cmluZyIsInNjcmlwdCIsImUiLCJjb252ZXJ0UmVzdWx0IiwicmVzdWx0IiwiY29udmVydGVkIiwiaXNEYXRlIiwiZ2V0VGltZSIsImlzRnVuY3Rpb24iLCJ0aGVuIiwiY2hlY2siLCJzb3VyY2UiLCJ2YWwiLCJpc0FycmF5Iiwia2V5cyIsInZhbEtleSIsImNsb25lIiwid3JhcEluUHJveHkiXSwibWFwcGluZ3MiOiJpc0JBQUEsd0MsSUFBT0EsQzs7QUFFUCx5QixJQUFPQyxHO0FBQ1AsOEIsSUFBT0MsSztBQUNQLHdCLElBQU9DLEU7Ozs7QUFJUCw4QyxJQUFPQyxZO0FBQ1AsOEMsSUFBT0MsWTs7Ozs7O0FBTVAsNkMsSUFBT0MsYTs7QUFFUCw2QyxJQUFPQyxhO0FBQ1AsbUUsSUFBT0MscUI7Ozs7QUFJUCx1QyxJQUFPQyxTLGtFQWhCUCxJQUFNQyxPQUFPLEdBQUdDLE9BQU8sQ0FBQyxTQUFELENBQXZCLENBQ0EsSUFBTUMsU0FBUyxHQUFHRCxPQUFPLENBQUMsV0FBRCxDQUF6QixDQUlBLElBQU1FLGlCQUFpQixHQUFHLElBQUlWLEVBQUUsQ0FBQ1csTUFBUCwwQ0FBMUIsQ0FDQSxJQUFNQyxXQUFXLEdBQUcsSUFBSVgsWUFBSixFQUFwQixDQUNBLElBQU1ZLEVBQUUsR0FB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QUFBLEdBdEJzQixlQXNCbEJiLE1BdEJrQixFQXNCVkssSUF0QlUsRUFzQkw7QUFDYixhQUFPQSxJQUFJLElBQUlMLE1BQWY7QUFDSCxLQXhCcUIsRUFBbkIsQ0FBUDs7QUEwQkgsQzs7OztBQUlHVCxTLEdBQUFBLFMsU0FBVTBCLFMsR0FBQUEsUyxTQUFVdkUsa0IsR0FBQUEsa0IsU0FBbUIyRSxhLEdBQUFBLGEsU0FBY3RGLGtCLEdBQUFBLGtCLFNBQW1Cb0csVyxHQUFBQSxXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZSc7XG5cbmltcG9ydCBtZDUgZnJvbSAnbWQ1JztcbmltcG9ydCBFSlNPTiBmcm9tICdlanNvbic7XG5pbXBvcnQgdm0gZnJvbSAndm0nO1xuXG5jb25zdCBlc3ByaW1hID0gcmVxdWlyZSgnZXNwcmltYScpO1xuY29uc3QgZXNjb2RlZ2VuID0gcmVxdWlyZSgnZXNjb2RlZ2VuJyk7XG5pbXBvcnQgTWFsaWJ1bkNhY2hlIGZyb20gXCIuL01hbGlidW5DYWNoZVwiO1xuaW1wb3J0IGNhY2hlZFJlZ0V4cCBmcm9tICcuL2NhY2hlZFJlZ0V4cCc7XG5cbmNvbnN0IGZ1bmN0aW9uR2VuZXJhdG9yID0gbmV3IHZtLlNjcmlwdCggYG5ldyBGdW5jdGlvbiggJ3ZtMk9wdGlvbnMnLCB2bTJDb2RlICk7YCApO1xuY29uc3Qgc2NyaXB0Q2FjaGUgPSBuZXcgTWFsaWJ1bkNhY2hlKCk7XG5jb25zdCByZSA9IGNhY2hlZFJlZ0V4cCgvXihbXFxzXFx0XFxuXFxyXSpyZXR1cm5bXFxzXFx0XFxuXFxyXSopPyhcXHtbXFxzXFxTXSpcXH0pKFtcXHNcXHRcXG5cXHI7XT8kKS8pO1xuY29uc3QgYmFiZWxQYXJzZXIgPSByZXF1aXJlKFwiQGJhYmVsL3BhcnNlclwiKTtcbmltcG9ydCBiYWJlbEdlbmVyYXRlIGZyb20gJ0BiYWJlbC9nZW5lcmF0b3InO1xuY29uc3QgYmFiZWxDb3JlID0gcmVxdWlyZShcIkBiYWJlbC9jb3JlXCIpXG5pbXBvcnQgdm1CYWJlbFBsdWdpbiBmcm9tICcuL2JhYmVsLXBsdWdpbic7XG5pbXBvcnQgcmV0dXJuTGFzdEJhYmVsUGx1Z2luIGZyb20gJy4vcmV0dXJuLWxhc3QtYmFiZWwtcGx1Z2luJztcbmZ1bmN0aW9uIGdlbmVyYXRlUmFuZG9tSGFzaCgpIHtcbiAgICByZXR1cm4gbWQ1KF8ucmFuZG9tKDEwMDAwMDAwMCkgKyAnXycgKyBfLnJhbmRvbSgxMDAwMDAwMDApICsgJ18nICsgRGF0ZS5ub3coKSk7XG59XG5pbXBvcnQgTm9kZUNhY2hlIGZyb20gJ25vZGUtY2FjaGUnO1xuXG5jb25zdCBmYkNhY2hlID0gbmV3IE5vZGVDYWNoZSh7XG4gICAgc3RkVFRMOjUqNjAsXG4gICAgY2hlY2twZXJpb2Q6TWF0aC5jZWlsKDYwKSxcbiAgICB1c2VDbG9uZXM6ZmFsc2UsXG4gICAgZGVsZXRlT25FeHBpcmU6dHJ1ZVxufSk7XG5cbmNvbnN0IGZ1bmN0aW9uRnJvbVNjcmlwdCA9IGZ1bmN0aW9uKGV4cHIsdm1DdHgsb3B0aW9ucz17fSl7XG4gICAgbGV0IG9yaWdpbmFsRXhwciA9IGV4cHI7XG4gICAgbGV0IHZtMk9wdGlvbnMgPSB7fTtcbiAgICBsZXQgdm0yT3B0aW9uc0hhc2ggPSBvcHRpb25zLl9fdm1SdW5uZXJIYXNoP29wdGlvbnMuX192bVJ1bm5lckhhc2g6bWQ1KEpTT04uc3RyaW5naWZ5KG9wdGlvbnMpKTtcbiAgICB2bTJPcHRpb25zLmN1c3RvbU9wdGlvbnMgPSBvcHRpb25zO1xuICAgIGNvbnN0IHVzZUNhY2hlID0gdHJ1ZTtcblxuICAgIGxldCBrZXkgPSBtZDUoIGV4cHIrJzonK3ZtQ3R4Ll9fdm1SdW5uZXJIYXNoICApO1xuICAgIHZtMk9wdGlvbnMuVk1fUlVOTkVSX0hBU0ggPSBrZXk7XG4gICAgdm0yT3B0aW9ucy5leHByZXNzaW9uID0gb3JpZ2luYWxFeHByO1xuICAgIGlmKCF1c2VDYWNoZXx8IWZiQ2FjaGUuZ2V0KGtleSkpIHtcbiAgICAgICAgaWYocmUudGVzdChleHByKSl7XG4gICAgICAgICAgICByZS5sYXN0SW5kZXggPSAwO1xuICAgICAgICAgICAgZXhwciA9IGV4cHIucmVwbGFjZShyZSwobSxwcmVmaXgsYm9keSxzdWZmaXgpPT57XG4gICAgICAgICAgICAgICAgaWYocHJlZml4PT09dW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICBwcmVmaXggPSAnJztcbiAgICAgICAgICAgICAgICBpZihzdWZmaXg9PT11bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgIHN1ZmZpeCA9ICcnO1xuICAgICAgICAgICAgICAgIHJldHVybiBgJHtwcmVmaXh9IG5ldyBPYmplY3QoJHtib2R5fSkke3N1ZmZpeH1gO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgdG9rZW5zID0gYmFiZWxQYXJzZXIucGFyc2UoZXhwciwge1xuICAgICAgICAgICAgc291cmNlVHlwZTogXCJzY3JpcHRcIixcbiAgICAgICAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgICAgICAgICBbJ2RlY29yYXRvcnMnLCB7IGRlY29yYXRvcnNCZWZvcmVFeHBvcnQ6IGZhbHNlIH1dXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgYWxsb3dSZXR1cm5PdXRzaWRlRnVuY3Rpb246dHJ1ZSxcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IHsgY29kZSwgbWFwLCBhc3QgfSA9IGJhYmVsQ29yZS50cmFuc2Zvcm1Gcm9tQXN0U3luYyh0b2tlbnMsIGV4cHIsIHtcbiAgICAgICAgICAgIGZpbGVuYW1lOiBvcHRpb25zLmZpbGVuYW1lfHwndm1ydW5uZXIuanMnLFxuICAgICAgICAgICAgYmFiZWxyYzogZmFsc2UsXG4gICAgICAgICAgICBjb25maWdGaWxlOiBmYWxzZSxcbiAgICAgICAgICAgIFwicHJlc2V0c1wiOiBbW1wiQGJhYmVsL3ByZXNldC1lbnZcIix7dGFyZ2V0czp7bm9kZTp0cnVlLGVzbW9kdWxlczpmYWxzZX19XV0sXG4gICAgICAgICAgICBcInBsdWdpbnNcIjogW1xuICAgICAgICAgICAgICAgIFsnYmFiZWwtcGx1Z2luLXRyYW5zZm9ybS1saW5lJ10sXG4gICAgICAgICAgICAgICAgW3ZtQmFiZWxQbHVnaW5dLFxuICAgICAgICAgICAgICAgIFtyZXR1cm5MYXN0QmFiZWxQbHVnaW4seyB0b3BMZXZlbDogdHJ1ZSB9XSxcbiAgICAgICAgICAgICAgICBcIkBiYWJlbC9wbHVnaW4tdHJhbnNmb3JtLXJ1bnRpbWVcIixcbiAgICAgICAgICAgICAgICBbXCJAYmFiZWwvcGx1Z2luLXN5bnRheC1keW5hbWljLWltcG9ydFwiXSxcbiAgICAgICAgICAgICAgICBbXCJAYmFiZWwvcGx1Z2luLXByb3Bvc2FsLW9wdGlvbmFsLWNoYWluaW5nXCJdLFxuICAgICAgICAgICAgICAgIFtcIkBiYWJlbC9wbHVnaW4tcHJvcG9zYWwtZGVjb3JhdG9yc1wiLCB7XCJsZWdhY3lcIjogdHJ1ZX1dLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIC8vXCJzb3VyY2VNYXBzXCI6ICdpbmxpbmUnLFxuICAgICAgICAgICAgXCJyZXRhaW5MaW5lc1wiOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgICAvL2NvbnNvbGUubG9nKGNvZGUpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKG1hcCk7XG4gICAgICAgIHZtQ3R4LnZtMkNvZGUgPSBjb2RlO1xuICAgICAgICBsZXQgZiA9IGZ1bmN0aW9uR2VuZXJhdG9yLnJ1bkluQ29udGV4dCAoIHZtQ3R4ICk7XG4gICAgICAgIGZiQ2FjaGUuc2V0KGtleSwgZiwgNSAqIDYwKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZjpmYkNhY2hlLmdldChrZXkpLFxuICAgICAgICB2bTJPcHRpb25zOnZtMk9wdGlvbnNcbiAgICB9O1xufTtcblxuXG4vKipcbiAqIEByZXR1cm5zIHtPYmplY3R9IHNjb3BlXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBzY29wZS52bVxuICogQHJldHVybnMge09iamVjdH0gc2NvcGUub3JpZ2luYWxcbiAqIEBwYXJhbSB7Vk1SdW5uZXJ9IHJ1bm5lclxuICogKi9cbmZ1bmN0aW9uIHdyYXBTY29wZShzY29wZSxydW5uZXIsdm0yT3B0aW9ucyl7XG4gICAgbGV0IHNjb3BlQ29weSA9IHt9Oy8vT2JqZWN0LmFzc2lnbih7fSxzY29wZSk7XG5cbiAgICBfLmVhY2goc2NvcGUsKGluc3RhbmNlLGtleSk9PntcbiAgICAgICAgbGV0IHdyYXBwZWQgPSBudWxsO1xuICAgICAgICBpZihfLmlzT2JqZWN0KGluc3RhbmNlKSApe1xuICAgICAgICAgICAgd3JhcHBlZCA9IG5ldyBQcm94eShpbnN0YW5jZSx7XG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbih0YXJnZXQsIHByb3BlcnR5KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXRbcHJvcGVydHldO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodGFyZ2V0LCBrZXksIHZhbHVlLCByZWNlaXZlcikge1xuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdzZXQga2V5Oicsa2V5LCd2YWx1ZTonLHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIG5hbWUpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIG5hbWUpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgb3duS2V5cyh0YXJnZXQpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGFyZ2V0KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRlZmluZVByb3BlcnR5KHRhcmdldCwgbmFtZSwgcHJvcGVydHlEZXNjcmlwdG9yKXtcblxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBuYW1lKXtcblxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcHJldmVudEV4dGVuc2lvbnModGFyZ2V0KXtcblxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgaGFzKHRhcmdldCwgbmFtZSl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuYW1lIGluIHRhcmdldDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB3cmFwcGVkID0gaW5zdGFuY2U7XG4gICAgICAgIH1cbiAgICAgICAgc2NvcGVDb3B5W2tleV0gPSB3cmFwcGVkO1xuICAgIH0pO1xuXG4gICAgc2NvcGVDb3B5LnZtMk9wdGlvbnMgPSB2bTJPcHRpb25zO1xuXG4gICAgbGV0IHZtQ29udGV4dCA9IHZtLmNyZWF0ZUNvbnRleHQoIHNjb3BlQ29weSApO1xuICAgIHJldHVybiB7XG4gICAgICAgIHZtOnZtQ29udGV4dCxcbiAgICAgICAgb3JpZ2luYWw6c2NvcGVDb3B5XG4gICAgfVxufVxuXG5mdW5jdGlvbiBnZXRTY3JpcHQoY29kZSl7XG4gICAgaWYoIV8uaXNTdHJpbmcoY29kZSl8fCFjb2RlKXtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmKCFzY3JpcHRDYWNoZS5oYXMoY29kZSkpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3Qgc2NyaXB0ID0gbmV3IHZtLlNjcmlwdChjb2RlKTtcbiAgICAgICAgICAgIHNjcmlwdENhY2hlLnNldChjb2RlLCBzY3JpcHQsIDUgKiA2MCAqIDEwMDApO1xuICAgICAgICB9Y2F0Y2goZSl7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc2NyaXB0Q2FjaGUuZ2V0KGNvZGUpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBjb252ZXJ0UmVzdWx0KHJlc3VsdCl7XG4gICAgbGV0IGNvbnZlcnRlZCA9IHJlc3VsdDtcbiAgICBpZihfLmlzRGF0ZShyZXN1bHQpKXtcbiAgICAgICAgY29udmVydGVkID0gbmV3IERhdGUoIHJlc3VsdC5nZXRUaW1lKCkgKTtcbiAgICB9ZWxzZSBpZihyZXN1bHQgJiYgXy5pc0Z1bmN0aW9uKHJlc3VsdC50aGVuKSl7XG4gICAgICAgIGNvbnZlcnRlZCA9IGF3YWl0IHJlc3VsdDtcbiAgICB9ZWxzZSBpZihyZXN1bHQmJnR5cGVvZiByZXN1bHQ9PSdvYmplY3QnKXtcbiAgICAgICAgY29udmVydGVkID0gRUpTT04uY2xvbmUocmVzdWx0KTtcbiAgICAgICAgZnVuY3Rpb24gY2hlY2sodGFyZ2V0LHNvdXJjZSxrZXkpe1xuICAgICAgICAgICAgbGV0IHZhbCA9IHNvdXJjZVtrZXldO1xuICAgICAgICAgICAgaWYodHlwZW9mIHZhbD09J2Z1bmN0aW9uJyl7XG4gICAgICAgICAgICAgICAgdGFyZ2V0W2tleV09dmFsO1xuICAgICAgICAgICAgfWVsc2UgaWYoXy5pc0RhdGUodmFsKSl7XG4gICAgICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSBuZXcgRGF0ZSggdmFsICk7XG4gICAgICAgICAgICB9ZWxzZSBpZihfLmlzQXJyYXkodmFsKXx8Xy5pc09iamVjdCh2YWwpKXtcbiAgICAgICAgICAgICAgICBfLmVhY2goXy5rZXlzKHZhbCksKHZhbEtleSk9PntcbiAgICAgICAgICAgICAgICAgICAgY2hlY2soIHRhcmdldFtrZXldICwgdmFsLCB2YWxLZXkpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIF8uZWFjaChfLmtleXMocmVzdWx0KSwoa2V5KT0+e1xuICAgICAgICAgICAgY2hlY2soY29udmVydGVkLHJlc3VsdCxrZXkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbnZlcnRlZDtcbn1cblxuZnVuY3Rpb24gd3JhcEluUHJveHkoaW5zdGFuY2Upe1xuICAgIHJldHVybiBuZXcgUHJveHkoaW5zdGFuY2Use1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKHRhcmdldCwgcHJvcGVydHkpIHtcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXRbcHJvcGVydHldO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh0YXJnZXQsIGtleSwgdmFsdWUsIHJlY2VpdmVyKSB7XG5cbiAgICAgICAgfSxcbiAgICAgICAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgbmFtZSl7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIG5hbWUpO1xuICAgICAgICB9LFxuICAgICAgICBvd25LZXlzKHRhcmdldCl7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGFyZ2V0KTtcbiAgICAgICAgfSxcbiAgICAgICAgZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBuYW1lLCBwcm9wZXJ0eURlc2NyaXB0b3Ipe1xuXG4gICAgICAgIH0sXG4gICAgICAgIGRlbGV0ZVByb3BlcnR5KHRhcmdldCwgbmFtZSl7XG5cbiAgICAgICAgfSxcbiAgICAgICAgcHJldmVudEV4dGVuc2lvbnModGFyZ2V0KXtcblxuICAgICAgICB9LFxuICAgICAgICBoYXModGFyZ2V0LCBuYW1lKXtcbiAgICAgICAgICAgIHJldHVybiBuYW1lIGluIHRhcmdldDtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5cbmV4cG9ydCB7XG4gICAgd3JhcFNjb3BlLGdldFNjcmlwdCxmdW5jdGlvbkZyb21TY3JpcHQsY29udmVydFJlc3VsdCxnZW5lcmF0ZVJhbmRvbUhhc2gsd3JhcEluUHJveHlcbn1cblxuIl19