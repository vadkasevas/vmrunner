"use strict";var _interopRequireDefault3 = require("@babel/runtime/helpers/interopRequireDefault");var _interopRequireDefault2 = _interopRequireDefault3(require("@babel/runtime/helpers/interopRequireDefault"));Object.defineProperty(exports, "__esModule", { value: true });exports.wrapInProxy = exports.generateRandomHash = exports.convertResult = exports.functionFromScript = exports.getScript = exports.wrapScope = undefined;var _regenerator = require("@babel/runtime/regenerator");var _regeneratorRuntime = (0, _interopRequireDefault2["default"])(_regenerator)["default"];var _typeof2 = require("@babel/runtime/helpers/typeof");var _typeof = (0, _interopRequireDefault2["default"])(_typeof2)["default"];var _underscore = require("underscore");var _ = (0, _interopRequireDefault2["default"])(_underscore)["default"];

var _md = require("md5");var md5 = (0, _interopRequireDefault2["default"])(_md)["default"];
var _ejson = require("ejson");var EJSON = (0, _interopRequireDefault2["default"])(_ejson)["default"];
var _vm = require("vm");var vm = (0, _interopRequireDefault2["default"])(_vm)["default"];



var _MalibunCache = require("./MalibunCache");var MalibunCache = (0, _interopRequireDefault2["default"])(_MalibunCache)["default"];
var _cachedRegExp = require("./cachedRegExp");var cachedRegExp = (0, _interopRequireDefault2["default"])(_cachedRegExp)["default"];






var _generator = require("@babel/generator");var babelGenerate = (0, _interopRequireDefault2["default"])(_generator)["default"];

var _babelPlugin = require("./babel-plugin");var vmBabelPlugin = (0, _interopRequireDefault2["default"])(_babelPlugin)["default"];
var _returnLastBabelPlugin = require("./return-last-babel-plugin");var returnLastBabelPlugin = (0, _interopRequireDefault2["default"])(_returnLastBabelPlugin)["default"];var esprima = require('esprima');var escodegen = require('escodegen');var fbCache = new MalibunCache();var functionGenerator = new vm.Script("new Function( vm2Options.functionBody );");var scriptCache = new MalibunCache();var re = cachedRegExp(/^([\s\t\n\r]*return[\s\t\n\r]*)?(\{[\s\S]*\})([\s\t\n\r;]?$)/);var babelParser = require("@babel/parser");var babelCore = require("@babel/core");
function generateRandomHash() {
  return md5(_.random(100000000) + '_' + _.random(100000000) + '_' + Date.now());
}

