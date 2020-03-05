"use strict";var _interopRequireDefault3 = require("@babel/runtime/helpers/interopRequireDefault");var _interopRequireDefault2 = _interopRequireDefault3(require("@babel/runtime/helpers/interopRequireDefault"));Object.defineProperty(exports, "__esModule", { value: true });var _regenerator = require("@babel/runtime/regenerator");var _regeneratorRuntime = (0, _interopRequireDefault2["default"])(_regenerator)["default"];var _classCallCheck2 = require("@babel/runtime/helpers/classCallCheck");var _classCallCheck = (0, _interopRequireDefault2["default"])(_classCallCheck2)["default"];var _createClass2 = require("@babel/runtime/helpers/createClass");var _createClass = (0, _interopRequireDefault2["default"])(_createClass2)["default"];var _possibleConstructorReturn2 = require("@babel/runtime/helpers/possibleConstructorReturn");var _possibleConstructorReturn = (0, _interopRequireDefault2["default"])(_possibleConstructorReturn2)["default"];var _getPrototypeOf2 = require("@babel/runtime/helpers/getPrototypeOf");var _getPrototypeOf = (0, _interopRequireDefault2["default"])(_getPrototypeOf2)["default"];var _inherits2 = require("@babel/runtime/helpers/inherits");var _inherits = (0, _interopRequireDefault2["default"])(_inherits2)["default"];var _utils = require("./utils");var wrapScope = _utils.wrapScope;var functionFromScript = _utils.functionFromScript;var getScript = _utils.getScript;var convertResult = _utils.convertResult;var generateRandomHash = _utils.generateRandomHash;
var _MalibunCache = require("./MalibunCache");var MalibunCache = (0, _interopRequireDefault2["default"])(_MalibunCache)["default"];
var _underscore = require("underscore");var _ = (0, _interopRequireDefault2["default"])(_underscore)["default"];
var _VMRunnerContext = require("./VMRunnerContext");var VMRunnerContext = (0, _interopRequireDefault2["default"])(_VMRunnerContext)["default"];
var _events = require("events");var EventEmitter = (0, _interopRequireDefault2["default"])(_events)["default"];
/**
                                                                                                                 * @property {object} global
                                                                                                                 * @property {boolean} throw
                                                                                                                 * @property {boolean} convertResult
                                                                                                                 * @property {UsersModel} user
                                                                                                                 * */var

