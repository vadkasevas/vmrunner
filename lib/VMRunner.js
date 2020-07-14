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

    expression, context) {var options,scope,result,fData,_args2 = arguments;return _regeneratorRuntime.async(function run$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:options = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : {};
              context = context || {};if (!(
              !expression && _.isEmpty(expression))) {_context2.next = 4;break;}return _context2.abrupt("return",
              undefined);case 4:
              scope = this.scope;
              result = undefined;
              fData = null;_context2.prev = 7;

              fData = functionFromScript(expression, scope.vm, options);_context2.next = 17;break;case 11:_context2.prev = 11;_context2.t0 = _context2["catch"](7);

              if (this.listenerCount('error') > 0) {
                this.emit('error', _context2.t0, {
                  expression: expression,
                  context: context,
                  scope: scope.vm,
                  scopeOriginal: scope.original });

              }if (!
              this["throw"]) {_context2.next = 16;break;}throw _context2.t0;case 16:return _context2.abrupt("return",


              result);case 17:if (!(

              !fData || !fData.f)) {_context2.next = 19;break;}return _context2.abrupt("return",
              undefined);case 19:_context2.prev = 19;_context2.next = 22;return _regeneratorRuntime.awrap(

              fData.f.apply(context, [fData.vm2Options]));case 22:result = _context2.sent;_context2.next = 31;break;case 25:_context2.prev = 25;_context2.t1 = _context2["catch"](19);

              if (this.listenerCount('error') > 0) {
                this.emit('error', _context2.t1, {
                  expression: expression,
                  context: context,
                  scope: scope.vm,
                  scopeOriginal: scope.original });

              }if (!
              this["throw"]) {_context2.next = 30;break;}throw _context2.t1;case 30:return _context2.abrupt("return",


              result);case 31:if (!

              this.convertResult) {_context2.next = 35;break;}_context2.next = 34;return _regeneratorRuntime.awrap(
              this.doConvertResult(result));case 34:result = _context2.sent;case 35:if (!(
              this.listenerCount('result') > 0)) {_context2.next = 39;break;}
              this.emit('result', result, {
                expression: expression,
                context: context,
                scope: scope.vm,
                scopeOriginal: scope.original });_context2.next = 41;break;case 39:



              if (this.listenerCount('result') > 0) {
                this.emit('result', result, {
                  expression: expression,
                  context: context,
                  scope: scope.vm,
                  scopeOriginal: scope.original });

              }return _context2.abrupt("return",
              result);case 41:case "end":return _context2.stop();}}}, null, this, [[7, 11], [19, 25]]);} }, { key: "scope", get: function get() {return this.scopeCtx.getScope(this);} }]);return VMRunner;}(EventEmitter);