var functionFromScript = function functionFromScript(expr, vmCtx) {var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var originalExpr = expr;
  vmCtx.vm2Options = vmCtx.vm2Options || {};
  var vm2OptionsHash = md5(JSON.stringify(options));
  vmCtx.vm2Options.customOptions = options;
  var useCache = true;

  var key = md5(expr + ':' + vm2OptionsHash);
  vmCtx.vm2Options.VM_RUNNER_HASH = key;

  if (!useCache || !fbCache.has(key)) {
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

      "sourceMaps": 'inline',
      "retainLines": true }),code = _babelCore$transformF.code,map = _babelCore$transformF.map,ast = _babelCore$transformF.ast;

    //console.log(code);
    //console.log(map);
    vmCtx.vm2Options.expression = originalExpr;
    vmCtx.vm2Options.functionBody = code;
    var f = functionGenerator.runInContext(vmCtx);
    fbCache.set(key, f, 5 * 60 * 1000);
  }
  return fbCache.get(key);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy5qcyJdLCJuYW1lcyI6WyJfIiwibWQ1IiwiRUpTT04iLCJ2bSIsIk1hbGlidW5DYWNoZSIsImNhY2hlZFJlZ0V4cCIsImJhYmVsR2VuZXJhdGUiLCJ2bUJhYmVsUGx1Z2luIiwicmV0dXJuTGFzdEJhYmVsUGx1Z2luIiwiZXNwcmltYSIsInJlcXVpcmUiLCJlc2NvZGVnZW4iLCJmYkNhY2hlIiwiZnVuY3Rpb25HZW5lcmF0b3IiLCJTY3JpcHQiLCJzY3JpcHRDYWNoZSIsInJlIiwiYmFiZWxQYXJzZXIiLCJiYWJlbENvcmUiLCJnZW5lcmF0ZVJhbmRvbUhhc2giLCJyYW5kb20iLCJEYXRlIiwibm93IiwiZnVuY3Rpb25Gcm9tU2NyaXB0IiwiZXhwciIsInZtQ3R4Iiwib3B0aW9ucyIsIm9yaWdpbmFsRXhwciIsInZtMk9wdGlvbnMiLCJ2bTJPcHRpb25zSGFzaCIsIkpTT04iLCJzdHJpbmdpZnkiLCJjdXN0b21PcHRpb25zIiwidXNlQ2FjaGUiLCJrZXkiLCJWTV9SVU5ORVJfSEFTSCIsImhhcyIsInRlc3QiLCJsYXN0SW5kZXgiLCJyZXBsYWNlIiwibSIsInByZWZpeCIsImJvZHkiLCJzdWZmaXgiLCJ1bmRlZmluZWQiLCJ0b2tlbnMiLCJwYXJzZSIsInNvdXJjZVR5cGUiLCJwbHVnaW5zIiwiZGVjb3JhdG9yc0JlZm9yZUV4cG9ydCIsImFsbG93UmV0dXJuT3V0c2lkZUZ1bmN0aW9uIiwidHJhbnNmb3JtRnJvbUFzdFN5bmMiLCJmaWxlbmFtZSIsImJhYmVscmMiLCJjb25maWdGaWxlIiwidGFyZ2V0cyIsIm5vZGUiLCJlc21vZHVsZXMiLCJ0b3BMZXZlbCIsImNvZGUiLCJtYXAiLCJhc3QiLCJleHByZXNzaW9uIiwiZnVuY3Rpb25Cb2R5IiwiZiIsInJ1bkluQ29udGV4dCIsInNldCIsImdldCIsIndyYXBTY29wZSIsInNjb3BlIiwicnVubmVyIiwic2NvcGVDb3B5IiwiZWFjaCIsImluc3RhbmNlIiwid3JhcHBlZCIsImlzT2JqZWN0IiwiUHJveHkiLCJ0YXJnZXQiLCJwcm9wZXJ0eSIsInZhbHVlIiwicmVjZWl2ZXIiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJuYW1lIiwiT2JqZWN0Iiwib3duS2V5cyIsImdldE93blByb3BlcnR5TmFtZXMiLCJkZWZpbmVQcm9wZXJ0eSIsInByb3BlcnR5RGVzY3JpcHRvciIsImRlbGV0ZVByb3BlcnR5IiwicHJldmVudEV4dGVuc2lvbnMiLCJ2bUNvbnRleHQiLCJjcmVhdGVDb250ZXh0Iiwib3JpZ2luYWwiLCJnZXRTY3JpcHQiLCJpc1N0cmluZyIsInNjcmlwdCIsImUiLCJjb252ZXJ0UmVzdWx0IiwicmVzdWx0IiwiY29udmVydGVkIiwiaXNEYXRlIiwiZ2V0VGltZSIsImlzRnVuY3Rpb24iLCJ0aGVuIiwiY2hlY2siLCJzb3VyY2UiLCJ2YWwiLCJpc0FycmF5Iiwia2V5cyIsInZhbEtleSIsImNsb25lIiwid3JhcEluUHJveHkiXSwibWFwcGluZ3MiOiJpc0JBQUEsd0MsSUFBT0EsQzs7QUFFUCx5QixJQUFPQyxHO0FBQ1AsOEIsSUFBT0MsSztBQUNQLHdCLElBQU9DLEU7Ozs7QUFJUCw4QyxJQUFPQyxZO0FBQ1AsOEMsSUFBT0MsWTs7Ozs7OztBQU9QLDZDLElBQU9DLGE7O0FBRVAsNkMsSUFBT0MsYTtBQUNQLG1FLElBQU9DLHFCLDhFQWJQLElBQU1DLE9BQU8sR0FBR0MsT0FBTyxDQUFDLFNBQUQsQ0FBdkIsQ0FDQSxJQUFNQyxTQUFTLEdBQUdELE9BQU8sQ0FBQyxXQUFELENBQXpCLENBSUEsSUFBTUUsT0FBTyxHQUFHLElBQUlSLFlBQUosRUFBaEIsQ0FDQSxJQUFNUyxpQkFBaUIsR0FBRyxJQUFJVixFQUFFLENBQUNXLE1BQVAsNENBQTFCLENBQ0EsSUFBTUMsV0FBVyxHQUFHLElBQUlYLFlBQUosRUFBcEIsQ0FDQSxJQUFNWSxFQUFFLEdBQUdYLFlBQVksQ0FBQyw4REFBRCxDQUF2QixDQUNBLElBQU1ZLFdBQVcsR0FBR1AsT0FBTyxDQUFDLGVBQUQsQ0FBM0IsQ0FFQSxJQUFNUSxTQUFTLEdBQUdSLE9BQU8sQ0FBQyxhQUFELENBQXpCO0FBR0EsU0FBU1Msa0JBQVQsR0FBOEI7QUFDMUIsU0FBT2xCLEdBQUcsQ0FBQ0QsQ0FBQyxDQUFDb0IsTUFBRixDQUFTLFNBQVQsSUFBc0IsR0FBdEIsR0FBNEJwQixDQUFDLENBQUNvQixNQUFGLENBQVMsU0FBVCxDQUE1QixHQUFrRCxHQUFsRCxHQUF3REMsSUFBSSxDQUFDQyxHQUFMLEVBQXpELENBQVY7QUFDSDs7QUFFRCxJQUFNQyxrQkFBa0IsR0FBRyxTQUFyQkEsa0JBQXFCLENBQVNDLElBQVQsRUFBY0MsS0FBZCxFQUErQixLQUFYQyxPQUFXLHVFQUFILEVBQUc7QUFDdEQsTUFBSUMsWUFBWSxHQUFHSCxJQUFuQjtBQUNBQyxFQUFBQSxLQUFLLENBQUNHLFVBQU4sR0FBbUJILEtBQUssQ0FBQ0csVUFBTixJQUFvQixFQUF2QztBQUNBLE1BQUlDLGNBQWMsR0FBRzVCLEdBQUcsQ0FBQzZCLElBQUksQ0FBQ0MsU0FBTCxDQUFlTCxPQUFmLENBQUQsQ0FBeEI7QUFDQUQsRUFBQUEsS0FBSyxDQUFDRyxVQUFOLENBQWlCSSxhQUFqQixHQUFpQ04sT0FBakM7QUFDQSxNQUFNTyxRQUFRLEdBQUcsSUFBakI7O0FBRUEsTUFBSUMsR0FBRyxHQUFHakMsR0FBRyxDQUFFdUIsSUFBSSxHQUFDLEdBQUwsR0FBU0ssY0FBWCxDQUFiO0FBQ0FKLEVBQUFBLEtBQUssQ0FBQ0csVUFBTixDQUFpQk8sY0FBakIsR0FBa0NELEdBQWxDOztBQUVBLE1BQUcsQ0FBQ0QsUUFBRCxJQUFXLENBQUNyQixPQUFPLENBQUN3QixHQUFSLENBQVlGLEdBQVosQ0FBZixFQUFpQztBQUM3QixRQUFHbEIsRUFBRSxDQUFDcUIsSUFBSCxDQUFRYixJQUFSLENBQUgsRUFBaUI7QUFDYlIsTUFBQUEsRUFBRSxDQUFDc0IsU0FBSCxHQUFlLENBQWY7QUFDQWQsTUFBQUEsSUFBSSxHQUFHQSxJQUFJLENBQUNlLE9BQUwsQ0FBYXZCLEVBQWIsRUFBZ0IsVUFBQ3dCLENBQUQsRUFBR0MsTUFBSCxFQUFVQyxJQUFWLEVBQWVDLE1BQWYsRUFBd0I7QUFDM0MsWUFBR0YsTUFBTSxLQUFHRyxTQUFaO0FBQ0lILFFBQUFBLE1BQU0sR0FBRyxFQUFUO0FBQ0osWUFBR0UsTUFBTSxLQUFHQyxTQUFaO0FBQ0lELFFBQUFBLE1BQU0sR0FBRyxFQUFUO0FBQ0oseUJBQVVGLE1BQVYseUJBQStCQyxJQUEvQixjQUF1Q0MsTUFBdkM7QUFDSCxPQU5NLENBQVA7QUFPSDs7QUFFRCxRQUFJRSxNQUFNLEdBQUc1QixXQUFXLENBQUM2QixLQUFaLENBQWtCdEIsSUFBbEIsRUFBd0I7QUFDakN1QixNQUFBQSxVQUFVLEVBQUUsUUFEcUI7QUFFakNDLE1BQUFBLE9BQU8sRUFBRTtBQUNMLE9BQUMsWUFBRCxFQUFlLEVBQUVDLHNCQUFzQixFQUFFLEtBQTFCLEVBQWYsQ0FESyxDQUZ3Qjs7QUFLakNDLE1BQUFBLDBCQUEwQixFQUFDLElBTE0sRUFBeEIsQ0FBYixDQVo2Qjs7O0FBb0JGaEMsSUFBQUEsU0FBUyxDQUFDaUMsb0JBQVYsQ0FBK0JOLE1BQS9CLEVBQXVDckIsSUFBdkMsRUFBNkM7QUFDcEU0QixNQUFBQSxRQUFRLEVBQUUxQixPQUFPLENBQUMwQixRQUFSLElBQWtCLGFBRHdDO0FBRXBFQyxNQUFBQSxPQUFPLEVBQUUsS0FGMkQ7QUFHcEVDLE1BQUFBLFVBQVUsRUFBRSxLQUh3RDtBQUlwRSxpQkFBVyxDQUFDLENBQUMsbUJBQUQsRUFBcUIsRUFBQ0MsT0FBTyxFQUFDLEVBQUNDLElBQUksRUFBQyxJQUFOLEVBQVdDLFNBQVMsRUFBQyxLQUFyQixFQUFULEVBQXJCLENBQUQsQ0FKeUQ7QUFLcEUsaUJBQVc7QUFDUCxPQUFDLDZCQUFELENBRE87QUFFUCxPQUFDbEQsYUFBRCxDQUZPO0FBR1AsT0FBQ0MscUJBQUQsRUFBdUIsRUFBRWtELFFBQVEsRUFBRSxJQUFaLEVBQXZCLENBSE87QUFJUCx1Q0FKTztBQUtQLE9BQUMscUNBQUQsQ0FMTztBQU1QLE9BQUMsMENBQUQsQ0FOTztBQU9QLE9BQUMsbUNBQUQsRUFBc0MsRUFBQyxVQUFVLElBQVgsRUFBdEMsQ0FQTyxDQUx5RDs7QUFjcEUsb0JBQWMsUUFkc0Q7QUFlcEUscUJBQWUsSUFmcUQsRUFBN0MsQ0FwQkUsQ0FvQnJCQyxJQXBCcUIseUJBb0JyQkEsSUFwQnFCLENBb0JmQyxHQXBCZSx5QkFvQmZBLEdBcEJlLENBb0JWQyxHQXBCVSx5QkFvQlZBLEdBcEJVOztBQXFDN0I7QUFDQTtBQUNBcEMsSUFBQUEsS0FBSyxDQUFDRyxVQUFOLENBQWlCa0MsVUFBakIsR0FBOEJuQyxZQUE5QjtBQUNBRixJQUFBQSxLQUFLLENBQUNHLFVBQU4sQ0FBaUJtQyxZQUFqQixHQUFnQ0osSUFBaEM7QUFDQSxRQUFJSyxDQUFDLEdBQUduRCxpQkFBaUIsQ0FBQ29ELFlBQWxCLENBQWlDeEMsS0FBakMsQ0FBUjtBQUNBYixJQUFBQSxPQUFPLENBQUNzRCxHQUFSLENBQWFoQyxHQUFiLEVBQWtCOEIsQ0FBbEIsRUFBcUIsSUFBSSxFQUFKLEdBQVMsSUFBOUI7QUFDSDtBQUNELFNBQU9wRCxPQUFPLENBQUN1RCxHQUFSLENBQVlqQyxHQUFaLENBQVA7QUFDSCxDQXZERDs7O0FBMERBOzs7Ozs7QUFNQSxTQUFTa0MsU0FBVCxDQUFtQkMsS0FBbkIsRUFBeUJDLE1BQXpCLEVBQWdDMUMsVUFBaEMsRUFBMkM7QUFDdkMsTUFBSTJDLFNBQVMsR0FBRyxFQUFoQixDQUR1QyxDQUNwQjs7QUFFbkJ2RSxFQUFBQSxDQUFDLENBQUN3RSxJQUFGLENBQU9ILEtBQVAsRUFBYSxVQUFDSSxRQUFELEVBQVV2QyxHQUFWLEVBQWdCO0FBQ3pCLFFBQUl3QyxPQUFPLEdBQUcsSUFBZDtBQUNBLFFBQUcxRSxDQUFDLENBQUMyRSxRQUFGLENBQVdGLFFBQVgsQ0FBSCxFQUF5QjtBQUNyQkMsTUFBQUEsT0FBTyxHQUFHLElBQUlFLEtBQUosQ0FBVUgsUUFBVixFQUFtQjtBQUN6Qk4sUUFBQUEsR0FBRyxFQUFFLGFBQVNVLE1BQVQsRUFBaUJDLFFBQWpCLEVBQTJCO0FBQzVCLGlCQUFPRCxNQUFNLENBQUNDLFFBQUQsQ0FBYjtBQUNILFNBSHdCO0FBSXpCWixRQUFBQSxHQUFHLEVBQUUsYUFBVVcsTUFBVixFQUFrQjNDLEdBQWxCLEVBQXVCNkMsS0FBdkIsRUFBOEJDLFFBQTlCLEVBQXdDO0FBQ3pDO0FBQ0gsU0FOd0I7QUFPekJDLFFBQUFBLHdCQVB5QixvQ0FPQUosTUFQQSxFQU9RSyxJQVBSLEVBT2E7QUFDbEMsaUJBQU9DLE1BQU0sQ0FBQ0Ysd0JBQVAsQ0FBZ0NKLE1BQWhDLEVBQXdDSyxJQUF4QyxDQUFQO0FBQ0gsU0FUd0I7QUFVekJFLFFBQUFBLE9BVnlCLG1CQVVqQlAsTUFWaUIsRUFVVjtBQUNYLGlCQUFPTSxNQUFNLENBQUNFLG1CQUFQLENBQTJCUixNQUEzQixDQUFQO0FBQ0gsU0Fad0I7QUFhekJTLFFBQUFBLGNBYnlCLDBCQWFWVCxNQWJVLEVBYUZLLElBYkUsRUFhSUssa0JBYkosRUFhdUI7O0FBRS9DLFNBZndCO0FBZ0J6QkMsUUFBQUEsY0FoQnlCLDBCQWdCVlgsTUFoQlUsRUFnQkZLLElBaEJFLEVBZ0JHOztBQUUzQixTQWxCd0I7QUFtQnpCTyxRQUFBQSxpQkFuQnlCLDZCQW1CUFosTUFuQk8sRUFtQkE7O0FBRXhCLFNBckJ3QjtBQXNCekJ6QyxRQUFBQSxHQXRCeUIsZUFzQnJCeUMsTUF0QnFCLEVBc0JiSyxJQXRCYSxFQXNCUjtBQUNiLGlCQUFPQSxJQUFJLElBQUlMLE1BQWY7QUFDSCxTQXhCd0IsRUFBbkIsQ0FBVjs7QUEwQkgsS0EzQkQsTUEyQks7QUFDREgsTUFBQUEsT0FBTyxHQUFHRCxRQUFWO0FBQ0g7QUFDREYsSUFBQUEsU0FBUyxDQUFDckMsR0FBRCxDQUFULEdBQWlCd0MsT0FBakI7QUFDSCxHQWpDRDs7QUFtQ0FILEVBQUFBLFNBQVMsQ0FBQzNDLFVBQVYsR0FBdUJBLFVBQXZCOztBQUVBLE1BQUk4RCxTQUFTLEdBQUd2RixFQUFFLENBQUN3RixhQUFILENBQWtCcEIsU0FBbEIsQ0FBaEI7QUFDQSxTQUFPO0FBQ0hwRSxJQUFBQSxFQUFFLEVBQUN1RixTQURBO0FBRUhFLElBQUFBLFFBQVEsRUFBQ3JCLFNBRk4sRUFBUDs7QUFJSDs7QUFFRCxTQUFTc0IsU0FBVCxDQUFtQmxDLElBQW5CLEVBQXdCO0FBQ3BCLE1BQUcsQ0FBQzNELENBQUMsQ0FBQzhGLFFBQUYsQ0FBV25DLElBQVgsQ0FBRCxJQUFtQixDQUFDQSxJQUF2QixFQUE0QjtBQUN4QixXQUFPLElBQVA7QUFDSDtBQUNELE1BQUcsQ0FBQzVDLFdBQVcsQ0FBQ3FCLEdBQVosQ0FBZ0J1QixJQUFoQixDQUFKLEVBQTBCO0FBQ3RCLFFBQUk7QUFDQSxVQUFNb0MsTUFBTSxHQUFHLElBQUk1RixFQUFFLENBQUNXLE1BQVAsQ0FBYzZDLElBQWQsQ0FBZjtBQUNBNUMsTUFBQUEsV0FBVyxDQUFDbUQsR0FBWixDQUFnQlAsSUFBaEIsRUFBc0JvQyxNQUF0QixFQUE4QixJQUFJLEVBQUosR0FBUyxJQUF2QztBQUNILEtBSEQsQ0FHQyxPQUFNQyxDQUFOLEVBQVE7QUFDTCxhQUFPLElBQVA7QUFDSDtBQUNKO0FBQ0QsU0FBT2pGLFdBQVcsQ0FBQ29ELEdBQVosQ0FBZ0JSLElBQWhCLENBQVA7QUFDSDs7QUFFRCxTQUFlc0MsYUFBZixDQUE2QkMsTUFBN0I7QUFDUUMsVUFBQUEsU0FEUixHQUNvQkQsTUFEcEI7QUFFT2xHLFVBQUFBLENBQUMsQ0FBQ29HLE1BQUYsQ0FBU0YsTUFBVCxDQUZQO0FBR1FDLFVBQUFBLFNBQVMsR0FBRyxJQUFJOUUsSUFBSixDQUFVNkUsTUFBTSxDQUFDRyxPQUFQLEVBQVYsQ0FBWixDQUhSO0FBSWFILFVBQUFBLE1BQU0sSUFBSWxHLENBQUMsQ0FBQ3NHLFVBQUYsQ0FBYUosTUFBTSxDQUFDSyxJQUFwQixDQUp2QjtBQUswQkwsVUFBQUEsTUFMMUIsU0FLUUMsU0FMUjtBQU1VLGNBQUdELE1BQU0sSUFBRSxRQUFPQSxNQUFQLEtBQWUsUUFBMUIsRUFBbUM7O0FBRTVCTSxZQUFBQSxLQUY0QixHQUVyQyxTQUFTQSxLQUFULENBQWUzQixNQUFmLEVBQXNCNEIsTUFBdEIsRUFBNkJ2RSxHQUE3QixFQUFpQztBQUM3QixrQkFBSXdFLEdBQUcsR0FBR0QsTUFBTSxDQUFDdkUsR0FBRCxDQUFoQjtBQUNBLGtCQUFHLE9BQU93RSxHQUFQLElBQVksVUFBZixFQUEwQjtBQUN0QjdCLGdCQUFBQSxNQUFNLENBQUMzQyxHQUFELENBQU4sR0FBWXdFLEdBQVo7QUFDSCxlQUZELE1BRU0sSUFBRzFHLENBQUMsQ0FBQ29HLE1BQUYsQ0FBU00sR0FBVCxDQUFILEVBQWlCO0FBQ25CN0IsZ0JBQUFBLE1BQU0sQ0FBQzNDLEdBQUQsQ0FBTixHQUFjLElBQUliLElBQUosQ0FBVXFGLEdBQVYsQ0FBZDtBQUNILGVBRkssTUFFQSxJQUFHMUcsQ0FBQyxDQUFDMkcsT0FBRixDQUFVRCxHQUFWLEtBQWdCMUcsQ0FBQyxDQUFDMkUsUUFBRixDQUFXK0IsR0FBWCxDQUFuQixFQUFtQztBQUNyQzFHLGdCQUFBQSxDQUFDLENBQUN3RSxJQUFGLENBQU94RSxDQUFDLENBQUM0RyxJQUFGLENBQU9GLEdBQVAsQ0FBUCxFQUFtQixVQUFDRyxNQUFELEVBQVU7QUFDekJMLGtCQUFBQSxLQUFLLENBQUUzQixNQUFNLENBQUMzQyxHQUFELENBQVIsRUFBZ0J3RSxHQUFoQixFQUFxQkcsTUFBckIsQ0FBTDtBQUNILGlCQUZEO0FBR0g7QUFDSixhQWJvQyxDQUNyQ1YsU0FBUyxHQUFHakcsS0FBSyxDQUFDNEcsS0FBTixDQUFZWixNQUFaLENBQVo7QUFhQWxHLFlBQUFBLENBQUMsQ0FBQ3dFLElBQUYsQ0FBT3hFLENBQUMsQ0FBQzRHLElBQUYsQ0FBT1YsTUFBUCxDQUFQLEVBQXNCLFVBQUNoRSxHQUFELEVBQU87QUFDekJzRSxjQUFBQSxLQUFLLENBQUNMLFNBQUQsRUFBV0QsTUFBWCxFQUFrQmhFLEdBQWxCLENBQUw7QUFDSCxhQUZEO0FBR0gsV0F2Qkw7QUF3QldpRSxVQUFBQSxTQXhCWDs7O0FBMkJBLFNBQVNZLFdBQVQsQ0FBcUJ0QyxRQUFyQixFQUE4QjtBQUMxQixTQUFPLElBQUlHLEtBQUosQ0FBVUgsUUFBVixFQUFtQjtBQUN0Qk4sSUFBQUEsR0FBRyxFQUFFLGFBQVNVLE1BQVQsRUFBaUJDLFFBQWpCLEVBQTJCO0FBQzVCLGFBQU9ELE1BQU0sQ0FBQ0MsUUFBRCxDQUFiO0FBQ0gsS0FIcUI7QUFJdEJaLElBQUFBLEdBQUcsRUFBRSxhQUFVVyxNQUFWLEVBQWtCM0MsR0FBbEIsRUFBdUI2QyxLQUF2QixFQUE4QkMsUUFBOUIsRUFBd0M7O0FBRTVDLEtBTnFCO0FBT3RCQyxJQUFBQSx3QkFQc0Isb0NBT0dKLE1BUEgsRUFPV0ssSUFQWCxFQU9nQjtBQUNsQyxhQUFPQyxNQUFNLENBQUNGLHdCQUFQLENBQWdDSixNQUFoQyxFQUF3Q0ssSUFBeEMsQ0FBUDtBQUNILEtBVHFCO0FBVXRCRSxJQUFBQSxPQVZzQixtQkFVZFAsTUFWYyxFQVVQO0FBQ1gsYUFBT00sTUFBTSxDQUFDRSxtQkFBUCxDQUEyQlIsTUFBM0IsQ0FBUDtBQUNILEtBWnFCO0FBYXRCUyxJQUFBQSxjQWJzQiwwQkFhUFQsTUFiTyxFQWFDSyxJQWJELEVBYU9LLGtCQWJQLEVBYTBCOztBQUUvQyxLQWZxQjtBQWdCdEJDLElBQUFBLGNBaEJzQiwwQkFnQlBYLE1BaEJPLEVBZ0JDSyxJQWhCRCxFQWdCTTs7QUFFM0IsS0FsQnFCO0FBbUJ0Qk8sSUFBQUEsaUJBbkJzQiw2QkFtQkpaLE1BbkJJLEVBbUJHOztBQUV4QixLQXJCcUI7QUFzQnRCekMsSUFBQUEsR0F0QnNCLGVBc0JsQnlDLE1BdEJrQixFQXNCVkssSUF0QlUsRUFzQkw7QUFDYixhQUFPQSxJQUFJLElBQUlMLE1BQWY7QUFDSCxLQXhCcUIsRUFBbkIsQ0FBUDs7QUEwQkgsQzs7OztBQUlHVCxTLEdBQUFBLFMsU0FBVXlCLFMsR0FBQUEsUyxTQUFVdEUsa0IsR0FBQUEsa0IsU0FBbUIwRSxhLEdBQUFBLGEsU0FBYzlFLGtCLEdBQUFBLGtCLFNBQW1CNEYsVyxHQUFBQSxXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZSc7XG5cbmltcG9ydCBtZDUgZnJvbSAnbWQ1JztcbmltcG9ydCBFSlNPTiBmcm9tICdlanNvbic7XG5pbXBvcnQgdm0gZnJvbSAndm0nO1xuXG5jb25zdCBlc3ByaW1hID0gcmVxdWlyZSgnZXNwcmltYScpO1xuY29uc3QgZXNjb2RlZ2VuID0gcmVxdWlyZSgnZXNjb2RlZ2VuJyk7XG5pbXBvcnQgTWFsaWJ1bkNhY2hlIGZyb20gXCIuL01hbGlidW5DYWNoZVwiO1xuaW1wb3J0IGNhY2hlZFJlZ0V4cCBmcm9tICcuL2NhY2hlZFJlZ0V4cCc7XG5cbmNvbnN0IGZiQ2FjaGUgPSBuZXcgTWFsaWJ1bkNhY2hlKCk7XG5jb25zdCBmdW5jdGlvbkdlbmVyYXRvciA9IG5ldyB2bS5TY3JpcHQoIGBuZXcgRnVuY3Rpb24oIHZtMk9wdGlvbnMuZnVuY3Rpb25Cb2R5ICk7YCApO1xuY29uc3Qgc2NyaXB0Q2FjaGUgPSBuZXcgTWFsaWJ1bkNhY2hlKCk7XG5jb25zdCByZSA9IGNhY2hlZFJlZ0V4cCgvXihbXFxzXFx0XFxuXFxyXSpyZXR1cm5bXFxzXFx0XFxuXFxyXSopPyhcXHtbXFxzXFxTXSpcXH0pKFtcXHNcXHRcXG5cXHI7XT8kKS8pO1xuY29uc3QgYmFiZWxQYXJzZXIgPSByZXF1aXJlKFwiQGJhYmVsL3BhcnNlclwiKTtcbmltcG9ydCBiYWJlbEdlbmVyYXRlIGZyb20gJ0BiYWJlbC9nZW5lcmF0b3InO1xuY29uc3QgYmFiZWxDb3JlID0gcmVxdWlyZShcIkBiYWJlbC9jb3JlXCIpXG5pbXBvcnQgdm1CYWJlbFBsdWdpbiBmcm9tICcuL2JhYmVsLXBsdWdpbic7XG5pbXBvcnQgcmV0dXJuTGFzdEJhYmVsUGx1Z2luIGZyb20gJy4vcmV0dXJuLWxhc3QtYmFiZWwtcGx1Z2luJztcbmZ1bmN0aW9uIGdlbmVyYXRlUmFuZG9tSGFzaCgpIHtcbiAgICByZXR1cm4gbWQ1KF8ucmFuZG9tKDEwMDAwMDAwMCkgKyAnXycgKyBfLnJhbmRvbSgxMDAwMDAwMDApICsgJ18nICsgRGF0ZS5ub3coKSk7XG59XG5cbmNvbnN0IGZ1bmN0aW9uRnJvbVNjcmlwdCA9IGZ1bmN0aW9uKGV4cHIsdm1DdHgsb3B0aW9ucz17fSl7XG4gICAgbGV0IG9yaWdpbmFsRXhwciA9IGV4cHI7XG4gICAgdm1DdHgudm0yT3B0aW9ucyA9IHZtQ3R4LnZtMk9wdGlvbnMgfHwge307XG4gICAgbGV0IHZtMk9wdGlvbnNIYXNoID0gbWQ1KEpTT04uc3RyaW5naWZ5KG9wdGlvbnMpKTtcbiAgICB2bUN0eC52bTJPcHRpb25zLmN1c3RvbU9wdGlvbnMgPSBvcHRpb25zO1xuICAgIGNvbnN0IHVzZUNhY2hlID0gdHJ1ZTtcblxuICAgIGxldCBrZXkgPSBtZDUoIGV4cHIrJzonK3ZtMk9wdGlvbnNIYXNoICApO1xuICAgIHZtQ3R4LnZtMk9wdGlvbnMuVk1fUlVOTkVSX0hBU0ggPSBrZXk7XG5cbiAgICBpZighdXNlQ2FjaGV8fCFmYkNhY2hlLmhhcyhrZXkpKSB7XG4gICAgICAgIGlmKHJlLnRlc3QoZXhwcikpe1xuICAgICAgICAgICAgcmUubGFzdEluZGV4ID0gMDtcbiAgICAgICAgICAgIGV4cHIgPSBleHByLnJlcGxhY2UocmUsKG0scHJlZml4LGJvZHksc3VmZml4KT0+e1xuICAgICAgICAgICAgICAgIGlmKHByZWZpeD09PXVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgcHJlZml4ID0gJyc7XG4gICAgICAgICAgICAgICAgaWYoc3VmZml4PT09dW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICBzdWZmaXggPSAnJztcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7cHJlZml4fSBuZXcgT2JqZWN0KCR7Ym9keX0pJHtzdWZmaXh9YDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHRva2VucyA9IGJhYmVsUGFyc2VyLnBhcnNlKGV4cHIsIHtcbiAgICAgICAgICAgIHNvdXJjZVR5cGU6IFwic2NyaXB0XCIsXG4gICAgICAgICAgICBwbHVnaW5zOiBbXG4gICAgICAgICAgICAgICAgWydkZWNvcmF0b3JzJywgeyBkZWNvcmF0b3JzQmVmb3JlRXhwb3J0OiBmYWxzZSB9XVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGFsbG93UmV0dXJuT3V0c2lkZUZ1bmN0aW9uOnRydWUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IHsgY29kZSwgbWFwLCBhc3QgfSA9IGJhYmVsQ29yZS50cmFuc2Zvcm1Gcm9tQXN0U3luYyh0b2tlbnMsIGV4cHIsIHtcbiAgICAgICAgICAgIGZpbGVuYW1lOiBvcHRpb25zLmZpbGVuYW1lfHwndm1ydW5uZXIuanMnLFxuICAgICAgICAgICAgYmFiZWxyYzogZmFsc2UsXG4gICAgICAgICAgICBjb25maWdGaWxlOiBmYWxzZSxcbiAgICAgICAgICAgIFwicHJlc2V0c1wiOiBbW1wiQGJhYmVsL3ByZXNldC1lbnZcIix7dGFyZ2V0czp7bm9kZTp0cnVlLGVzbW9kdWxlczpmYWxzZX19XV0sXG4gICAgICAgICAgICBcInBsdWdpbnNcIjogW1xuICAgICAgICAgICAgICAgIFsnYmFiZWwtcGx1Z2luLXRyYW5zZm9ybS1saW5lJ10sXG4gICAgICAgICAgICAgICAgW3ZtQmFiZWxQbHVnaW5dLFxuICAgICAgICAgICAgICAgIFtyZXR1cm5MYXN0QmFiZWxQbHVnaW4seyB0b3BMZXZlbDogdHJ1ZSB9XSxcbiAgICAgICAgICAgICAgICBcIkBiYWJlbC9wbHVnaW4tdHJhbnNmb3JtLXJ1bnRpbWVcIixcbiAgICAgICAgICAgICAgICBbXCJAYmFiZWwvcGx1Z2luLXN5bnRheC1keW5hbWljLWltcG9ydFwiXSxcbiAgICAgICAgICAgICAgICBbXCJAYmFiZWwvcGx1Z2luLXByb3Bvc2FsLW9wdGlvbmFsLWNoYWluaW5nXCJdLFxuICAgICAgICAgICAgICAgIFtcIkBiYWJlbC9wbHVnaW4tcHJvcG9zYWwtZGVjb3JhdG9yc1wiLCB7XCJsZWdhY3lcIjogdHJ1ZX1dLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwic291cmNlTWFwc1wiOiAnaW5saW5lJyxcbiAgICAgICAgICAgIFwicmV0YWluTGluZXNcIjogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhjb2RlKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhtYXApO1xuICAgICAgICB2bUN0eC52bTJPcHRpb25zLmV4cHJlc3Npb24gPSBvcmlnaW5hbEV4cHI7XG4gICAgICAgIHZtQ3R4LnZtMk9wdGlvbnMuZnVuY3Rpb25Cb2R5ID0gY29kZTtcbiAgICAgICAgbGV0IGYgPSBmdW5jdGlvbkdlbmVyYXRvci5ydW5JbkNvbnRleHQgKCB2bUN0eCApO1xuICAgICAgICBmYkNhY2hlLnNldCAoa2V5LCBmLCA1ICogNjAgKiAxMDAwKTtcbiAgICB9XG4gICAgcmV0dXJuIGZiQ2FjaGUuZ2V0KGtleSk7XG59O1xuXG5cbi8qKlxuICogQHJldHVybnMge09iamVjdH0gc2NvcGVcbiAqIEByZXR1cm5zIHtPYmplY3R9IHNjb3BlLnZtXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBzY29wZS5vcmlnaW5hbFxuICogQHBhcmFtIHtWTVJ1bm5lcn0gcnVubmVyXG4gKiAqL1xuZnVuY3Rpb24gd3JhcFNjb3BlKHNjb3BlLHJ1bm5lcix2bTJPcHRpb25zKXtcbiAgICBsZXQgc2NvcGVDb3B5ID0ge307Ly9PYmplY3QuYXNzaWduKHt9LHNjb3BlKTtcblxuICAgIF8uZWFjaChzY29wZSwoaW5zdGFuY2Usa2V5KT0+e1xuICAgICAgICBsZXQgd3JhcHBlZCA9IG51bGw7XG4gICAgICAgIGlmKF8uaXNPYmplY3QoaW5zdGFuY2UpICl7XG4gICAgICAgICAgICB3cmFwcGVkID0gbmV3IFByb3h5KGluc3RhbmNlLHtcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKHRhcmdldCwgcHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldFtwcm9wZXJ0eV07XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh0YXJnZXQsIGtleSwgdmFsdWUsIHJlY2VpdmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ3NldCBrZXk6JyxrZXksJ3ZhbHVlOicsdmFsdWUpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgbmFtZSl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgbmFtZSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBvd25LZXlzKHRhcmdldCl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0YXJnZXQpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBuYW1lLCBwcm9wZXJ0eURlc2NyaXB0b3Ipe1xuXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpe1xuXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBwcmV2ZW50RXh0ZW5zaW9ucyh0YXJnZXQpe1xuXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBoYXModGFyZ2V0LCBuYW1lKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5hbWUgaW4gdGFyZ2V0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHdyYXBwZWQgPSBpbnN0YW5jZTtcbiAgICAgICAgfVxuICAgICAgICBzY29wZUNvcHlba2V5XSA9IHdyYXBwZWQ7XG4gICAgfSk7XG5cbiAgICBzY29wZUNvcHkudm0yT3B0aW9ucyA9IHZtMk9wdGlvbnM7XG5cbiAgICBsZXQgdm1Db250ZXh0ID0gdm0uY3JlYXRlQ29udGV4dCggc2NvcGVDb3B5ICk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdm06dm1Db250ZXh0LFxuICAgICAgICBvcmlnaW5hbDpzY29wZUNvcHlcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGdldFNjcmlwdChjb2RlKXtcbiAgICBpZighXy5pc1N0cmluZyhjb2RlKXx8IWNvZGUpe1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYoIXNjcmlwdENhY2hlLmhhcyhjb2RlKSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBzY3JpcHQgPSBuZXcgdm0uU2NyaXB0KGNvZGUpO1xuICAgICAgICAgICAgc2NyaXB0Q2FjaGUuc2V0KGNvZGUsIHNjcmlwdCwgNSAqIDYwICogMTAwMCk7XG4gICAgICAgIH1jYXRjaChlKXtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzY3JpcHRDYWNoZS5nZXQoY29kZSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNvbnZlcnRSZXN1bHQocmVzdWx0KXtcbiAgICBsZXQgY29udmVydGVkID0gcmVzdWx0O1xuICAgIGlmKF8uaXNEYXRlKHJlc3VsdCkpe1xuICAgICAgICBjb252ZXJ0ZWQgPSBuZXcgRGF0ZSggcmVzdWx0LmdldFRpbWUoKSApO1xuICAgIH1lbHNlIGlmKHJlc3VsdCAmJiBfLmlzRnVuY3Rpb24ocmVzdWx0LnRoZW4pKXtcbiAgICAgICAgY29udmVydGVkID0gYXdhaXQgcmVzdWx0O1xuICAgIH1lbHNlIGlmKHJlc3VsdCYmdHlwZW9mIHJlc3VsdD09J29iamVjdCcpe1xuICAgICAgICBjb252ZXJ0ZWQgPSBFSlNPTi5jbG9uZShyZXN1bHQpO1xuICAgICAgICBmdW5jdGlvbiBjaGVjayh0YXJnZXQsc291cmNlLGtleSl7XG4gICAgICAgICAgICBsZXQgdmFsID0gc291cmNlW2tleV07XG4gICAgICAgICAgICBpZih0eXBlb2YgdmFsPT0nZnVuY3Rpb24nKXtcbiAgICAgICAgICAgICAgICB0YXJnZXRba2V5XT12YWw7XG4gICAgICAgICAgICB9ZWxzZSBpZihfLmlzRGF0ZSh2YWwpKXtcbiAgICAgICAgICAgICAgICB0YXJnZXRba2V5XSA9IG5ldyBEYXRlKCB2YWwgKTtcbiAgICAgICAgICAgIH1lbHNlIGlmKF8uaXNBcnJheSh2YWwpfHxfLmlzT2JqZWN0KHZhbCkpe1xuICAgICAgICAgICAgICAgIF8uZWFjaChfLmtleXModmFsKSwodmFsS2V5KT0+e1xuICAgICAgICAgICAgICAgICAgICBjaGVjayggdGFyZ2V0W2tleV0gLCB2YWwsIHZhbEtleSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXy5lYWNoKF8ua2V5cyhyZXN1bHQpLChrZXkpPT57XG4gICAgICAgICAgICBjaGVjayhjb252ZXJ0ZWQscmVzdWx0LGtleSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gY29udmVydGVkO1xufVxuXG5mdW5jdGlvbiB3cmFwSW5Qcm94eShpbnN0YW5jZSl7XG4gICAgcmV0dXJuIG5ldyBQcm94eShpbnN0YW5jZSx7XG4gICAgICAgIGdldDogZnVuY3Rpb24odGFyZ2V0LCBwcm9wZXJ0eSkge1xuICAgICAgICAgICAgcmV0dXJuIHRhcmdldFtwcm9wZXJ0eV07XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHRhcmdldCwga2V5LCB2YWx1ZSwgcmVjZWl2ZXIpIHtcblxuICAgICAgICB9LFxuICAgICAgICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBuYW1lKXtcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgbmFtZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG93bktleXModGFyZ2V0KXtcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0YXJnZXQpO1xuICAgICAgICB9LFxuICAgICAgICBkZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUsIHByb3BlcnR5RGVzY3JpcHRvcil7XG5cbiAgICAgICAgfSxcbiAgICAgICAgZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBuYW1lKXtcblxuICAgICAgICB9LFxuICAgICAgICBwcmV2ZW50RXh0ZW5zaW9ucyh0YXJnZXQpe1xuXG4gICAgICAgIH0sXG4gICAgICAgIGhhcyh0YXJnZXQsIG5hbWUpe1xuICAgICAgICAgICAgcmV0dXJuIG5hbWUgaW4gdGFyZ2V0O1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cblxuZXhwb3J0IHtcbiAgICB3cmFwU2NvcGUsZ2V0U2NyaXB0LGZ1bmN0aW9uRnJvbVNjcmlwdCxjb252ZXJ0UmVzdWx0LGdlbmVyYXRlUmFuZG9tSGFzaCx3cmFwSW5Qcm94eVxufVxuXG4iXX0=