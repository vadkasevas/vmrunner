"use strict";var _interopRequireDefault3 = require("@babel/runtime/helpers/interopRequireDefault");var _interopRequireDefault2 = _interopRequireDefault3(require("@babel/runtime/helpers/interopRequireDefault"));Object.defineProperty(exports, "__esModule", { value: true });exports.wrapInProxy = exports.generateRandomHash = exports.convertResult = exports.functionFromScript = exports.getScript = exports.wrapScope = undefined;var _regenerator = require("@babel/runtime/regenerator");var _regeneratorRuntime = (0, _interopRequireDefault2["default"])(_regenerator)["default"];var _typeof2 = require("@babel/runtime/helpers/typeof");var _typeof = (0, _interopRequireDefault2["default"])(_typeof2)["default"];var _underscore = require("underscore");var _ = (0, _interopRequireDefault2["default"])(_underscore)["default"];

var _md = require("md5");var md5 = (0, _interopRequireDefault2["default"])(_md)["default"];
var _ejson = require("ejson");var EJSON = (0, _interopRequireDefault2["default"])(_ejson)["default"];
var _vm = require("vm");var vm = (0, _interopRequireDefault2["default"])(_vm)["default"];



var _MalibunCache = require("./MalibunCache");var MalibunCache = (0, _interopRequireDefault2["default"])(_MalibunCache)["default"];var esprima = require('esprima');var escodegen = require('escodegen');
var fbCache = new MalibunCache();
var functionGenerator = new vm.Script("new Function( vm2Options.functionBody );");
var scriptCache = new MalibunCache();

function generateRandomHash() {
  return md5(_.random(100000000) + '_' + _.random(100000000) + '_' + Date.now());
}

var functionFromScript = function functionFromScript(expr, vmCtx) {
  vmCtx.vm2Options = vmCtx.vm2Options || {};
  var vm2OptionsHash = vmCtx.vm2Options.hash;
  if (!vm2OptionsHash) {
    vm2OptionsHash = generateRandomHash();
  }
  var key = md5(expr + ':' + vm2OptionsHash);
  if (!fbCache.has(key)) {
    var tokens = null;
    try {
      tokens = esprima.parseScript(expr, { tolerant: true });
    } catch (e) {
      tokens = esprima.parseScript("(function anonymous(){ ".concat(expr, " }).apply( this );"), { tolerant: true });
    }
    var lastIndex = 0;
    _.each(tokens.body, function (statement, index) {
      if (statement.type != 'EmptyStatement') {
        lastIndex = index;
      }
    });
    var lastExpression = tokens.body[lastIndex];
    if (lastExpression) {
      if (['IfStatement', 'ReturnStatement'].indexOf(lastExpression.type) == -1) {
        tokens.body[tokens.body.length - 1] = {
          type: 'ReturnStatement',
          argument: lastExpression };

      }
      var functionBody = escodegen.generate(tokens);
      //console.log(functionBody);


      vmCtx.vm2Options.functionBody = functionBody;
      var f = functionGenerator.runInContext(vmCtx);

      //var f = new Function(functionBody);
      fbCache.set(key, f, 5 * 60 * 1000);
    }
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
//# sourceMappingURL=utils.js.map