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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9WTVJ1bm5lci5qcyJdLCJuYW1lcyI6WyJ3cmFwU2NvcGUiLCJmdW5jdGlvbkZyb21TY3JpcHQiLCJnZXRTY3JpcHQiLCJjb252ZXJ0UmVzdWx0IiwiZ2VuZXJhdGVSYW5kb21IYXNoIiwiTWFsaWJ1bkNhY2hlIiwiXyIsIlZNUnVubmVyQ29udGV4dCIsIkV2ZW50RW1pdHRlciIsIlZNUnVubmVyIiwic2NvcGVDdHgiLCJ3aXRoVGhyb3ciLCJ3aXRoQ29udmVydFJlc3VsdCIsIndpdGhTY29wZUN0eCIsImRlZmF1bHRDdHgiLCJyZXN1bHQiLCJfdGhyb3ciLCJleHByZXNzaW9uIiwic2NvcGUiLCJmIiwidm0iLCJjb250ZXh0IiwiaXNFbXB0eSIsInVuZGVmaW5lZCIsImNvbnRleHRDb3B5IiwiT2JqZWN0IiwiYXNzaWduIiwicHJveHkiLCJQcm94eSIsImdldCIsInRhcmdldCIsInByb3BlcnR5IiwiaGFzT3duUHJvcGVydHkiLCJvcmlnaW5hbCIsInNldCIsImtleSIsInZhbHVlIiwicmVjZWl2ZXIiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJuYW1lIiwib3duS2V5cyIsImdldE93blByb3BlcnR5TmFtZXMiLCJkZWZpbmVQcm9wZXJ0eSIsInByb3BlcnR5RGVzY3JpcHRvciIsImRlbGV0ZVByb3BlcnR5IiwicHJldmVudEV4dGVuc2lvbnMiLCJoYXMiLCJsaXN0ZW5lckNvdW50IiwiZW1pdCIsInNjb3BlT3JpZ2luYWwiLCJhcHBseSIsImRvQ29udmVydFJlc3VsdCIsImdldFNjb3BlIl0sIm1hcHBpbmdzIjoiMnRDQUFBLGdDLElBQVFBLFMsVUFBQUEsUyxLQUFXQyxrQixVQUFBQSxrQixLQUFvQkMsUyxVQUFBQSxTLEtBQVdDLGEsVUFBQUEsYSxLQUFlQyxrQixVQUFBQSxrQjtBQUNqRSw4QyxJQUFPQyxZO0FBQ1Asd0MsSUFBT0MsQztBQUNQLG9ELElBQU9DLGU7QUFDUCxnQyxJQUFPQyxZO0FBQ1A7Ozs7Ozs7QUFPTUMsUTtB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SyxFQUFDQSxLQUFLLENBQUNFLEVBSEk7QUFJaEI2QixrQkFBQUEsYUFBYSxFQUFDL0IsS0FBSyxDQUFDZSxRQUpKLEVBQXBCOztBQU1ILGU7QUFDRSwyQjs7O0FBR0lsQixjQUFBQSxNOztBQUVSLG1CQUFLWixhO0FBQ1csbUJBQUtnRCxlQUFMLENBQXFCcEMsTUFBckIsQyxVQUFmQSxNO0FBQ0csbUJBQUtnQyxhQUFMLENBQW1CLFFBQW5CLElBQTZCLEM7QUFDNUIsbUJBQUtDLElBQUwsQ0FBVSxRQUFWLEVBQW1CakMsTUFBbkIsRUFBMEI7QUFDdEJFLGdCQUFBQSxVQUFVLEVBQVZBLFVBRHNCO0FBRXRCSSxnQkFBQUEsT0FBTyxFQUFQQSxPQUZzQjtBQUd0QkgsZ0JBQUFBLEtBQUssRUFBQ0EsS0FBSyxDQUFDRSxFQUhVO0FBSXRCNkIsZ0JBQUFBLGFBQWEsRUFBQy9CLEtBQUssQ0FBQ2UsUUFKRSxFQUExQixFOzs7O0FBUUosa0JBQUcsS0FBS2MsYUFBTCxDQUFtQixRQUFuQixJQUE2QixDQUFoQyxFQUFrQztBQUM5QixxQkFBS0MsSUFBTCxDQUFVLFFBQVYsRUFBbUJqQyxNQUFuQixFQUEwQjtBQUN0QkUsa0JBQUFBLFVBQVUsRUFBVkEsVUFEc0I7QUFFdEJJLGtCQUFBQSxPQUFPLEVBQVBBLE9BRnNCO0FBR3RCSCxrQkFBQUEsS0FBSyxFQUFDQSxLQUFLLENBQUNFLEVBSFU7QUFJdEI2QixrQkFBQUEsYUFBYSxFQUFDL0IsS0FBSyxDQUFDZSxRQUpFLEVBQTFCOztBQU1ILGU7QUFDTWxCLGNBQUFBLE0sNEhBdkdKLENBQ1AsT0FBTyxLQUFLTCxRQUFMLENBQWMwQyxRQUFkLENBQXVCLElBQXZCLENBQVAsQ0FDSCxDLHVCQXRDa0I1QyxZOzs7OztBQWdKdkJDLFFBQVEsQ0FBQ0ssVUFBVCxHQUFzQixJQUFJUCxlQUFKLEVBQXRCLEM7QUFDZUUsUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7d3JhcFNjb3BlLCBmdW5jdGlvbkZyb21TY3JpcHQsIGdldFNjcmlwdCwgY29udmVydFJlc3VsdCwgZ2VuZXJhdGVSYW5kb21IYXNofSBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IE1hbGlidW5DYWNoZSBmcm9tIFwiLi9NYWxpYnVuQ2FjaGVcIjtcbmltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUnO1xuaW1wb3J0IFZNUnVubmVyQ29udGV4dCBmcm9tIFwiLi9WTVJ1bm5lckNvbnRleHRcIjtcbmltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSAnZXZlbnRzJztcbi8qKlxuICogQHByb3BlcnR5IHtvYmplY3R9IGdsb2JhbFxuICogQHByb3BlcnR5IHtib29sZWFufSB0aHJvd1xuICogQHByb3BlcnR5IHtib29sZWFufSBjb252ZXJ0UmVzdWx0XG4gKiBAcHJvcGVydHkge1VzZXJzTW9kZWx9IHVzZXJcbiAqICovXG5cbmNsYXNzIFZNUnVubmVyIGV4dGVuZHMgRXZlbnRFbWl0dGVye1xuICAgIC8qKkBwYXJhbSB7Vk1SdW5uZXJDb250ZXh0fSBzY29wZUN0eCovXG4gICAgY29uc3RydWN0b3Ioc2NvcGVDdHgpe1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLndpdGhUaHJvdyhmYWxzZSlcbiAgICAgICAgICAgIC53aXRoQ29udmVydFJlc3VsdCh0cnVlKVxuICAgICAgICAgICAgLndpdGhTY29wZUN0eChzY29wZUN0eHx8Vk1SdW5uZXIuZGVmYXVsdEN0eCk7XG4gICAgfVxuXG4gICAgYXN5bmMgZG9Db252ZXJ0UmVzdWx0KHJlc3VsdCl7XG4gICAgICAgIHJldHVybiBjb252ZXJ0UmVzdWx0KHJlc3VsdCk7XG4gICAgfVxuXG4gICAgLyoqQHJldHVybnMge1ZNUnVubmVyfSovXG4gICAgd2l0aFRocm93KF90aHJvdz10cnVlKXtcbiAgICAgICAgdGhpcy50aHJvdz1fdGhyb3c7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKkByZXR1cm5zIHtWTVJ1bm5lcn0qL1xuICAgIHdpdGhDb252ZXJ0UmVzdWx0KGNvbnZlcnRSZXN1bHQ9dHJ1ZSl7XG4gICAgICAgIHRoaXMuY29udmVydFJlc3VsdD1jb252ZXJ0UmVzdWx0O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipAcmV0dXJucyB7dGhpc30qL1xuICAgIHdpdGhTY29wZUN0eChzY29wZUN0eCl7XG4gICAgICAgIHRoaXMuc2NvcGVDdHggPSBzY29wZUN0eDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHJldHVybnMge09iamVjdH0gc2NvcGVcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBzY29wZS52bVxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IHNjb3BlLm9yaWdpbmFsXG4gICAgICovXG4gICAgZ2V0IHNjb3BlKCl7XG4gICAgICAgIHJldHVybiB0aGlzLnNjb3BlQ3R4LmdldFNjb3BlKHRoaXMpO1xuICAgIH1cblxuICAgIHZhbGlkYXRlKGV4cHJlc3Npb24pe1xuICAgICAgICBjb25zdCBzY29wZSA9IHRoaXMuc2NvcGU7XG4gICAgICAgIGxldCBmID0gZnVuY3Rpb25Gcm9tU2NyaXB0KGV4cHJlc3Npb24sc2NvcGUudm0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBhc3luYyBydW4oZXhwcmVzc2lvbixjb250ZXh0KXtcbiAgICAgICAgY29udGV4dCA9IGNvbnRleHQgfHwge307XG4gICAgICAgIGlmKCFleHByZXNzaW9uJiZfLmlzRW1wdHkoZXhwcmVzc2lvbikpXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICBjb25zdCBjb250ZXh0Q29weSA9IE9iamVjdC5hc3NpZ24oe30sY29udGV4dCk7XG4gICAgICAgIGNvbnN0IHNjb3BlID0gdGhpcy5zY29wZTtcbiAgICAgICAgY29uc3QgcHJveHkgPSAgbmV3IFByb3h5KGNvbnRleHQse1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbih0YXJnZXQsIHByb3BlcnR5KSB7XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygncHJveHkgZ2V0OicscHJvcGVydHkpO1xuICAgICAgICAgICAgICAgIGlmKGNvbnRleHRDb3B5Lmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRleHRDb3B5W3Byb3BlcnR5XTtcbiAgICAgICAgICAgICAgICBpZihjb250ZXh0Lmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRleHRbcHJvcGVydHldO1xuICAgICAgICAgICAgICAgIGlmKHNjb3BlLm9yaWdpbmFsLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNjb3BlLm9yaWdpbmFsW3Byb3BlcnR5XTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh0YXJnZXQsIGtleSwgdmFsdWUsIHJlY2VpdmVyKSB7XG4gICAgICAgICAgICAgICAgY29udGV4dENvcHlba2V5XT12YWx1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBuYW1lKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihjb250ZXh0Q29weSwgbmFtZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb3duS2V5cyh0YXJnZXQpe1xuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhjb250ZXh0Q29weSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBuYW1lLCBwcm9wZXJ0eURlc2NyaXB0b3Ipe1xuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29udGV4dENvcHksbmFtZSxwcm9wZXJ0eURlc2NyaXB0b3IpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRlbGV0ZVByb3BlcnR5KHRhcmdldCwgbmFtZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlbGV0ZSBjb250ZXh0Q29weVtuYW1lXTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwcmV2ZW50RXh0ZW5zaW9ucyh0YXJnZXQpe1xuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QucHJldmVudEV4dGVuc2lvbnMoY29udGV4dENvcHkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhhcyh0YXJnZXQsIG5hbWUpe1xuICAgICAgICAgICAgICAgIHJldHVybiBuYW1lIGluIGNvbnRleHRDb3B5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgbGV0IGYgPSBudWxsO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZiA9IGZ1bmN0aW9uRnJvbVNjcmlwdChleHByZXNzaW9uLHNjb3BlLnZtKTtcbiAgICAgICAgfWNhdGNoIChlKSB7XG4gICAgICAgICAgICBpZih0aGlzLmxpc3RlbmVyQ291bnQoJ2Vycm9yJyk+MCl7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdlcnJvcicsZSx7XG4gICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb24sXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQsXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlOnNjb3BlLnZtLFxuICAgICAgICAgICAgICAgICAgICBzY29wZU9yaWdpbmFsOnNjb3BlLm9yaWdpbmFsXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHRoaXMudGhyb3cpe1xuICAgICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgICAgIGlmKCFmKVxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgdHJ5e1xuICAgICAgICAgICAgcmVzdWx0ID0gYXdhaXQgZi5hcHBseShwcm94eSk7XG4gICAgICAgIH1jYXRjaChlKXtcbiAgICAgICAgICAgIGlmKHRoaXMubGlzdGVuZXJDb3VudCgnZXJyb3InKT4wKXtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2Vycm9yJyxlLHtcbiAgICAgICAgICAgICAgICAgICAgZXhwcmVzc2lvbixcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dCxcbiAgICAgICAgICAgICAgICAgICAgc2NvcGU6c2NvcGUudm0sXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlT3JpZ2luYWw6c2NvcGUub3JpZ2luYWxcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYodGhpcy50aHJvdyl7XG4gICAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYodGhpcy5jb252ZXJ0UmVzdWx0KVxuICAgICAgICAgICAgcmVzdWx0ID0gYXdhaXQgdGhpcy5kb0NvbnZlcnRSZXN1bHQocmVzdWx0KTtcbiAgICAgICAgICAgIGlmKHRoaXMubGlzdGVuZXJDb3VudCgncmVzdWx0Jyk+MCl7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdyZXN1bHQnLHJlc3VsdCx7XG4gICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb24sXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQsXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlOnNjb3BlLnZtLFxuICAgICAgICAgICAgICAgICAgICBzY29wZU9yaWdpbmFsOnNjb3BlLm9yaWdpbmFsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYodGhpcy5saXN0ZW5lckNvdW50KCdyZXN1bHQnKT4wKXtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ3Jlc3VsdCcscmVzdWx0LHtcbiAgICAgICAgICAgICAgICAgICAgZXhwcmVzc2lvbixcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dCxcbiAgICAgICAgICAgICAgICAgICAgc2NvcGU6c2NvcGUudm0sXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlT3JpZ2luYWw6c2NvcGUub3JpZ2luYWxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblZNUnVubmVyLmRlZmF1bHRDdHggPSBuZXcgVk1SdW5uZXJDb250ZXh0KCk7XG5leHBvcnQgZGVmYXVsdCBWTVJ1bm5lcjsiXX0=