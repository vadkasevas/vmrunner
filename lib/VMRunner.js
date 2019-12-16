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
       */ }, { key: "run", value: function run(




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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9WTVJ1bm5lci5qcyJdLCJuYW1lcyI6WyJ3cmFwU2NvcGUiLCJmdW5jdGlvbkZyb21TY3JpcHQiLCJnZXRTY3JpcHQiLCJjb252ZXJ0UmVzdWx0IiwiZ2VuZXJhdGVSYW5kb21IYXNoIiwiTWFsaWJ1bkNhY2hlIiwiXyIsIlZNUnVubmVyQ29udGV4dCIsIkV2ZW50RW1pdHRlciIsIlZNUnVubmVyIiwic2NvcGVDdHgiLCJ3aXRoVGhyb3ciLCJ3aXRoQ29udmVydFJlc3VsdCIsIndpdGhTY29wZUN0eCIsImRlZmF1bHRDdHgiLCJyZXN1bHQiLCJfdGhyb3ciLCJleHByZXNzaW9uIiwiY29udGV4dCIsImlzRW1wdHkiLCJ1bmRlZmluZWQiLCJjb250ZXh0Q29weSIsIk9iamVjdCIsImFzc2lnbiIsInNjb3BlIiwicHJveHkiLCJQcm94eSIsImdldCIsInRhcmdldCIsInByb3BlcnR5IiwiaGFzT3duUHJvcGVydHkiLCJvcmlnaW5hbCIsInNldCIsImtleSIsInZhbHVlIiwicmVjZWl2ZXIiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJuYW1lIiwib3duS2V5cyIsImdldE93blByb3BlcnR5TmFtZXMiLCJkZWZpbmVQcm9wZXJ0eSIsInByb3BlcnR5RGVzY3JpcHRvciIsImRlbGV0ZVByb3BlcnR5IiwicHJldmVudEV4dGVuc2lvbnMiLCJoYXMiLCJmIiwidm0iLCJsaXN0ZW5lckNvdW50IiwiZW1pdCIsInNjb3BlT3JpZ2luYWwiLCJhcHBseSIsImRvQ29udmVydFJlc3VsdCIsImdldFNjb3BlIl0sIm1hcHBpbmdzIjoiMnRDQUFBLGdDLElBQVFBLFMsVUFBQUEsUyxLQUFXQyxrQixVQUFBQSxrQixLQUFvQkMsUyxVQUFBQSxTLEtBQVdDLGEsVUFBQUEsYSxLQUFlQyxrQixVQUFBQSxrQjtBQUNqRSw4QyxJQUFPQyxZO0FBQ1Asd0MsSUFBT0MsQztBQUNQLG9ELElBQU9DLGU7QUFDUCxnQyxJQUFPQyxZO0FBQ1A7Ozs7Ozs7QUFPTUMsUTtBQUNGO0FBQ0Esb0JBQVlDLFFBQVosRUFBcUI7QUFDakI7QUFDQSxVQUFLQyxTQUFMLENBQWUsS0FBZjtBQUNLQyxJQUFBQSxpQkFETCxDQUN1QixJQUR2QjtBQUVLQyxJQUFBQSxZQUZMLENBRWtCSCxRQUFRLElBQUVELFFBQVEsQ0FBQ0ssVUFGckMsRUFGaUI7QUFLcEIsRzs7QUFFcUJDLElBQUFBLE07QUFDWFosY0FBQUEsYUFBYSxDQUFDWSxNQUFELEM7OztBQUd4Qiw0QjtBQUNzQixTQUFaQyxNQUFZLHVFQUFMLElBQUs7QUFDbEIsc0JBQVdBLE1BQVg7QUFDQSxhQUFPLElBQVA7QUFDSDs7QUFFRCw0QjtBQUNxQyxTQUFuQmIsYUFBbUIsdUVBQUwsSUFBSztBQUNqQyxXQUFLQSxhQUFMLEdBQW1CQSxhQUFuQjtBQUNBLGFBQU8sSUFBUDtBQUNIOztBQUVELHdCO0FBQ2FPLElBQUFBLFEsRUFBUztBQUNsQixXQUFLQSxRQUFMLEdBQWdCQSxRQUFoQjtBQUNBLGFBQU8sSUFBUDtBQUNIOztBQUVEOzs7Ozs7Ozs7QUFTVU8sSUFBQUEsVSxFQUFXQyxPO0FBQ2pCQSxjQUFBQSxPQUFPLEdBQUdBLE9BQU8sSUFBSSxFQUFyQixDO0FBQ0csZUFBQ0QsVUFBRCxJQUFhWCxDQUFDLENBQUNhLE9BQUYsQ0FBVUYsVUFBVixDO0FBQ0xHLGNBQUFBLFM7QUFDTEMsY0FBQUEsVyxHQUFjQyxNQUFNLENBQUNDLE1BQVAsQ0FBYyxFQUFkLEVBQWlCTCxPQUFqQixDO0FBQ2RNLGNBQUFBLEssR0FBUSxLQUFLQSxLO0FBQ2JDLGNBQUFBLEssR0FBUyxJQUFJQyxLQUFKLENBQVVSLE9BQVYsRUFBa0I7QUFDN0JTLGdCQUFBQSxHQUFHLEVBQUUsYUFBU0MsTUFBVCxFQUFpQkMsUUFBakIsRUFBMkI7QUFDNUI7QUFDQSxzQkFBR1IsV0FBVyxDQUFDUyxjQUFaLENBQTJCRCxRQUEzQixDQUFIO0FBQ0kseUJBQU9SLFdBQVcsQ0FBQ1EsUUFBRCxDQUFsQjtBQUNKLHNCQUFHWCxPQUFPLENBQUNZLGNBQVIsQ0FBdUJELFFBQXZCLENBQUg7QUFDSSx5QkFBT1gsT0FBTyxDQUFDVyxRQUFELENBQWQ7QUFDSixzQkFBR0wsS0FBSyxDQUFDTyxRQUFOLENBQWVELGNBQWYsQ0FBOEJELFFBQTlCLENBQUg7QUFDSSx5QkFBT0wsS0FBSyxDQUFDTyxRQUFOLENBQWVGLFFBQWYsQ0FBUDtBQUNQLGlCQVQ0QjtBQVU3QkcsZ0JBQUFBLEdBQUcsRUFBRSxhQUFVSixNQUFWLEVBQWtCSyxHQUFsQixFQUF1QkMsS0FBdkIsRUFBOEJDLFFBQTlCLEVBQXdDO0FBQ3pDZCxrQkFBQUEsV0FBVyxDQUFDWSxHQUFELENBQVgsR0FBaUJDLEtBQWpCO0FBQ0gsaUJBWjRCO0FBYTdCRSxnQkFBQUEsd0JBYjZCLG9DQWFKUixNQWJJLEVBYUlTLElBYkosRUFhUztBQUNsQyx5QkFBT2YsTUFBTSxDQUFDYyx3QkFBUCxDQUFnQ2YsV0FBaEMsRUFBNkNnQixJQUE3QyxDQUFQO0FBQ0gsaUJBZjRCO0FBZ0I3QkMsZ0JBQUFBLE9BaEI2QixtQkFnQnJCVixNQWhCcUIsRUFnQmQ7QUFDWCx5QkFBT04sTUFBTSxDQUFDaUIsbUJBQVAsQ0FBMkJsQixXQUEzQixDQUFQO0FBQ0gsaUJBbEI0QjtBQW1CN0JtQixnQkFBQUEsY0FuQjZCLDBCQW1CZFosTUFuQmMsRUFtQk5TLElBbkJNLEVBbUJBSSxrQkFuQkEsRUFtQm1CO0FBQzVDLHlCQUFPbkIsTUFBTSxDQUFDa0IsY0FBUCxDQUFzQm5CLFdBQXRCLEVBQWtDZ0IsSUFBbEMsRUFBdUNJLGtCQUF2QyxDQUFQO0FBQ0gsaUJBckI0QjtBQXNCN0JDLGdCQUFBQSxjQXRCNkIsMEJBc0JkZCxNQXRCYyxFQXNCTlMsSUF0Qk0sRUFzQkQ7QUFDeEIseUJBQU8sT0FBT2hCLFdBQVcsQ0FBQ2dCLElBQUQsQ0FBekI7QUFDSCxpQkF4QjRCO0FBeUI3Qk0sZ0JBQUFBLGlCQXpCNkIsNkJBeUJYZixNQXpCVyxFQXlCSjtBQUNyQix5QkFBT04sTUFBTSxDQUFDcUIsaUJBQVAsQ0FBeUJ0QixXQUF6QixDQUFQO0FBQ0gsaUJBM0I0QjtBQTRCN0J1QixnQkFBQUEsR0E1QjZCLGVBNEJ6QmhCLE1BNUJ5QixFQTRCakJTLElBNUJpQixFQTRCWjtBQUNiLHlCQUFPQSxJQUFJLElBQUloQixXQUFmO0FBQ0gsaUJBOUI0QixFQUFsQixDOztBQWdDWE4sY0FBQUEsTSxHQUFTSyxTO0FBQ1R5QixjQUFBQSxDLEdBQUksSTs7QUFFSkEsY0FBQUEsQ0FBQyxHQUFHNUMsa0JBQWtCLENBQUNnQixVQUFELEVBQVlPLEtBQUssQ0FBQ3NCLEVBQWxCLENBQXRCLEM7O0FBRUEsa0JBQUcsS0FBS0MsYUFBTCxDQUFtQixPQUFuQixJQUE0QixDQUEvQixFQUFpQztBQUM3QixxQkFBS0MsSUFBTCxDQUFVLE9BQVYsZ0JBQW9CO0FBQ2hCL0Isa0JBQUFBLFVBQVUsRUFBVkEsVUFEZ0I7QUFFaEJDLGtCQUFBQSxPQUFPLEVBQVBBLE9BRmdCO0FBR2hCTSxrQkFBQUEsS0FBSyxFQUFDQSxLQUFLLENBQUNzQixFQUhJO0FBSWhCRyxrQkFBQUEsYUFBYSxFQUFDekIsS0FBSyxDQUFDTyxRQUpKLEVBQXBCOztBQU1ILGU7QUFDRSwyQjs7O0FBR0loQixjQUFBQSxNOztBQUVQOEIsY0FBQUEsQztBQUNPekIsY0FBQUEsUzs7QUFFUXlCLGNBQUFBLENBQUMsQ0FBQ0ssS0FBRixDQUFRekIsS0FBUixDLFVBQWZWLE07O0FBRUEsa0JBQUcsS0FBS2dDLGFBQUwsQ0FBbUIsT0FBbkIsSUFBNEIsQ0FBL0IsRUFBaUM7QUFDN0IscUJBQUtDLElBQUwsQ0FBVSxPQUFWLGdCQUFvQjtBQUNoQi9CLGtCQUFBQSxVQUFVLEVBQVZBLFVBRGdCO0FBRWhCQyxrQkFBQUEsT0FBTyxFQUFQQSxPQUZnQjtBQUdoQk0sa0JBQUFBLEtBQUssRUFBQ0EsS0FBSyxDQUFDc0IsRUFISTtBQUloQkcsa0JBQUFBLGFBQWEsRUFBQ3pCLEtBQUssQ0FBQ08sUUFKSixFQUFwQjs7QUFNSCxlO0FBQ0UsMkI7OztBQUdJaEIsY0FBQUEsTTs7QUFFUixtQkFBS1osYTtBQUNXLG1CQUFLZ0QsZUFBTCxDQUFxQnBDLE1BQXJCLEMsVUFBZkEsTTtBQUNHLG1CQUFLZ0MsYUFBTCxDQUFtQixRQUFuQixJQUE2QixDO0FBQzVCLG1CQUFLQyxJQUFMLENBQVUsUUFBVixFQUFtQmpDLE1BQW5CLEVBQTBCO0FBQ3RCRSxnQkFBQUEsVUFBVSxFQUFWQSxVQURzQjtBQUV0QkMsZ0JBQUFBLE9BQU8sRUFBUEEsT0FGc0I7QUFHdEJNLGdCQUFBQSxLQUFLLEVBQUNBLEtBQUssQ0FBQ3NCLEVBSFU7QUFJdEJHLGdCQUFBQSxhQUFhLEVBQUN6QixLQUFLLENBQUNPLFFBSkUsRUFBMUIsRTs7OztBQVFKLGtCQUFHLEtBQUtnQixhQUFMLENBQW1CLFFBQW5CLElBQTZCLENBQWhDLEVBQWtDO0FBQzlCLHFCQUFLQyxJQUFMLENBQVUsUUFBVixFQUFtQmpDLE1BQW5CLEVBQTBCO0FBQ3RCRSxrQkFBQUEsVUFBVSxFQUFWQSxVQURzQjtBQUV0QkMsa0JBQUFBLE9BQU8sRUFBUEEsT0FGc0I7QUFHdEJNLGtCQUFBQSxLQUFLLEVBQUNBLEtBQUssQ0FBQ3NCLEVBSFU7QUFJdEJHLGtCQUFBQSxhQUFhLEVBQUN6QixLQUFLLENBQUNPLFFBSkUsRUFBMUI7O0FBTUgsZTtBQUNNaEIsY0FBQUEsTSw0SEFqR0osQ0FDUCxPQUFPLEtBQUtMLFFBQUwsQ0FBYzBDLFFBQWQsQ0FBdUIsSUFBdkIsQ0FBUCxDQUNILEMsdUJBdENrQjVDLFk7Ozs7O0FBMEl2QkMsUUFBUSxDQUFDSyxVQUFULEdBQXNCLElBQUlQLGVBQUosRUFBdEIsQztBQUNlRSxRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHt3cmFwU2NvcGUsIGZ1bmN0aW9uRnJvbVNjcmlwdCwgZ2V0U2NyaXB0LCBjb252ZXJ0UmVzdWx0LCBnZW5lcmF0ZVJhbmRvbUhhc2h9IGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQgTWFsaWJ1bkNhY2hlIGZyb20gXCIuL01hbGlidW5DYWNoZVwiO1xuaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZSc7XG5pbXBvcnQgVk1SdW5uZXJDb250ZXh0IGZyb20gXCIuL1ZNUnVubmVyQ29udGV4dFwiO1xuaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICdldmVudHMnO1xuLyoqXG4gKiBAcHJvcGVydHkge29iamVjdH0gZ2xvYmFsXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IHRocm93XG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IGNvbnZlcnRSZXN1bHRcbiAqIEBwcm9wZXJ0eSB7VXNlcnNNb2RlbH0gdXNlclxuICogKi9cblxuY2xhc3MgVk1SdW5uZXIgZXh0ZW5kcyBFdmVudEVtaXR0ZXJ7XG4gICAgLyoqQHBhcmFtIHtWTVJ1bm5lckNvbnRleHR9IHNjb3BlQ3R4Ki9cbiAgICBjb25zdHJ1Y3RvcihzY29wZUN0eCl7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMud2l0aFRocm93KGZhbHNlKVxuICAgICAgICAgICAgLndpdGhDb252ZXJ0UmVzdWx0KHRydWUpXG4gICAgICAgICAgICAud2l0aFNjb3BlQ3R4KHNjb3BlQ3R4fHxWTVJ1bm5lci5kZWZhdWx0Q3R4KTtcbiAgICB9XG5cbiAgICBhc3luYyBkb0NvbnZlcnRSZXN1bHQocmVzdWx0KXtcbiAgICAgICAgcmV0dXJuIGNvbnZlcnRSZXN1bHQocmVzdWx0KTtcbiAgICB9XG5cbiAgICAvKipAcmV0dXJucyB7Vk1SdW5uZXJ9Ki9cbiAgICB3aXRoVGhyb3coX3Rocm93PXRydWUpe1xuICAgICAgICB0aGlzLnRocm93PV90aHJvdztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqQHJldHVybnMge1ZNUnVubmVyfSovXG4gICAgd2l0aENvbnZlcnRSZXN1bHQoY29udmVydFJlc3VsdD10cnVlKXtcbiAgICAgICAgdGhpcy5jb252ZXJ0UmVzdWx0PWNvbnZlcnRSZXN1bHQ7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKkByZXR1cm5zIHt0aGlzfSovXG4gICAgd2l0aFNjb3BlQ3R4KHNjb3BlQ3R4KXtcbiAgICAgICAgdGhpcy5zY29wZUN0eCA9IHNjb3BlQ3R4O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBzY29wZVxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IHNjb3BlLnZtXG4gICAgICogQHJldHVybnMge09iamVjdH0gc2NvcGUub3JpZ2luYWxcbiAgICAgKi9cbiAgICBnZXQgc2NvcGUoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2NvcGVDdHguZ2V0U2NvcGUodGhpcyk7XG4gICAgfVxuXG4gICAgYXN5bmMgcnVuKGV4cHJlc3Npb24sY29udGV4dCl7XG4gICAgICAgIGNvbnRleHQgPSBjb250ZXh0IHx8IHt9O1xuICAgICAgICBpZighZXhwcmVzc2lvbiYmXy5pc0VtcHR5KGV4cHJlc3Npb24pKVxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgY29uc3QgY29udGV4dENvcHkgPSBPYmplY3QuYXNzaWduKHt9LGNvbnRleHQpO1xuICAgICAgICBjb25zdCBzY29wZSA9IHRoaXMuc2NvcGU7XG4gICAgICAgIGNvbnN0IHByb3h5ID0gIG5ldyBQcm94eShjb250ZXh0LHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24odGFyZ2V0LCBwcm9wZXJ0eSkge1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ3Byb3h5IGdldDonLHByb3BlcnR5KTtcbiAgICAgICAgICAgICAgICBpZihjb250ZXh0Q29weS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjb250ZXh0Q29weVtwcm9wZXJ0eV07XG4gICAgICAgICAgICAgICAgaWYoY29udGV4dC5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjb250ZXh0W3Byb3BlcnR5XTtcbiAgICAgICAgICAgICAgICBpZihzY29wZS5vcmlnaW5hbC5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzY29wZS5vcmlnaW5hbFtwcm9wZXJ0eV07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodGFyZ2V0LCBrZXksIHZhbHVlLCByZWNlaXZlcikge1xuICAgICAgICAgICAgICAgIGNvbnRleHRDb3B5W2tleV09dmFsdWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgbmFtZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoY29udGV4dENvcHksIG5hbWUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG93bktleXModGFyZ2V0KXtcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoY29udGV4dENvcHkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRlZmluZVByb3BlcnR5KHRhcmdldCwgbmFtZSwgcHJvcGVydHlEZXNjcmlwdG9yKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvbnRleHRDb3B5LG5hbWUscHJvcGVydHlEZXNjcmlwdG9yKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpe1xuICAgICAgICAgICAgICAgIHJldHVybiBkZWxldGUgY29udGV4dENvcHlbbmFtZV07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcHJldmVudEV4dGVuc2lvbnModGFyZ2V0KXtcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zKGNvbnRleHRDb3B5KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBoYXModGFyZ2V0LCBuYW1lKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmFtZSBpbiBjb250ZXh0Q29weTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGxldCByZXN1bHQgPSB1bmRlZmluZWQ7XG4gICAgICAgIGxldCBmID0gbnVsbDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGYgPSBmdW5jdGlvbkZyb21TY3JpcHQoZXhwcmVzc2lvbixzY29wZS52bSk7XG4gICAgICAgIH1jYXRjaCAoZSkge1xuICAgICAgICAgICAgaWYodGhpcy5saXN0ZW5lckNvdW50KCdlcnJvcicpPjApe1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnZXJyb3InLGUse1xuICAgICAgICAgICAgICAgICAgICBleHByZXNzaW9uLFxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LFxuICAgICAgICAgICAgICAgICAgICBzY29wZTpzY29wZS52bSxcbiAgICAgICAgICAgICAgICAgICAgc2NvcGVPcmlnaW5hbDpzY29wZS5vcmlnaW5hbFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZih0aGlzLnRocm93KXtcbiAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICBpZighZilcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIHRyeXtcbiAgICAgICAgICAgIHJlc3VsdCA9IGF3YWl0IGYuYXBwbHkocHJveHkpO1xuICAgICAgICB9Y2F0Y2goZSl7XG4gICAgICAgICAgICBpZih0aGlzLmxpc3RlbmVyQ291bnQoJ2Vycm9yJyk+MCl7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdlcnJvcicsZSx7XG4gICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb24sXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQsXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlOnNjb3BlLnZtLFxuICAgICAgICAgICAgICAgICAgICBzY29wZU9yaWdpbmFsOnNjb3BlLm9yaWdpbmFsXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHRoaXMudGhyb3cpe1xuICAgICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgICAgIGlmKHRoaXMuY29udmVydFJlc3VsdClcbiAgICAgICAgICAgIHJlc3VsdCA9IGF3YWl0IHRoaXMuZG9Db252ZXJ0UmVzdWx0KHJlc3VsdCk7XG4gICAgICAgICAgICBpZih0aGlzLmxpc3RlbmVyQ291bnQoJ3Jlc3VsdCcpPjApe1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgncmVzdWx0JyxyZXN1bHQse1xuICAgICAgICAgICAgICAgICAgICBleHByZXNzaW9uLFxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LFxuICAgICAgICAgICAgICAgICAgICBzY29wZTpzY29wZS52bSxcbiAgICAgICAgICAgICAgICAgICAgc2NvcGVPcmlnaW5hbDpzY29wZS5vcmlnaW5hbFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmKHRoaXMubGlzdGVuZXJDb3VudCgncmVzdWx0Jyk+MCl7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdyZXN1bHQnLHJlc3VsdCx7XG4gICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb24sXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQsXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlOnNjb3BlLnZtLFxuICAgICAgICAgICAgICAgICAgICBzY29wZU9yaWdpbmFsOnNjb3BlLm9yaWdpbmFsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgfVxufVxuXG5WTVJ1bm5lci5kZWZhdWx0Q3R4ID0gbmV3IFZNUnVubmVyQ29udGV4dCgpO1xuZXhwb3J0IGRlZmF1bHQgVk1SdW5uZXI7Il19