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
  vmCtx.vm2Options = vmCtx.vm2Options || {};
  var vm2OptionsHash = vmCtx.vm2Options.hash;
  if (!vm2OptionsHash) {
    vm2OptionsHash = generateRandomHash();
  }

  var useCache = !options['debugger'];

  var key = md5(expr + ':' + vm2OptionsHash);
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

  if (!useCache || !fbCache.has(key)) {
    var tokens = babelParser.parse(expr, {
      sourceType: "script",
      plugins: [
      ['decorators', { decoratorsBeforeExport: false }]],

      allowReturnOutsideFunction: true });var _babelCore$transformF =


    babelCore.transformFromAstSync(tokens, expr, {
      babelrc: false,
      configFile: false,
      "presets": [["@babel/preset-env", { targets: { node: true, esmodules: false } }]],
      "plugins": [
      [vmBabelPlugin],
      [returnLastBabelPlugin],
      "@babel/plugin-transform-runtime",
      ["@babel/plugin-syntax-dynamic-import"],
      ["@babel/plugin-proposal-optional-chaining"],
      ["@babel/plugin-proposal-decorators", { "legacy": true }]],

      "sourceMaps": false,
      "retainLines": true }),code = _babelCore$transformF.code,map = _babelCore$transformF.map,ast = _babelCore$transformF.ast;

    //console.log(code);
    vmCtx.vm2Options.functionBody = code;
    vmCtx.vm2Options.customOptions = options;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy5qcyJdLCJuYW1lcyI6WyJfIiwibWQ1IiwiRUpTT04iLCJ2bSIsIk1hbGlidW5DYWNoZSIsImNhY2hlZFJlZ0V4cCIsImJhYmVsR2VuZXJhdGUiLCJ2bUJhYmVsUGx1Z2luIiwicmV0dXJuTGFzdEJhYmVsUGx1Z2luIiwiZXNwcmltYSIsInJlcXVpcmUiLCJlc2NvZGVnZW4iLCJmYkNhY2hlIiwiZnVuY3Rpb25HZW5lcmF0b3IiLCJTY3JpcHQiLCJzY3JpcHRDYWNoZSIsInJlIiwiYmFiZWxQYXJzZXIiLCJiYWJlbENvcmUiLCJnZW5lcmF0ZVJhbmRvbUhhc2giLCJyYW5kb20iLCJEYXRlIiwibm93IiwiZnVuY3Rpb25Gcm9tU2NyaXB0IiwiZXhwciIsInZtQ3R4Iiwib3B0aW9ucyIsInZtMk9wdGlvbnMiLCJ2bTJPcHRpb25zSGFzaCIsImhhc2giLCJ1c2VDYWNoZSIsImtleSIsInRlc3QiLCJsYXN0SW5kZXgiLCJyZXBsYWNlIiwibSIsInByZWZpeCIsImJvZHkiLCJzdWZmaXgiLCJ1bmRlZmluZWQiLCJoYXMiLCJ0b2tlbnMiLCJwYXJzZSIsInNvdXJjZVR5cGUiLCJwbHVnaW5zIiwiZGVjb3JhdG9yc0JlZm9yZUV4cG9ydCIsImFsbG93UmV0dXJuT3V0c2lkZUZ1bmN0aW9uIiwidHJhbnNmb3JtRnJvbUFzdFN5bmMiLCJiYWJlbHJjIiwiY29uZmlnRmlsZSIsInRhcmdldHMiLCJub2RlIiwiZXNtb2R1bGVzIiwiY29kZSIsIm1hcCIsImFzdCIsImZ1bmN0aW9uQm9keSIsImN1c3RvbU9wdGlvbnMiLCJmIiwicnVuSW5Db250ZXh0Iiwic2V0IiwiZ2V0Iiwid3JhcFNjb3BlIiwic2NvcGUiLCJydW5uZXIiLCJzY29wZUNvcHkiLCJlYWNoIiwiaW5zdGFuY2UiLCJ3cmFwcGVkIiwiaXNPYmplY3QiLCJQcm94eSIsInRhcmdldCIsInByb3BlcnR5IiwidmFsdWUiLCJyZWNlaXZlciIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsIm5hbWUiLCJPYmplY3QiLCJvd25LZXlzIiwiZ2V0T3duUHJvcGVydHlOYW1lcyIsImRlZmluZVByb3BlcnR5IiwicHJvcGVydHlEZXNjcmlwdG9yIiwiZGVsZXRlUHJvcGVydHkiLCJwcmV2ZW50RXh0ZW5zaW9ucyIsInZtQ29udGV4dCIsImNyZWF0ZUNvbnRleHQiLCJvcmlnaW5hbCIsImdldFNjcmlwdCIsImlzU3RyaW5nIiwic2NyaXB0IiwiZSIsImNvbnZlcnRSZXN1bHQiLCJyZXN1bHQiLCJjb252ZXJ0ZWQiLCJpc0RhdGUiLCJnZXRUaW1lIiwiaXNGdW5jdGlvbiIsInRoZW4iLCJjaGVjayIsInNvdXJjZSIsInZhbCIsImlzQXJyYXkiLCJrZXlzIiwidmFsS2V5IiwiY2xvbmUiLCJ3cmFwSW5Qcm94eSJdLCJtYXBwaW5ncyI6ImlzQkFBQSx3QyxJQUFPQSxDOztBQUVQLHlCLElBQU9DLEc7QUFDUCw4QixJQUFPQyxLO0FBQ1Asd0IsSUFBT0MsRTs7OztBQUlQLDhDLElBQU9DLFk7QUFDUCw4QyxJQUFPQyxZOzs7Ozs7O0FBT1AsNkMsSUFBT0MsYTs7QUFFUCw2QyxJQUFPQyxhO0FBQ1AsbUUsSUFBT0MscUIsOEVBYlAsSUFBTUMsT0FBTyxHQUFHQyxPQUFPLENBQUMsU0FBRCxDQUF2QixDQUNBLElBQU1DLFNBQVMsR0FBR0QsT0FBTyxDQUFDLFdBQUQsQ0FBekIsQ0FJQSxJQUFNRSxPQUFPLEdBQUcsSUFBSVIsWUFBSixFQUFoQixDQUNBLElBQU1TLGlCQUFpQixHQUFHLElBQUlWLEVBQUUsQ0FBQ1csTUFBUCw0Q0FBMUIsQ0FDQSxJQUFNQyxXQUFXLEdBQUcsSUFBSVgsWUFBSixFQUFwQixDQUNBLElBQU1ZLEVBQUUsR0FBR1gsWUFBWSxDQUFDLDhEQUFELENBQXZCLENBQ0EsSUFBTVksV0FBVyxHQUFHUCxPQUFPLENBQUMsZUFBRCxDQUEzQixDQUVBLElBQU1RLFNBQVMsR0FBR1IsT0FBTyxDQUFDLGFBQUQsQ0FBekI7QUFHQSxTQUFTUyxrQkFBVCxHQUE4QjtBQUMxQixTQUFPbEIsR0FB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LENBQUNGLHdCQUFQLENBQWdDSixNQUFoQyxFQUF3Q0ssSUFBeEMsQ0FBUDtBQUNILEtBVHFCO0FBVXRCRSxJQUFBQSxPQVZzQixtQkFVZFAsTUFWYyxFQVVQO0FBQ1gsYUFBT00sTUFBTSxDQUFDRSxtQkFBUCxDQUEyQlIsTUFBM0IsQ0FBUDtBQUNILEtBWnFCO0FBYXRCUyxJQUFBQSxjQWJzQiwwQkFhUFQsTUFiTyxFQWFDSyxJQWJELEVBYU9LLGtCQWJQLEVBYTBCOztBQUUvQyxLQWZxQjtBQWdCdEJDLElBQUFBLGNBaEJzQiwwQkFnQlBYLE1BaEJPLEVBZ0JDSyxJQWhCRCxFQWdCTTs7QUFFM0IsS0FsQnFCO0FBbUJ0Qk8sSUFBQUEsaUJBbkJzQiw2QkFtQkpaLE1BbkJJLEVBbUJHOztBQUV4QixLQXJCcUI7QUFzQnRCL0IsSUFBQUEsR0F0QnNCLGVBc0JsQitCLE1BdEJrQixFQXNCVkssSUF0QlUsRUFzQkw7QUFDYixhQUFPQSxJQUFJLElBQUlMLE1BQWY7QUFDSCxLQXhCcUIsRUFBbkIsQ0FBUDs7QUEwQkgsQzs7OztBQUlHVCxTLEdBQUFBLFMsU0FBVXlCLFMsR0FBQUEsUyxTQUFVaEUsa0IsR0FBQUEsa0IsU0FBbUJvRSxhLEdBQUFBLGEsU0FBY3hFLGtCLEdBQUFBLGtCLFNBQW1Cc0YsVyxHQUFBQSxXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZSc7XG5cbmltcG9ydCBtZDUgZnJvbSAnbWQ1JztcbmltcG9ydCBFSlNPTiBmcm9tICdlanNvbic7XG5pbXBvcnQgdm0gZnJvbSAndm0nO1xuXG5jb25zdCBlc3ByaW1hID0gcmVxdWlyZSgnZXNwcmltYScpO1xuY29uc3QgZXNjb2RlZ2VuID0gcmVxdWlyZSgnZXNjb2RlZ2VuJyk7XG5pbXBvcnQgTWFsaWJ1bkNhY2hlIGZyb20gXCIuL01hbGlidW5DYWNoZVwiO1xuaW1wb3J0IGNhY2hlZFJlZ0V4cCBmcm9tICcuL2NhY2hlZFJlZ0V4cCc7XG5cbmNvbnN0IGZiQ2FjaGUgPSBuZXcgTWFsaWJ1bkNhY2hlKCk7XG5jb25zdCBmdW5jdGlvbkdlbmVyYXRvciA9IG5ldyB2bS5TY3JpcHQoIGBuZXcgRnVuY3Rpb24oIHZtMk9wdGlvbnMuZnVuY3Rpb25Cb2R5ICk7YCApO1xuY29uc3Qgc2NyaXB0Q2FjaGUgPSBuZXcgTWFsaWJ1bkNhY2hlKCk7XG5jb25zdCByZSA9IGNhY2hlZFJlZ0V4cCgvXihbXFxzXFx0XFxuXFxyXSpyZXR1cm5bXFxzXFx0XFxuXFxyXSopPyhcXHtbXFxzXFxTXSpcXH0pKFtcXHNcXHRcXG5cXHI7XT8kKS8pO1xuY29uc3QgYmFiZWxQYXJzZXIgPSByZXF1aXJlKFwiQGJhYmVsL3BhcnNlclwiKTtcbmltcG9ydCBiYWJlbEdlbmVyYXRlIGZyb20gJ0BiYWJlbC9nZW5lcmF0b3InO1xuY29uc3QgYmFiZWxDb3JlID0gcmVxdWlyZShcIkBiYWJlbC9jb3JlXCIpXG5pbXBvcnQgdm1CYWJlbFBsdWdpbiBmcm9tICcuL2JhYmVsLXBsdWdpbic7XG5pbXBvcnQgcmV0dXJuTGFzdEJhYmVsUGx1Z2luIGZyb20gJy4vcmV0dXJuLWxhc3QtYmFiZWwtcGx1Z2luJztcbmZ1bmN0aW9uIGdlbmVyYXRlUmFuZG9tSGFzaCgpIHtcbiAgICByZXR1cm4gbWQ1KF8ucmFuZG9tKDEwMDAwMDAwMCkgKyAnXycgKyBfLnJhbmRvbSgxMDAwMDAwMDApICsgJ18nICsgRGF0ZS5ub3coKSk7XG59XG5cbmNvbnN0IGZ1bmN0aW9uRnJvbVNjcmlwdCA9IGZ1bmN0aW9uKGV4cHIsdm1DdHgsb3B0aW9ucz17fSl7XG4gICAgdm1DdHgudm0yT3B0aW9ucyA9IHZtQ3R4LnZtMk9wdGlvbnMgfHwge307XG4gICAgbGV0IHZtMk9wdGlvbnNIYXNoID0gdm1DdHgudm0yT3B0aW9ucy5oYXNoO1xuICAgIGlmKCF2bTJPcHRpb25zSGFzaCl7XG4gICAgICAgIHZtMk9wdGlvbnNIYXNoID0gZ2VuZXJhdGVSYW5kb21IYXNoKCk7XG4gICAgfVxuXG4gICAgY29uc3QgdXNlQ2FjaGUgPSAhb3B0aW9uc1snZGVidWdnZXInXTtcblxuICAgIGxldCBrZXkgPSBtZDUoIGV4cHIrJzonK3ZtMk9wdGlvbnNIYXNoICApO1xuICAgIGlmKHJlLnRlc3QoZXhwcikpe1xuICAgICAgICByZS5sYXN0SW5kZXggPSAwO1xuICAgICAgICBleHByID0gZXhwci5yZXBsYWNlKHJlLChtLHByZWZpeCxib2R5LHN1ZmZpeCk9PntcbiAgICAgICAgICAgIGlmKHByZWZpeD09PXVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICBwcmVmaXggPSAnJztcbiAgICAgICAgICAgIGlmKHN1ZmZpeD09PXVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICBzdWZmaXggPSAnJztcbiAgICAgICAgICAgIHJldHVybiBgJHtwcmVmaXh9IG5ldyBPYmplY3QoJHtib2R5fSkke3N1ZmZpeH1gO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpZighdXNlQ2FjaGV8fCFmYkNhY2hlLmhhcyhrZXkpKSB7XG4gICAgICAgIGxldCB0b2tlbnMgPSBiYWJlbFBhcnNlci5wYXJzZShleHByLCB7XG4gICAgICAgICAgICBzb3VyY2VUeXBlOiBcInNjcmlwdFwiLFxuICAgICAgICAgICAgcGx1Z2luczogW1xuICAgICAgICAgICAgICAgIFsnZGVjb3JhdG9ycycsIHsgZGVjb3JhdG9yc0JlZm9yZUV4cG9ydDogZmFsc2UgfV1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBhbGxvd1JldHVybk91dHNpZGVGdW5jdGlvbjp0cnVlLFxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCB7IGNvZGUsIG1hcCwgYXN0IH0gPSBiYWJlbENvcmUudHJhbnNmb3JtRnJvbUFzdFN5bmModG9rZW5zLCBleHByLCB7XG4gICAgICAgICAgICBiYWJlbHJjOiBmYWxzZSxcbiAgICAgICAgICAgIGNvbmZpZ0ZpbGU6IGZhbHNlLFxuICAgICAgICAgICAgXCJwcmVzZXRzXCI6IFtbXCJAYmFiZWwvcHJlc2V0LWVudlwiLHt0YXJnZXRzOntub2RlOnRydWUsZXNtb2R1bGVzOmZhbHNlfX1dXSxcbiAgICAgICAgICAgIFwicGx1Z2luc1wiOiBbXG4gICAgICAgICAgICAgICAgW3ZtQmFiZWxQbHVnaW5dLFxuICAgICAgICAgICAgICAgIFtyZXR1cm5MYXN0QmFiZWxQbHVnaW5dLFxuICAgICAgICAgICAgICAgIFwiQGJhYmVsL3BsdWdpbi10cmFuc2Zvcm0tcnVudGltZVwiLFxuICAgICAgICAgICAgICAgIFtcIkBiYWJlbC9wbHVnaW4tc3ludGF4LWR5bmFtaWMtaW1wb3J0XCJdLFxuICAgICAgICAgICAgICAgIFtcIkBiYWJlbC9wbHVnaW4tcHJvcG9zYWwtb3B0aW9uYWwtY2hhaW5pbmdcIl0sXG4gICAgICAgICAgICAgICAgW1wiQGJhYmVsL3BsdWdpbi1wcm9wb3NhbC1kZWNvcmF0b3JzXCIsIHtcImxlZ2FjeVwiOiB0cnVlfV0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgXCJzb3VyY2VNYXBzXCI6IGZhbHNlLFxuICAgICAgICAgICAgXCJyZXRhaW5MaW5lc1wiOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgICAvL2NvbnNvbGUubG9nKGNvZGUpO1xuICAgICAgICB2bUN0eC52bTJPcHRpb25zLmZ1bmN0aW9uQm9keSA9IGNvZGU7XG4gICAgICAgIHZtQ3R4LnZtMk9wdGlvbnMuY3VzdG9tT3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgIGxldCBmID0gZnVuY3Rpb25HZW5lcmF0b3IucnVuSW5Db250ZXh0ICggdm1DdHggKTtcbiAgICAgICAgZmJDYWNoZS5zZXQgKGtleSwgZiwgNSAqIDYwICogMTAwMCk7XG5cblxuICAgIH1cbiAgICByZXR1cm4gZmJDYWNoZS5nZXQoa2V5KTtcbn07XG5cblxuLyoqXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBzY29wZVxuICogQHJldHVybnMge09iamVjdH0gc2NvcGUudm1cbiAqIEByZXR1cm5zIHtPYmplY3R9IHNjb3BlLm9yaWdpbmFsXG4gKiBAcGFyYW0ge1ZNUnVubmVyfSBydW5uZXJcbiAqICovXG5mdW5jdGlvbiB3cmFwU2NvcGUoc2NvcGUscnVubmVyLHZtMk9wdGlvbnMpe1xuICAgIGxldCBzY29wZUNvcHkgPSB7fTsvL09iamVjdC5hc3NpZ24oe30sc2NvcGUpO1xuXG4gICAgXy5lYWNoKHNjb3BlLChpbnN0YW5jZSxrZXkpPT57XG4gICAgICAgIGxldCB3cmFwcGVkID0gbnVsbDtcbiAgICAgICAgaWYoXy5pc09iamVjdChpbnN0YW5jZSkgKXtcbiAgICAgICAgICAgIHdyYXBwZWQgPSBuZXcgUHJveHkoaW5zdGFuY2Use1xuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24odGFyZ2V0LCBwcm9wZXJ0eSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0W3Byb3BlcnR5XTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHRhcmdldCwga2V5LCB2YWx1ZSwgcmVjZWl2ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnc2V0IGtleTonLGtleSwndmFsdWU6Jyx2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBuYW1lKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBuYW1lKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG93bktleXModGFyZ2V0KXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRhcmdldCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUsIHByb3BlcnR5RGVzY3JpcHRvcil7XG5cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRlbGV0ZVByb3BlcnR5KHRhcmdldCwgbmFtZSl7XG5cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHByZXZlbnRFeHRlbnNpb25zKHRhcmdldCl7XG5cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGhhcyh0YXJnZXQsIG5hbWUpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmFtZSBpbiB0YXJnZXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgd3JhcHBlZCA9IGluc3RhbmNlO1xuICAgICAgICB9XG4gICAgICAgIHNjb3BlQ29weVtrZXldID0gd3JhcHBlZDtcbiAgICB9KTtcblxuICAgIHNjb3BlQ29weS52bTJPcHRpb25zID0gdm0yT3B0aW9ucztcblxuICAgIGxldCB2bUNvbnRleHQgPSB2bS5jcmVhdGVDb250ZXh0KCBzY29wZUNvcHkgKTtcbiAgICByZXR1cm4ge1xuICAgICAgICB2bTp2bUNvbnRleHQsXG4gICAgICAgIG9yaWdpbmFsOnNjb3BlQ29weVxuICAgIH1cbn1cblxuZnVuY3Rpb24gZ2V0U2NyaXB0KGNvZGUpe1xuICAgIGlmKCFfLmlzU3RyaW5nKGNvZGUpfHwhY29kZSl7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZighc2NyaXB0Q2FjaGUuaGFzKGNvZGUpKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHNjcmlwdCA9IG5ldyB2bS5TY3JpcHQoY29kZSk7XG4gICAgICAgICAgICBzY3JpcHRDYWNoZS5zZXQoY29kZSwgc2NyaXB0LCA1ICogNjAgKiAxMDAwKTtcbiAgICAgICAgfWNhdGNoKGUpe1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNjcmlwdENhY2hlLmdldChjb2RlKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gY29udmVydFJlc3VsdChyZXN1bHQpe1xuICAgIGxldCBjb252ZXJ0ZWQgPSByZXN1bHQ7XG4gICAgaWYoXy5pc0RhdGUocmVzdWx0KSl7XG4gICAgICAgIGNvbnZlcnRlZCA9IG5ldyBEYXRlKCByZXN1bHQuZ2V0VGltZSgpICk7XG4gICAgfWVsc2UgaWYocmVzdWx0ICYmIF8uaXNGdW5jdGlvbihyZXN1bHQudGhlbikpe1xuICAgICAgICBjb252ZXJ0ZWQgPSBhd2FpdCByZXN1bHQ7XG4gICAgfWVsc2UgaWYocmVzdWx0JiZ0eXBlb2YgcmVzdWx0PT0nb2JqZWN0Jyl7XG4gICAgICAgIGNvbnZlcnRlZCA9IEVKU09OLmNsb25lKHJlc3VsdCk7XG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrKHRhcmdldCxzb3VyY2Usa2V5KXtcbiAgICAgICAgICAgIGxldCB2YWwgPSBzb3VyY2Vba2V5XTtcbiAgICAgICAgICAgIGlmKHR5cGVvZiB2YWw9PSdmdW5jdGlvbicpe1xuICAgICAgICAgICAgICAgIHRhcmdldFtrZXldPXZhbDtcbiAgICAgICAgICAgIH1lbHNlIGlmKF8uaXNEYXRlKHZhbCkpe1xuICAgICAgICAgICAgICAgIHRhcmdldFtrZXldID0gbmV3IERhdGUoIHZhbCApO1xuICAgICAgICAgICAgfWVsc2UgaWYoXy5pc0FycmF5KHZhbCl8fF8uaXNPYmplY3QodmFsKSl7XG4gICAgICAgICAgICAgICAgXy5lYWNoKF8ua2V5cyh2YWwpLCh2YWxLZXkpPT57XG4gICAgICAgICAgICAgICAgICAgIGNoZWNrKCB0YXJnZXRba2V5XSAsIHZhbCwgdmFsS2V5KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBfLmVhY2goXy5rZXlzKHJlc3VsdCksKGtleSk9PntcbiAgICAgICAgICAgIGNoZWNrKGNvbnZlcnRlZCxyZXN1bHQsa2V5KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBjb252ZXJ0ZWQ7XG59XG5cbmZ1bmN0aW9uIHdyYXBJblByb3h5KGluc3RhbmNlKXtcbiAgICByZXR1cm4gbmV3IFByb3h5KGluc3RhbmNlLHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbih0YXJnZXQsIHByb3BlcnR5KSB7XG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0W3Byb3BlcnR5XTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodGFyZ2V0LCBrZXksIHZhbHVlLCByZWNlaXZlcikge1xuXG4gICAgICAgIH0sXG4gICAgICAgIGdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIG5hbWUpe1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBuYW1lKTtcbiAgICAgICAgfSxcbiAgICAgICAgb3duS2V5cyh0YXJnZXQpe1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRhcmdldCk7XG4gICAgICAgIH0sXG4gICAgICAgIGRlZmluZVByb3BlcnR5KHRhcmdldCwgbmFtZSwgcHJvcGVydHlEZXNjcmlwdG9yKXtcblxuICAgICAgICB9LFxuICAgICAgICBkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpe1xuXG4gICAgICAgIH0sXG4gICAgICAgIHByZXZlbnRFeHRlbnNpb25zKHRhcmdldCl7XG5cbiAgICAgICAgfSxcbiAgICAgICAgaGFzKHRhcmdldCwgbmFtZSl7XG4gICAgICAgICAgICByZXR1cm4gbmFtZSBpbiB0YXJnZXQ7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuXG5leHBvcnQge1xuICAgIHdyYXBTY29wZSxnZXRTY3JpcHQsZnVuY3Rpb25Gcm9tU2NyaXB0LGNvbnZlcnRSZXN1bHQsZ2VuZXJhdGVSYW5kb21IYXNoLHdyYXBJblByb3h5XG59XG5cbiJdfQ==