VMRunner = /*#__PURE__*/function (_EventEmitter) {_inherits(VMRunner, _EventEmitter);
  /**@param {VMRunnerContext} scopeCtx*/
  function VMRunner(scopeCtx) {var _this;_classCallCheck(this, VMRunner);
    _this = _possibleConstructorReturn(this, _getPrototypeOf(VMRunner).call(this));
    _this.withThrow(false).
    withConvertResult(true).
    withScopeCtx(scopeCtx || VMRunner.defaultCtx);return _this;
  }_createClass(VMRunner, [{ key: "doConvertResult", value: function doConvertResult(

    result) {return _regeneratorRuntime.async(function doConvertResult$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:return _context.abrupt("return",
              convertResult(result));case 1:case "end":return _context.stop();}}});}


    /**@returns {VMRunner}*/ }, { key: "withThrow", value: function withThrow()
    {var _throw = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      this["throw"] = _throw;
      return this;
    }

    /**@returns {VMRunner}*/ }, { key: "withConvertResult", value: function withConvertResult()
    {var convertResult = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      this.convertResult = convertResult;
      return this;
    }

    /**@returns {this}*/ }, { key: "withScopeCtx", value: function withScopeCtx(
    scopeCtx) {
      this.scopeCtx = scopeCtx;
      return this;
    }

    /**
       * @returns {Object} scope
       * @returns {Object} scope.vm
       * @returns {Object} scope.original
       */ }, { key: "validate", value: function validate(




    expression) {
      var scope = this.scope;
      var f = functionFromScript(expression, scope.vm);
      return true;
    } }, { key: "run", value: function run(

    expression, context) {var contextCopy, scope, proxy, result, f;return _regeneratorRuntime.async(function run$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
              context = context || {};if (!(
              !expression && _.isEmpty(expression))) {_context2.next = 3;break;}return _context2.abrupt("return",
              undefined);case 3:
              contextCopy = Object.assign({}, context);
              scope = this.scope;
              proxy = new Proxy(context, {
                get: function get(target, property) {
                  //console.log('proxy get:',property);
                  if (contextCopy.hasOwnProperty(property))
                  return contextCopy[property];
                  if (context.hasOwnProperty(property))
                  return context[property];
                  if (scope.original.hasOwnProperty(property))
                  return scope.original[property];
                },
                set: function set(target, key, value, receiver) {
                  contextCopy[key] = value;
                },
                getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, name) {
                  return Object.getOwnPropertyDescriptor(contextCopy, name);
                },
                ownKeys: function ownKeys(target) {
                  return Object.getOwnPropertyNames(contextCopy);
                },
                defineProperty: function defineProperty(target, name, propertyDescriptor) {
                  return Object.defineProperty(contextCopy, name, propertyDescriptor);
                },
                deleteProperty: function deleteProperty(target, name) {
                  return delete contextCopy[name];
                },
                preventExtensions: function preventExtensions(target) {
                  return Object.preventExtensions(contextCopy);
                },
                has: function has(target, name) {
                  return name in contextCopy;
                } });

              result = undefined;
              f = null;_context2.prev = 8;

              f = functionFromScript(expression, scope.vm);_context2.next = 18;break;case 12:_context2.prev = 12;_context2.t0 = _context2["catch"](8);

              if (this.listenerCount('error') > 0) {
                this.emit('error', _context2.t0, {
                  expression: expression,
                  context: context,
                  scope: scope.vm,
                  scopeOriginal: scope.original });

              }if (!
              this["throw"]) {_context2.next = 17;break;}throw _context2.t0;case 17:return _context2.abrupt("return",


              result);case 18:if (

              f) {_context2.next = 20;break;}return _context2.abrupt("return",
              undefined);case 20:_context2.prev = 20;_context2.next = 23;return _regeneratorRuntime.awrap(

              f.apply(proxy));case 23:result = _context2.sent;_context2.next = 32;break;case 26:_context2.prev = 26;_context2.t1 = _context2["catch"](20);

              if (this.listenerCount('error') > 0) {
                this.emit('error', _context2.t1, {
                  expression: expression,
                  context: context,
                  scope: scope.vm,
                  scopeOriginal: scope.original });

              }if (!
              this["throw"]) {_context2.next = 31;break;}throw _context2.t1;case 31:return _context2.abrupt("return",


              result);case 32:if (!

              this.convertResult) {_context2.next = 36;break;}_context2.next = 35;return _regeneratorRuntime.awrap(
              this.doConvertResult(result));case 35:result = _context2.sent;case 36:if (!(
              this.listenerCount('result') > 0)) {_context2.next = 40;break;}
              this.emit('result', result, {
                expression: expression,
                context: context,
                scope: scope.vm,
                scopeOriginal: scope.original });_context2.next = 42;break;case 40:



              if (this.listenerCount('result') > 0) {
                this.emit('result', result, {
                  expression: expression,
                  context: context,
                  scope: scope.vm,
                  scopeOriginal: scope.original });

              }return _context2.abrupt("return",
              result);case 42:case "end":return _context2.stop();}}}, null, this, [[8, 12], [20, 26]]);} }, { key: "scope", get: function get() {return this.scopeCtx.getScope(this);} }]);return VMRunner;}(EventEmitter);




VMRunner.defaultCtx = new VMRunnerContext();exports["default"] =
VMRunner;
//# sourceMappingURL=VMRunner.js.map