VMRunner.defaultCtx = new VMRunnerContext();exports["default"] =
VMRunner;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9WTVJ1bm5lci5qcyJdLCJuYW1lcyI6WyJ3cmFwU2NvcGUiLCJmdW5jdGlvbkZyb21TY3JpcHQiLCJnZXRTY3JpcHQiLCJjb252ZXJ0UmVzdWx0IiwiZ2VuZXJhdGVSYW5kb21IYXNoIiwiTWFsaWJ1bkNhY2hlIiwiXyIsIlZNUnVubmVyQ29udGV4dCIsIkV2ZW50RW1pdHRlciIsIlZNUnVubmVyIiwic2NvcGVDdHgiLCJ3aXRoVGhyb3ciLCJ3aXRoQ29udmVydFJlc3VsdCIsIndpdGhTY29wZUN0eCIsImRlZmF1bHRDdHgiLCJyZXN1bHQiLCJfdGhyb3ciLCJleHByZXNzaW9uIiwic2NvcGUiLCJmIiwidm0iLCJjb250ZXh0Iiwib3B0aW9ucyIsImlzRW1wdHkiLCJ1bmRlZmluZWQiLCJmRGF0YSIsImxpc3RlbmVyQ291bnQiLCJlbWl0Iiwic2NvcGVPcmlnaW5hbCIsIm9yaWdpbmFsIiwiYXBwbHkiLCJ2bTJPcHRpb25zIiwiZG9Db252ZXJ0UmVzdWx0IiwiZ2V0U2NvcGUiXSwibWFwcGluZ3MiOiIydENBQUEsZ0MsSUFBUUEsUyxVQUFBQSxTLEtBQVdDLGtCLFVBQUFBLGtCLEtBQW9CQyxTLFVBQUFBLFMsS0FBV0MsYSxVQUFBQSxhLEtBQWVDLGtCLFVBQUFBLGtCO0FBQ2pFLDhDLElBQU9DLFk7QUFDUCx3QyxJQUFPQyxDO0FBQ1Asb0QsSUFBT0MsZTtBQUNQLGdDLElBQU9DLFk7QUFDUDs7Ozs7OztBQU9NQyxRO0FBQ0Y7QUFDQSxvQkFBWUMsUUFBWixFQUFxQjtBQUNqQjtBQUNBLFVBQUtDLFNBQUwsQ0FBZSxLQUFmO0FBQ0tDLElBQUFBLGlCQURMLENBQ3VCLElBRHZCO0FBRUtDLElBQUFBLFlBRkwsQ0FFa0JILFFBQVEsSUFBRUQsUUFBUSxDQUFDSyxVQUZyQyxFQUZpQjtBQUtwQixHOztBQUVxQkMsSUFBQUEsTTtBQUNYWixjQUFBQSxhQUFhLENBQUNZLE1BQUQsQzs7O0FBR3hCLDRCO0FBQ3NCLFNBQVpDLE1BQVksdUVBQUwsSUFB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QUFBLE9BQU8sRUFBUEEsT0FGc0I7QUFHdEJILGtCQUFBQSxLQUFLLEVBQUNBLEtBQUssQ0FBQ0UsRUFIVTtBQUl0QlEsa0JBQUFBLGFBQWEsRUFBQ1YsS0FBSyxDQUFDVyxRQUpFLEVBQTFCOztBQU1ILGU7QUFDTWQsY0FBQUEsTSw0SEF0RUosQ0FDUCxPQUFPLEtBQUtMLFFBQUwsQ0FBY3VCLFFBQWQsQ0FBdUIsSUFBdkIsQ0FBUCxDQUNILEMsdUJBdENrQnpCLFk7Ozs7O0FBK0d2QkMsUUFBUSxDQUFDSyxVQUFULEdBQXNCLElBQUlQLGVBQUosRUFBdEIsQztBQUNlRSxRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHt3cmFwU2NvcGUsIGZ1bmN0aW9uRnJvbVNjcmlwdCwgZ2V0U2NyaXB0LCBjb252ZXJ0UmVzdWx0LCBnZW5lcmF0ZVJhbmRvbUhhc2h9IGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQgTWFsaWJ1bkNhY2hlIGZyb20gXCIuL01hbGlidW5DYWNoZVwiO1xuaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZSc7XG5pbXBvcnQgVk1SdW5uZXJDb250ZXh0IGZyb20gXCIuL1ZNUnVubmVyQ29udGV4dFwiO1xuaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICdldmVudHMnO1xuLyoqXG4gKiBAcHJvcGVydHkge29iamVjdH0gZ2xvYmFsXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IHRocm93XG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IGNvbnZlcnRSZXN1bHRcbiAqIEBwcm9wZXJ0eSB7VXNlcnNNb2RlbH0gdXNlclxuICogKi9cblxuY2xhc3MgVk1SdW5uZXIgZXh0ZW5kcyBFdmVudEVtaXR0ZXJ7XG4gICAgLyoqQHBhcmFtIHtWTVJ1bm5lckNvbnRleHR9IHNjb3BlQ3R4Ki9cbiAgICBjb25zdHJ1Y3RvcihzY29wZUN0eCl7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMud2l0aFRocm93KGZhbHNlKVxuICAgICAgICAgICAgLndpdGhDb252ZXJ0UmVzdWx0KHRydWUpXG4gICAgICAgICAgICAud2l0aFNjb3BlQ3R4KHNjb3BlQ3R4fHxWTVJ1bm5lci5kZWZhdWx0Q3R4KTtcbiAgICB9XG5cbiAgICBhc3luYyBkb0NvbnZlcnRSZXN1bHQocmVzdWx0KXtcbiAgICAgICAgcmV0dXJuIGNvbnZlcnRSZXN1bHQocmVzdWx0KTtcbiAgICB9XG5cbiAgICAvKipAcmV0dXJucyB7Vk1SdW5uZXJ9Ki9cbiAgICB3aXRoVGhyb3coX3Rocm93PXRydWUpe1xuICAgICAgICB0aGlzLnRocm93PV90aHJvdztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqQHJldHVybnMge1ZNUnVubmVyfSovXG4gICAgd2l0aENvbnZlcnRSZXN1bHQoY29udmVydFJlc3VsdD10cnVlKXtcbiAgICAgICAgdGhpcy5jb252ZXJ0UmVzdWx0PWNvbnZlcnRSZXN1bHQ7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKkByZXR1cm5zIHt0aGlzfSovXG4gICAgd2l0aFNjb3BlQ3R4KHNjb3BlQ3R4KXtcbiAgICAgICAgdGhpcy5zY29wZUN0eCA9IHNjb3BlQ3R4O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBzY29wZVxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IHNjb3BlLnZtXG4gICAgICogQHJldHVybnMge09iamVjdH0gc2NvcGUub3JpZ2luYWxcbiAgICAgKi9cbiAgICBnZXQgc2NvcGUoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2NvcGVDdHguZ2V0U2NvcGUodGhpcyk7XG4gICAgfVxuXG4gICAgdmFsaWRhdGUoZXhwcmVzc2lvbil7XG4gICAgICAgIGNvbnN0IHNjb3BlID0gdGhpcy5zY29wZTtcbiAgICAgICAgbGV0IGYgPSBmdW5jdGlvbkZyb21TY3JpcHQoZXhwcmVzc2lvbixzY29wZS52bSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGFzeW5jIHJ1bihleHByZXNzaW9uLGNvbnRleHQsb3B0aW9ucz17fSl7XG4gICAgICAgIGNvbnRleHQgPSBjb250ZXh0IHx8IHt9O1xuICAgICAgICBpZighZXhwcmVzc2lvbiYmXy5pc0VtcHR5KGV4cHJlc3Npb24pKVxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgY29uc3Qgc2NvcGUgPSB0aGlzLnNjb3BlO1xuICAgICAgICBsZXQgcmVzdWx0ID0gdW5kZWZpbmVkO1xuICAgICAgICBsZXQgZkRhdGEgPSBudWxsO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZkRhdGEgPSBmdW5jdGlvbkZyb21TY3JpcHQoZXhwcmVzc2lvbixzY29wZS52bSxvcHRpb25zKTtcbiAgICAgICAgfWNhdGNoIChlKSB7XG4gICAgICAgICAgICBpZih0aGlzLmxpc3RlbmVyQ291bnQoJ2Vycm9yJyk+MCl7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdlcnJvcicsZSx7XG4gICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb24sXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQsXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlOnNjb3BlLnZtLFxuICAgICAgICAgICAgICAgICAgICBzY29wZU9yaWdpbmFsOnNjb3BlLm9yaWdpbmFsXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHRoaXMudGhyb3cpe1xuICAgICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgICAgIGlmKCFmRGF0YXx8IWZEYXRhLmYpXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB0cnl7XG4gICAgICAgICAgICByZXN1bHQgPSBhd2FpdCBmRGF0YS5mLmFwcGx5KGNvbnRleHQsW2ZEYXRhLnZtMk9wdGlvbnNdKTtcbiAgICAgICAgfWNhdGNoKGUpe1xuICAgICAgICAgICAgaWYodGhpcy5saXN0ZW5lckNvdW50KCdlcnJvcicpPjApe1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnZXJyb3InLGUse1xuICAgICAgICAgICAgICAgICAgICBleHByZXNzaW9uLFxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LFxuICAgICAgICAgICAgICAgICAgICBzY29wZTpzY29wZS52bSxcbiAgICAgICAgICAgICAgICAgICAgc2NvcGVPcmlnaW5hbDpzY29wZS5vcmlnaW5hbFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZih0aGlzLnRocm93KXtcbiAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICBpZih0aGlzLmNvbnZlcnRSZXN1bHQpXG4gICAgICAgICAgICByZXN1bHQgPSBhd2FpdCB0aGlzLmRvQ29udmVydFJlc3VsdChyZXN1bHQpO1xuICAgICAgICAgICAgaWYodGhpcy5saXN0ZW5lckNvdW50KCdyZXN1bHQnKT4wKXtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ3Jlc3VsdCcscmVzdWx0LHtcbiAgICAgICAgICAgICAgICAgICAgZXhwcmVzc2lvbixcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dCxcbiAgICAgICAgICAgICAgICAgICAgc2NvcGU6c2NvcGUudm0sXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlT3JpZ2luYWw6c2NvcGUub3JpZ2luYWxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZih0aGlzLmxpc3RlbmVyQ291bnQoJ3Jlc3VsdCcpPjApe1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgncmVzdWx0JyxyZXN1bHQse1xuICAgICAgICAgICAgICAgICAgICBleHByZXNzaW9uLFxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LFxuICAgICAgICAgICAgICAgICAgICBzY29wZTpzY29wZS52bSxcbiAgICAgICAgICAgICAgICAgICAgc2NvcGVPcmlnaW5hbDpzY29wZS5vcmlnaW5hbFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuVk1SdW5uZXIuZGVmYXVsdEN0eCA9IG5ldyBWTVJ1bm5lckNvbnRleHQoKTtcbmV4cG9ydCBkZWZhdWx0IFZNUnVubmVyOyJdfQ==