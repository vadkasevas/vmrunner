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
      [vmBabelPlugin],
      [returnLastBabelPlugin, { topLevel: true }],
      "@babel/plugin-transform-runtime",
      ["@babel/plugin-syntax-dynamic-import"],
      ["@babel/plugin-proposal-optional-chaining"],
      ["@babel/plugin-proposal-decorators", { "legacy": true }]],

      "sourceMaps": false,
      "retainLines": true }),code = _babelCore$transformF.code,map = _babelCore$transformF.map,ast = _babelCore$transformF.ast;

    console.log(code);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy5qcyJdLCJuYW1lcyI6WyJfIiwibWQ1IiwiRUpTT04iLCJ2bSIsIk1hbGlidW5DYWNoZSIsImNhY2hlZFJlZ0V4cCIsImJhYmVsR2VuZXJhdGUiLCJ2bUJhYmVsUGx1Z2luIiwicmV0dXJuTGFzdEJhYmVsUGx1Z2luIiwiZXNwcmltYSIsInJlcXVpcmUiLCJlc2NvZGVnZW4iLCJmYkNhY2hlIiwiZnVuY3Rpb25HZW5lcmF0b3IiLCJTY3JpcHQiLCJzY3JpcHRDYWNoZSIsInJlIiwiYmFiZWxQYXJzZXIiLCJiYWJlbENvcmUiLCJnZW5lcmF0ZVJhbmRvbUhhc2giLCJyYW5kb20iLCJEYXRlIiwibm93IiwiZnVuY3Rpb25Gcm9tU2NyaXB0IiwiZXhwciIsInZtQ3R4Iiwib3B0aW9ucyIsInZtMk9wdGlvbnMiLCJ2bTJPcHRpb25zSGFzaCIsIkpTT04iLCJzdHJpbmdpZnkiLCJjdXN0b21PcHRpb25zIiwidXNlQ2FjaGUiLCJrZXkiLCJWTV9SVU5ORVJfSEFTSCIsImhhcyIsInRlc3QiLCJsYXN0SW5kZXgiLCJyZXBsYWNlIiwibSIsInByZWZpeCIsImJvZHkiLCJzdWZmaXgiLCJ1bmRlZmluZWQiLCJ0b2tlbnMiLCJwYXJzZSIsInNvdXJjZVR5cGUiLCJwbHVnaW5zIiwiZGVjb3JhdG9yc0JlZm9yZUV4cG9ydCIsImFsbG93UmV0dXJuT3V0c2lkZUZ1bmN0aW9uIiwidHJhbnNmb3JtRnJvbUFzdFN5bmMiLCJmaWxlbmFtZSIsImJhYmVscmMiLCJjb25maWdGaWxlIiwidGFyZ2V0cyIsIm5vZGUiLCJlc21vZHVsZXMiLCJ0b3BMZXZlbCIsImNvZGUiLCJtYXAiLCJhc3QiLCJjb25zb2xlIiwibG9nIiwiZnVuY3Rpb25Cb2R5IiwiZiIsInJ1bkluQ29udGV4dCIsInNldCIsImdldCIsIndyYXBTY29wZSIsInNjb3BlIiwicnVubmVyIiwic2NvcGVDb3B5IiwiZWFjaCIsImluc3RhbmNlIiwid3JhcHBlZCIsImlzT2JqZWN0IiwiUHJveHkiLCJ0YXJnZXQiLCJwcm9wZXJ0eSIsInZhbHVlIiwicmVjZWl2ZXIiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJuYW1lIiwiT2JqZWN0Iiwib3duS2V5cyIsImdldE93blByb3BlcnR5TmFtZXMiLCJkZWZpbmVQcm9wZXJ0eSIsInByb3BlcnR5RGVzY3JpcHRvciIsImRlbGV0ZVByb3BlcnR5IiwicHJldmVudEV4dGVuc2lvbnMiLCJ2bUNvbnRleHQiLCJjcmVhdGVDb250ZXh0Iiwib3JpZ2luYWwiLCJnZXRTY3JpcHQiLCJpc1N0cmluZyIsInNjcmlwdCIsImUiLCJjb252ZXJ0UmVzdWx0IiwicmVzdWx0IiwiY29udmVydGVkIiwiaXNEYXRlIiwiZ2V0VGltZSIsImlzRnVuY3Rpb24iLCJ0aGVuIiwiY2hlY2siLCJzb3VyY2UiLCJ2YWwiLCJpc0FycmF5Iiwia2V5cyIsInZhbEtleSIsImNsb25lIiwid3JhcEluUHJveHkiXSwibWFwcGluZ3MiOiJpc0JBQUEsd0MsSUFBT0EsQzs7QUFFUCx5QixJQUFPQyxHO0FBQ1AsOEIsSUFBT0MsSztBQUNQLHdCLElBQU9DLEU7Ozs7QUFJUCw4QyxJQUFPQyxZO0FBQ1AsOEMsSUFBT0MsWTs7Ozs7OztBQU9QLDZDLElBQU9DLGE7O0FBRVAsNkMsSUFBT0MsYTtBQUNQLG1FLElBQU9DLHFCLDhFQWJQLElBQU1DLE9BQU8sR0FBR0MsT0FBTyxDQUFDLFNBQUQsQ0FBdkIsQ0FDQSxJQUFNQyxTQUFTLEdBQUdELE9BQU8sQ0FBQyxXQUFELENBQXpCLENBSUEsSUFBTUUsT0FBTyxHQUFHLElBQUlSLFlBQUosRUFBaEIsQ0FDQSxJQUFNUyxpQkFBaUIsR0FBRyxJQUFJVixFQUFFLENBQUNXLE1BQVAsNENBQTFCLENBQ0EsSUFBTUMsV0FBVyxHQUFHLElBQUlYLFlBQUosRUFBcEIsQ0FDQSxJQUFNWSxFQUFFLEdBQUdYLFlBQVksQ0FBQyw4REFBRCxDQUF2QixDQUNBLElBQU1ZLFdBQVcsR0FBR1AsT0FBTyxDQUFDLGVBQUQsQ0FBM0IsQ0FFQSxJQUFNUSxTQUFT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QUFDQyxRQUFELENBQWI7QUFDSCxLQUhxQjtBQUl0QlosSUFBQUEsR0FBRyxFQUFFLGFBQVVXLE1BQVYsRUFBa0I1QyxHQUFsQixFQUF1QjhDLEtBQXZCLEVBQThCQyxRQUE5QixFQUF3Qzs7QUFFNUMsS0FOcUI7QUFPdEJDLElBQUFBLHdCQVBzQixvQ0FPR0osTUFQSCxFQU9XSyxJQVBYLEVBT2dCO0FBQ2xDLGFBQU9DLE1BQU0sQ0FBQ0Ysd0JBQVAsQ0FBZ0NKLE1BQWhDLEVBQXdDSyxJQUF4QyxDQUFQO0FBQ0gsS0FUcUI7QUFVdEJFLElBQUFBLE9BVnNCLG1CQVVkUCxNQVZjLEVBVVA7QUFDWCxhQUFPTSxNQUFNLENBQUNFLG1CQUFQLENBQTJCUixNQUEzQixDQUFQO0FBQ0gsS0FacUI7QUFhdEJTLElBQUFBLGNBYnNCLDBCQWFQVCxNQWJPLEVBYUNLLElBYkQsRUFhT0ssa0JBYlAsRUFhMEI7O0FBRS9DLEtBZnFCO0FBZ0J0QkMsSUFBQUEsY0FoQnNCLDBCQWdCUFgsTUFoQk8sRUFnQkNLLElBaEJELEVBZ0JNOztBQUUzQixLQWxCcUI7QUFtQnRCTyxJQUFBQSxpQkFuQnNCLDZCQW1CSlosTUFuQkksRUFtQkc7O0FBRXhCLEtBckJxQjtBQXNCdEIxQyxJQUFBQSxHQXRCc0IsZUFzQmxCMEMsTUF0QmtCLEVBc0JWSyxJQXRCVSxFQXNCTDtBQUNiLGFBQU9BLElBQUksSUFBSUwsTUFBZjtBQUNILEtBeEJxQixFQUFuQixDQUFQOztBQTBCSCxDOzs7O0FBSUdULFMsR0FBQUEsUyxTQUFVeUIsUyxHQUFBQSxTLFNBQVV0RSxrQixHQUFBQSxrQixTQUFtQjBFLGEsR0FBQUEsYSxTQUFjOUUsa0IsR0FBQUEsa0IsU0FBbUI0RixXLEdBQUFBLFciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICd1bmRlcnNjb3JlJztcblxuaW1wb3J0IG1kNSBmcm9tICdtZDUnO1xuaW1wb3J0IEVKU09OIGZyb20gJ2Vqc29uJztcbmltcG9ydCB2bSBmcm9tICd2bSc7XG5cbmNvbnN0IGVzcHJpbWEgPSByZXF1aXJlKCdlc3ByaW1hJyk7XG5jb25zdCBlc2NvZGVnZW4gPSByZXF1aXJlKCdlc2NvZGVnZW4nKTtcbmltcG9ydCBNYWxpYnVuQ2FjaGUgZnJvbSBcIi4vTWFsaWJ1bkNhY2hlXCI7XG5pbXBvcnQgY2FjaGVkUmVnRXhwIGZyb20gJy4vY2FjaGVkUmVnRXhwJztcblxuY29uc3QgZmJDYWNoZSA9IG5ldyBNYWxpYnVuQ2FjaGUoKTtcbmNvbnN0IGZ1bmN0aW9uR2VuZXJhdG9yID0gbmV3IHZtLlNjcmlwdCggYG5ldyBGdW5jdGlvbiggdm0yT3B0aW9ucy5mdW5jdGlvbkJvZHkgKTtgICk7XG5jb25zdCBzY3JpcHRDYWNoZSA9IG5ldyBNYWxpYnVuQ2FjaGUoKTtcbmNvbnN0IHJlID0gY2FjaGVkUmVnRXhwKC9eKFtcXHNcXHRcXG5cXHJdKnJldHVybltcXHNcXHRcXG5cXHJdKik/KFxce1tcXHNcXFNdKlxcfSkoW1xcc1xcdFxcblxccjtdPyQpLyk7XG5jb25zdCBiYWJlbFBhcnNlciA9IHJlcXVpcmUoXCJAYmFiZWwvcGFyc2VyXCIpO1xuaW1wb3J0IGJhYmVsR2VuZXJhdGUgZnJvbSAnQGJhYmVsL2dlbmVyYXRvcic7XG5jb25zdCBiYWJlbENvcmUgPSByZXF1aXJlKFwiQGJhYmVsL2NvcmVcIilcbmltcG9ydCB2bUJhYmVsUGx1Z2luIGZyb20gJy4vYmFiZWwtcGx1Z2luJztcbmltcG9ydCByZXR1cm5MYXN0QmFiZWxQbHVnaW4gZnJvbSAnLi9yZXR1cm4tbGFzdC1iYWJlbC1wbHVnaW4nO1xuZnVuY3Rpb24gZ2VuZXJhdGVSYW5kb21IYXNoKCkge1xuICAgIHJldHVybiBtZDUoXy5yYW5kb20oMTAwMDAwMDAwKSArICdfJyArIF8ucmFuZG9tKDEwMDAwMDAwMCkgKyAnXycgKyBEYXRlLm5vdygpKTtcbn1cblxuY29uc3QgZnVuY3Rpb25Gcm9tU2NyaXB0ID0gZnVuY3Rpb24oZXhwcix2bUN0eCxvcHRpb25zPXt9KXtcbiAgICB2bUN0eC52bTJPcHRpb25zID0gdm1DdHgudm0yT3B0aW9ucyB8fCB7fTtcbiAgICBsZXQgdm0yT3B0aW9uc0hhc2ggPSBtZDUoSlNPTi5zdHJpbmdpZnkob3B0aW9ucykpO1xuICAgIHZtQ3R4LnZtMk9wdGlvbnMuY3VzdG9tT3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgY29uc3QgdXNlQ2FjaGUgPSB0cnVlO1xuXG4gICAgbGV0IGtleSA9IG1kNSggZXhwcisnOicrdm0yT3B0aW9uc0hhc2ggICk7XG4gICAgdm1DdHgudm0yT3B0aW9ucy5WTV9SVU5ORVJfSEFTSCA9IGtleTtcblxuICAgIGlmKCF1c2VDYWNoZXx8IWZiQ2FjaGUuaGFzKGtleSkpIHtcbiAgICAgICAgaWYocmUudGVzdChleHByKSl7XG4gICAgICAgICAgICByZS5sYXN0SW5kZXggPSAwO1xuICAgICAgICAgICAgZXhwciA9IGV4cHIucmVwbGFjZShyZSwobSxwcmVmaXgsYm9keSxzdWZmaXgpPT57XG4gICAgICAgICAgICAgICAgaWYocHJlZml4PT09dW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICBwcmVmaXggPSAnJztcbiAgICAgICAgICAgICAgICBpZihzdWZmaXg9PT11bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgIHN1ZmZpeCA9ICcnO1xuICAgICAgICAgICAgICAgIHJldHVybiBgJHtwcmVmaXh9IG5ldyBPYmplY3QoJHtib2R5fSkke3N1ZmZpeH1gO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgdG9rZW5zID0gYmFiZWxQYXJzZXIucGFyc2UoZXhwciwge1xuICAgICAgICAgICAgc291cmNlVHlwZTogXCJzY3JpcHRcIixcbiAgICAgICAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgICAgICAgICBbJ2RlY29yYXRvcnMnLCB7IGRlY29yYXRvcnNCZWZvcmVFeHBvcnQ6IGZhbHNlIH1dXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgYWxsb3dSZXR1cm5PdXRzaWRlRnVuY3Rpb246dHJ1ZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgeyBjb2RlLCBtYXAsIGFzdCB9ID0gYmFiZWxDb3JlLnRyYW5zZm9ybUZyb21Bc3RTeW5jKHRva2VucywgZXhwciwge1xuICAgICAgICAgICAgZmlsZW5hbWU6IG9wdGlvbnMuZmlsZW5hbWV8fCd2bXJ1bm5lci5qcycsXG4gICAgICAgICAgICBiYWJlbHJjOiBmYWxzZSxcbiAgICAgICAgICAgIGNvbmZpZ0ZpbGU6IGZhbHNlLFxuICAgICAgICAgICAgXCJwcmVzZXRzXCI6IFtbXCJAYmFiZWwvcHJlc2V0LWVudlwiLHt0YXJnZXRzOntub2RlOnRydWUsZXNtb2R1bGVzOmZhbHNlfX1dXSxcbiAgICAgICAgICAgIFwicGx1Z2luc1wiOiBbXG4gICAgICAgICAgICAgICAgW3ZtQmFiZWxQbHVnaW5dLFxuICAgICAgICAgICAgICAgIFtyZXR1cm5MYXN0QmFiZWxQbHVnaW4seyB0b3BMZXZlbDogdHJ1ZSB9XSxcbiAgICAgICAgICAgICAgICBcIkBiYWJlbC9wbHVnaW4tdHJhbnNmb3JtLXJ1bnRpbWVcIixcbiAgICAgICAgICAgICAgICBbXCJAYmFiZWwvcGx1Z2luLXN5bnRheC1keW5hbWljLWltcG9ydFwiXSxcbiAgICAgICAgICAgICAgICBbXCJAYmFiZWwvcGx1Z2luLXByb3Bvc2FsLW9wdGlvbmFsLWNoYWluaW5nXCJdLFxuICAgICAgICAgICAgICAgIFtcIkBiYWJlbC9wbHVnaW4tcHJvcG9zYWwtZGVjb3JhdG9yc1wiLCB7XCJsZWdhY3lcIjogdHJ1ZX1dLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwic291cmNlTWFwc1wiOiBmYWxzZSxcbiAgICAgICAgICAgIFwicmV0YWluTGluZXNcIjogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc29sZS5sb2coY29kZSk7XG4gICAgICAgIHZtQ3R4LnZtMk9wdGlvbnMuZnVuY3Rpb25Cb2R5ID0gY29kZTtcbiAgICAgICAgbGV0IGYgPSBmdW5jdGlvbkdlbmVyYXRvci5ydW5JbkNvbnRleHQgKCB2bUN0eCApO1xuICAgICAgICBmYkNhY2hlLnNldCAoa2V5LCBmLCA1ICogNjAgKiAxMDAwKTtcbiAgICB9XG4gICAgcmV0dXJuIGZiQ2FjaGUuZ2V0KGtleSk7XG59O1xuXG5cbi8qKlxuICogQHJldHVybnMge09iamVjdH0gc2NvcGVcbiAqIEByZXR1cm5zIHtPYmplY3R9IHNjb3BlLnZtXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBzY29wZS5vcmlnaW5hbFxuICogQHBhcmFtIHtWTVJ1bm5lcn0gcnVubmVyXG4gKiAqL1xuZnVuY3Rpb24gd3JhcFNjb3BlKHNjb3BlLHJ1bm5lcix2bTJPcHRpb25zKXtcbiAgICBsZXQgc2NvcGVDb3B5ID0ge307Ly9PYmplY3QuYXNzaWduKHt9LHNjb3BlKTtcblxuICAgIF8uZWFjaChzY29wZSwoaW5zdGFuY2Usa2V5KT0+e1xuICAgICAgICBsZXQgd3JhcHBlZCA9IG51bGw7XG4gICAgICAgIGlmKF8uaXNPYmplY3QoaW5zdGFuY2UpICl7XG4gICAgICAgICAgICB3cmFwcGVkID0gbmV3IFByb3h5KGluc3RhbmNlLHtcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKHRhcmdldCwgcHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldFtwcm9wZXJ0eV07XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh0YXJnZXQsIGtleSwgdmFsdWUsIHJlY2VpdmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ3NldCBrZXk6JyxrZXksJ3ZhbHVlOicsdmFsdWUpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgbmFtZSl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgbmFtZSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBvd25LZXlzKHRhcmdldCl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0YXJnZXQpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBuYW1lLCBwcm9wZXJ0eURlc2NyaXB0b3Ipe1xuXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpe1xuXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBwcmV2ZW50RXh0ZW5zaW9ucyh0YXJnZXQpe1xuXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBoYXModGFyZ2V0LCBuYW1lKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5hbWUgaW4gdGFyZ2V0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHdyYXBwZWQgPSBpbnN0YW5jZTtcbiAgICAgICAgfVxuICAgICAgICBzY29wZUNvcHlba2V5XSA9IHdyYXBwZWQ7XG4gICAgfSk7XG5cbiAgICBzY29wZUNvcHkudm0yT3B0aW9ucyA9IHZtMk9wdGlvbnM7XG5cbiAgICBsZXQgdm1Db250ZXh0ID0gdm0uY3JlYXRlQ29udGV4dCggc2NvcGVDb3B5ICk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdm06dm1Db250ZXh0LFxuICAgICAgICBvcmlnaW5hbDpzY29wZUNvcHlcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGdldFNjcmlwdChjb2RlKXtcbiAgICBpZighXy5pc1N0cmluZyhjb2RlKXx8IWNvZGUpe1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYoIXNjcmlwdENhY2hlLmhhcyhjb2RlKSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBzY3JpcHQgPSBuZXcgdm0uU2NyaXB0KGNvZGUpO1xuICAgICAgICAgICAgc2NyaXB0Q2FjaGUuc2V0KGNvZGUsIHNjcmlwdCwgNSAqIDYwICogMTAwMCk7XG4gICAgICAgIH1jYXRjaChlKXtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzY3JpcHRDYWNoZS5nZXQoY29kZSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNvbnZlcnRSZXN1bHQocmVzdWx0KXtcbiAgICBsZXQgY29udmVydGVkID0gcmVzdWx0O1xuICAgIGlmKF8uaXNEYXRlKHJlc3VsdCkpe1xuICAgICAgICBjb252ZXJ0ZWQgPSBuZXcgRGF0ZSggcmVzdWx0LmdldFRpbWUoKSApO1xuICAgIH1lbHNlIGlmKHJlc3VsdCAmJiBfLmlzRnVuY3Rpb24ocmVzdWx0LnRoZW4pKXtcbiAgICAgICAgY29udmVydGVkID0gYXdhaXQgcmVzdWx0O1xuICAgIH1lbHNlIGlmKHJlc3VsdCYmdHlwZW9mIHJlc3VsdD09J29iamVjdCcpe1xuICAgICAgICBjb252ZXJ0ZWQgPSBFSlNPTi5jbG9uZShyZXN1bHQpO1xuICAgICAgICBmdW5jdGlvbiBjaGVjayh0YXJnZXQsc291cmNlLGtleSl7XG4gICAgICAgICAgICBsZXQgdmFsID0gc291cmNlW2tleV07XG4gICAgICAgICAgICBpZih0eXBlb2YgdmFsPT0nZnVuY3Rpb24nKXtcbiAgICAgICAgICAgICAgICB0YXJnZXRba2V5XT12YWw7XG4gICAgICAgICAgICB9ZWxzZSBpZihfLmlzRGF0ZSh2YWwpKXtcbiAgICAgICAgICAgICAgICB0YXJnZXRba2V5XSA9IG5ldyBEYXRlKCB2YWwgKTtcbiAgICAgICAgICAgIH1lbHNlIGlmKF8uaXNBcnJheSh2YWwpfHxfLmlzT2JqZWN0KHZhbCkpe1xuICAgICAgICAgICAgICAgIF8uZWFjaChfLmtleXModmFsKSwodmFsS2V5KT0+e1xuICAgICAgICAgICAgICAgICAgICBjaGVjayggdGFyZ2V0W2tleV0gLCB2YWwsIHZhbEtleSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXy5lYWNoKF8ua2V5cyhyZXN1bHQpLChrZXkpPT57XG4gICAgICAgICAgICBjaGVjayhjb252ZXJ0ZWQscmVzdWx0LGtleSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gY29udmVydGVkO1xufVxuXG5mdW5jdGlvbiB3cmFwSW5Qcm94eShpbnN0YW5jZSl7XG4gICAgcmV0dXJuIG5ldyBQcm94eShpbnN0YW5jZSx7XG4gICAgICAgIGdldDogZnVuY3Rpb24odGFyZ2V0LCBwcm9wZXJ0eSkge1xuICAgICAgICAgICAgcmV0dXJuIHRhcmdldFtwcm9wZXJ0eV07XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHRhcmdldCwga2V5LCB2YWx1ZSwgcmVjZWl2ZXIpIHtcblxuICAgICAgICB9LFxuICAgICAgICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBuYW1lKXtcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgbmFtZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG93bktleXModGFyZ2V0KXtcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0YXJnZXQpO1xuICAgICAgICB9LFxuICAgICAgICBkZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUsIHByb3BlcnR5RGVzY3JpcHRvcil7XG5cbiAgICAgICAgfSxcbiAgICAgICAgZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBuYW1lKXtcblxuICAgICAgICB9LFxuICAgICAgICBwcmV2ZW50RXh0ZW5zaW9ucyh0YXJnZXQpe1xuXG4gICAgICAgIH0sXG4gICAgICAgIGhhcyh0YXJnZXQsIG5hbWUpe1xuICAgICAgICAgICAgcmV0dXJuIG5hbWUgaW4gdGFyZ2V0O1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cblxuZXhwb3J0IHtcbiAgICB3cmFwU2NvcGUsZ2V0U2NyaXB0LGZ1bmN0aW9uRnJvbVNjcmlwdCxjb252ZXJ0UmVzdWx0LGdlbmVyYXRlUmFuZG9tSGFzaCx3cmFwSW5Qcm94eVxufVxuXG4iXX0=