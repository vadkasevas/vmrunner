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

    expression, context) {var options,scope,result,f,_args2 = arguments;return _regeneratorRuntime.async(function run$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:options = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : {};
              context = context || {};if (!(
              !expression && _.isEmpty(expression))) {_context2.next = 4;break;}return _context2.abrupt("return",
              undefined);case 4:
              scope = this.scope;
              result = undefined;
              f = null;_context2.prev = 7;

              f = functionFromScript(expression, scope.vm, options);_context2.next = 17;break;case 11:_context2.prev = 11;_context2.t0 = _context2["catch"](7);

              if (this.listenerCount('error') > 0) {
                this.emit('error', _context2.t0, {
                  expression: expression,
                  context: context,
                  scope: scope.vm,
                  scopeOriginal: scope.original });

              }if (!
              this["throw"]) {_context2.next = 16;break;}throw _context2.t0;case 16:return _context2.abrupt("return",


              result);case 17:if (

              f) {_context2.next = 19;break;}return _context2.abrupt("return",
              undefined);case 19:_context2.prev = 19;_context2.next = 22;return _regeneratorRuntime.awrap(

              f.apply(context));case 22:result = _context2.sent;_context2.next = 31;break;case 25:_context2.prev = 25;_context2.t1 = _context2["catch"](19);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9WTVJ1bm5lci5qcyJdLCJuYW1lcyI6WyJ3cmFwU2NvcGUiLCJmdW5jdGlvbkZyb21TY3JpcHQiLCJnZXRTY3JpcHQiLCJjb252ZXJ0UmVzdWx0IiwiZ2VuZXJhdGVSYW5kb21IYXNoIiwiTWFsaWJ1bkNhY2hlIiwiXyIsIlZNUnVubmVyQ29udGV4dCIsIkV2ZW50RW1pdHRlciIsIlZNUnVubmVyIiwic2NvcGVDdHgiLCJ3aXRoVGhyb3ciLCJ3aXRoQ29udmVydFJlc3VsdCIsIndpdGhTY29wZUN0eCIsImRlZmF1bHRDdHgiLCJyZXN1bHQiLCJfdGhyb3ciLCJleHByZXNzaW9uIiwic2NvcGUiLCJmIiwidm0iLCJjb250ZXh0Iiwib3B0aW9ucyIsImlzRW1wdHkiLCJ1bmRlZmluZWQiLCJsaXN0ZW5lckNvdW50IiwiZW1pdCIsInNjb3BlT3JpZ2luYWwiLCJvcmlnaW5hbCIsImFwcGx5IiwiZG9Db252ZXJ0UmVzdWx0IiwiZ2V0U2NvcGUiXSwibWFwcGluZ3MiOiIydENBQUEsZ0MsSUFBUUEsUyxVQUFBQSxTLEtBQVdDLGtCLFVBQUFBLGtCLEtBQW9CQyxTLFVBQUFBLFMsS0FBV0MsYSxVQUFBQSxhLEtBQWVDLGtCLFVBQUFBLGtCO0FBQ2pFLDhDLElBQU9DLFk7QUFDUCx3QyxJQUFPQyxDO0FBQ1Asb0QsSUFBT0MsZTtBQUNQLGdDLElBQU9DLFk7QUFDUDs7Ozs7OztBQU9NQyxRO0FBQ0Y7QUFDQSxvQkFBWUMsUUFBWixFQUFxQjtBQUNqQjtBQUNBLFVBQUtDLFNBQUwsQ0FBZSxLQUFmO0FBQ0tDLElBQUFBLGlCQURMLENBQ3VCLElBRHZCO0FBRUtDLElBQUFBLFlBRkwsQ0FFa0JILFFBQVEsSUFBRUQsUUFBUSxDQUFDSyxVQUZyQyxFQUZpQjtBQUtwQixHOztBQUVxQkMsSUFBQUEsTTtBQUNYWixjQUFBQSxhQUFhLENBQUNZLE1BQUQsQzs7O0FBR3hCLDRCO0FBQ3NCLFNBQVpDLE1BQVksdUVBQUwsSUFBSztBQUNsQixzQkFBV0EsTUFBWDtB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QUNVLFFBSkUsRUFBMUI7O0FBTUgsZTtBQUNNYixjQUFBQSxNLDRIQXRFSixDQUNQLE9BQU8sS0FBS0wsUUFBTCxDQUFjcUIsUUFBZCxDQUF1QixJQUF2QixDQUFQLENBQ0gsQyx1QkF0Q2tCdkIsWTs7Ozs7QUErR3ZCQyxRQUFRLENBQUNLLFVBQVQsR0FBc0IsSUFBSVAsZUFBSixFQUF0QixDO0FBQ2VFLFEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge3dyYXBTY29wZSwgZnVuY3Rpb25Gcm9tU2NyaXB0LCBnZXRTY3JpcHQsIGNvbnZlcnRSZXN1bHQsIGdlbmVyYXRlUmFuZG9tSGFzaH0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCBNYWxpYnVuQ2FjaGUgZnJvbSBcIi4vTWFsaWJ1bkNhY2hlXCI7XG5pbXBvcnQgXyBmcm9tICd1bmRlcnNjb3JlJztcbmltcG9ydCBWTVJ1bm5lckNvbnRleHQgZnJvbSBcIi4vVk1SdW5uZXJDb250ZXh0XCI7XG5pbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJ2V2ZW50cyc7XG4vKipcbiAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBnbG9iYWxcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gdGhyb3dcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gY29udmVydFJlc3VsdFxuICogQHByb3BlcnR5IHtVc2Vyc01vZGVsfSB1c2VyXG4gKiAqL1xuXG5jbGFzcyBWTVJ1bm5lciBleHRlbmRzIEV2ZW50RW1pdHRlcntcbiAgICAvKipAcGFyYW0ge1ZNUnVubmVyQ29udGV4dH0gc2NvcGVDdHgqL1xuICAgIGNvbnN0cnVjdG9yKHNjb3BlQ3R4KXtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy53aXRoVGhyb3coZmFsc2UpXG4gICAgICAgICAgICAud2l0aENvbnZlcnRSZXN1bHQodHJ1ZSlcbiAgICAgICAgICAgIC53aXRoU2NvcGVDdHgoc2NvcGVDdHh8fFZNUnVubmVyLmRlZmF1bHRDdHgpO1xuICAgIH1cblxuICAgIGFzeW5jIGRvQ29udmVydFJlc3VsdChyZXN1bHQpe1xuICAgICAgICByZXR1cm4gY29udmVydFJlc3VsdChyZXN1bHQpO1xuICAgIH1cblxuICAgIC8qKkByZXR1cm5zIHtWTVJ1bm5lcn0qL1xuICAgIHdpdGhUaHJvdyhfdGhyb3c9dHJ1ZSl7XG4gICAgICAgIHRoaXMudGhyb3c9X3Rocm93O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipAcmV0dXJucyB7Vk1SdW5uZXJ9Ki9cbiAgICB3aXRoQ29udmVydFJlc3VsdChjb252ZXJ0UmVzdWx0PXRydWUpe1xuICAgICAgICB0aGlzLmNvbnZlcnRSZXN1bHQ9Y29udmVydFJlc3VsdDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqQHJldHVybnMge3RoaXN9Ki9cbiAgICB3aXRoU2NvcGVDdHgoc2NvcGVDdHgpe1xuICAgICAgICB0aGlzLnNjb3BlQ3R4ID0gc2NvcGVDdHg7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IHNjb3BlXG4gICAgICogQHJldHVybnMge09iamVjdH0gc2NvcGUudm1cbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBzY29wZS5vcmlnaW5hbFxuICAgICAqL1xuICAgIGdldCBzY29wZSgpe1xuICAgICAgICByZXR1cm4gdGhpcy5zY29wZUN0eC5nZXRTY29wZSh0aGlzKTtcbiAgICB9XG5cbiAgICB2YWxpZGF0ZShleHByZXNzaW9uKXtcbiAgICAgICAgY29uc3Qgc2NvcGUgPSB0aGlzLnNjb3BlO1xuICAgICAgICBsZXQgZiA9IGZ1bmN0aW9uRnJvbVNjcmlwdChleHByZXNzaW9uLHNjb3BlLnZtKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgYXN5bmMgcnVuKGV4cHJlc3Npb24sY29udGV4dCxvcHRpb25zPXt9KXtcbiAgICAgICAgY29udGV4dCA9IGNvbnRleHQgfHwge307XG4gICAgICAgIGlmKCFleHByZXNzaW9uJiZfLmlzRW1wdHkoZXhwcmVzc2lvbikpXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICBjb25zdCBzY29wZSA9IHRoaXMuc2NvcGU7XG4gICAgICAgIGxldCByZXN1bHQgPSB1bmRlZmluZWQ7XG4gICAgICAgIGxldCBmID0gbnVsbDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGYgPSBmdW5jdGlvbkZyb21TY3JpcHQoZXhwcmVzc2lvbixzY29wZS52bSxvcHRpb25zKTtcbiAgICAgICAgfWNhdGNoIChlKSB7XG4gICAgICAgICAgICBpZih0aGlzLmxpc3RlbmVyQ291bnQoJ2Vycm9yJyk+MCl7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdlcnJvcicsZSx7XG4gICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb24sXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQsXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlOnNjb3BlLnZtLFxuICAgICAgICAgICAgICAgICAgICBzY29wZU9yaWdpbmFsOnNjb3BlLm9yaWdpbmFsXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHRoaXMudGhyb3cpe1xuICAgICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgICAgIGlmKCFmKVxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgdHJ5e1xuICAgICAgICAgICAgcmVzdWx0ID0gYXdhaXQgZi5hcHBseShjb250ZXh0KTtcbiAgICAgICAgfWNhdGNoKGUpe1xuICAgICAgICAgICAgaWYodGhpcy5saXN0ZW5lckNvdW50KCdlcnJvcicpPjApe1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnZXJyb3InLGUse1xuICAgICAgICAgICAgICAgICAgICBleHByZXNzaW9uLFxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LFxuICAgICAgICAgICAgICAgICAgICBzY29wZTpzY29wZS52bSxcbiAgICAgICAgICAgICAgICAgICAgc2NvcGVPcmlnaW5hbDpzY29wZS5vcmlnaW5hbFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZih0aGlzLnRocm93KXtcbiAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICBpZih0aGlzLmNvbnZlcnRSZXN1bHQpXG4gICAgICAgICAgICByZXN1bHQgPSBhd2FpdCB0aGlzLmRvQ29udmVydFJlc3VsdChyZXN1bHQpO1xuICAgICAgICAgICAgaWYodGhpcy5saXN0ZW5lckNvdW50KCdyZXN1bHQnKT4wKXtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ3Jlc3VsdCcscmVzdWx0LHtcbiAgICAgICAgICAgICAgICAgICAgZXhwcmVzc2lvbixcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dCxcbiAgICAgICAgICAgICAgICAgICAgc2NvcGU6c2NvcGUudm0sXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlT3JpZ2luYWw6c2NvcGUub3JpZ2luYWxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZih0aGlzLmxpc3RlbmVyQ291bnQoJ3Jlc3VsdCcpPjApe1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgncmVzdWx0JyxyZXN1bHQse1xuICAgICAgICAgICAgICAgICAgICBleHByZXNzaW9uLFxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LFxuICAgICAgICAgICAgICAgICAgICBzY29wZTpzY29wZS52bSxcbiAgICAgICAgICAgICAgICAgICAgc2NvcGVPcmlnaW5hbDpzY29wZS5vcmlnaW5hbFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuVk1SdW5uZXIuZGVmYXVsdEN0eCA9IG5ldyBWTVJ1bm5lckNvbnRleHQoKTtcbmV4cG9ydCBkZWZhdWx0IFZNUnVubmVyOyJdfQ==