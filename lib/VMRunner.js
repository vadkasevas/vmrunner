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

    expression, context) {var scope, result, f;return _regeneratorRuntime.async(function run$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
              context = context || {};if (!(
              !expression && _.isEmpty(expression))) {_context2.next = 3;break;}return _context2.abrupt("return",
              undefined);case 3:
              //const contextCopy = Object.assign({},context);
              scope = this.scope;
              /*
                                  const proxy =  new Proxy(context,{
                                      get: function(target, property) {
                                          //console.log('proxy get:',property);
                                          if(contextCopy.hasOwnProperty(property))
                                              return contextCopy[property];
                                          if(context.hasOwnProperty(property))
                                              return context[property];
                                          if(scope.original.hasOwnProperty(property))
                                              return scope.original[property];
                                      },
                                      set: function (target, key, value, receiver) {
                                          contextCopy[key]=value;
                                      },
                                      getOwnPropertyDescriptor(target, name){
                                          return Object.getOwnPropertyDescriptor(contextCopy, name);
                                      },
                                      ownKeys(target){
                                          return Object.getOwnPropertyNames(contextCopy);
                                      },
                                      defineProperty(target, name, propertyDescriptor){
                                          return Object.defineProperty(contextCopy,name,propertyDescriptor);
                                      },
                                      deleteProperty(target, name){
                                          return delete contextCopy[name];
                                      },
                                      preventExtensions(target){
                                          return Object.preventExtensions(contextCopy);
                                      },
                                      has(target, name){
                                          return name in contextCopy;
                                      }
                                  });
                                    */

              result = undefined;
              f = null;_context2.prev = 6;

              f = functionFromScript(expression, scope.vm);_context2.next = 16;break;case 10:_context2.prev = 10;_context2.t0 = _context2["catch"](6);

              if (this.listenerCount('error') > 0) {
                this.emit('error', _context2.t0, {
                  expression: expression,
                  context: context,
                  scope: scope.vm,
                  scopeOriginal: scope.original });

              }if (!
              this["throw"]) {_context2.next = 15;break;}throw _context2.t0;case 15:return _context2.abrupt("return",


              result);case 16:if (

              f) {_context2.next = 18;break;}return _context2.abrupt("return",
              undefined);case 18:_context2.prev = 18;_context2.next = 21;return _regeneratorRuntime.awrap(

              f.apply(context));case 21:result = _context2.sent;_context2.next = 30;break;case 24:_context2.prev = 24;_context2.t1 = _context2["catch"](18);

              if (this.listenerCount('error') > 0) {
                this.emit('error', _context2.t1, {
                  expression: expression,
                  context: context,
                  scope: scope.vm,
                  scopeOriginal: scope.original });

              }if (!
              this["throw"]) {_context2.next = 29;break;}throw _context2.t1;case 29:return _context2.abrupt("return",


              result);case 30:if (!

              this.convertResult) {_context2.next = 34;break;}_context2.next = 33;return _regeneratorRuntime.awrap(
              this.doConvertResult(result));case 33:result = _context2.sent;case 34:if (!(
              this.listenerCount('result') > 0)) {_context2.next = 38;break;}
              this.emit('result', result, {
                expression: expression,
                context: context,
                scope: scope.vm,
                scopeOriginal: scope.original });_context2.next = 40;break;case 38:



              if (this.listenerCount('result') > 0) {
                this.emit('result', result, {
                  expression: expression,
                  context: context,
                  scope: scope.vm,
                  scopeOriginal: scope.original });

              }return _context2.abrupt("return",
              result);case 40:case "end":return _context2.stop();}}}, null, this, [[6, 10], [18, 24]]);} }, { key: "scope", get: function get() {return this.scopeCtx.getScope(this);} }]);return VMRunner;}(EventEmitter);




VMRunner.defaultCtx = new VMRunnerContext();exports["default"] =
VMRunner;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9WTVJ1bm5lci5qcyJdLCJuYW1lcyI6WyJ3cmFwU2NvcGUiLCJmdW5jdGlvbkZyb21TY3JpcHQiLCJnZXRTY3JpcHQiLCJjb252ZXJ0UmVzdWx0IiwiZ2VuZXJhdGVSYW5kb21IYXNoIiwiTWFsaWJ1bkNhY2hlIiwiXyIsIlZNUnVubmVyQ29udGV4dCIsIkV2ZW50RW1pdHRlciIsIlZNUnVubmVyIiwic2NvcGVDdHgiLCJ3aXRoVGhyb3ciLCJ3aXRoQ29udmVydFJlc3VsdCIsIndpdGhTY29wZUN0eCIsImRlZmF1bHRDdHgiLCJyZXN1bHQiLCJfdGhyb3ciLCJleHByZXNzaW9uIiwic2NvcGUiLCJmIiwidm0iLCJjb250ZXh0IiwiaXNFbXB0eSIsInVuZGVmaW5lZCIsImxpc3RlbmVyQ291bnQiLCJlbWl0Iiwic2NvcGVPcmlnaW5hbCIsIm9yaWdpbmFsIiwiYXBwbHkiLCJkb0NvbnZlcnRSZXN1bHQiLCJnZXRTY29wZSJdLCJtYXBwaW5ncyI6IjJ0Q0FBQSxnQyxJQUFRQSxTLFVBQUFBLFMsS0FBV0Msa0IsVUFBQUEsa0IsS0FBb0JDLFMsVUFBQUEsUyxLQUFXQyxhLFVBQUFBLGEsS0FBZUMsa0IsVUFBQUEsa0I7QUFDakUsOEMsSUFBT0MsWTtBQUNQLHdDLElBQU9DLEM7QUFDUCxvRCxJQUFPQyxlO0FBQ1AsZ0MsSUFBT0MsWTtBQUNQOzs7Ozs7O0FBT01DLFE7QUFDRjtBQUNBLG9CQUFZQyxRQUFaLEVBQXFCO0FBQ2pCO0FBQ0EsVUFBS0MsU0FBTCxDQUFlLEtBQWY7QUFDS0MsSUFBQUEsaUJBREwsQ0FDdUIsSUFEdkI7QUFFS0MsSUFBQUEsWUFGTCxDQUVrQkgsUUFBUSxJQUFFRCxRQUFRLENBQUNLLFVBRnJDLEVBRmlCO0FBS3BCLEc7O0FBRXFCQyxJQUFBQSxNO0FBQ1haLGNBQUFBLGFBQWEsQ0FBQ1ksTUFBRCxDOzs7QUFHeEIsNEI7QUFDc0IsU0FBWkMsTUFBWSx1RUFBTCxJQUFLO0FBQ2xCLHNCQUFXQSxNQUFYO0FBQ0EsYUFBTyxJ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QUFLLENBQUNTLFFBSkUsRUFBMUI7O0FBTUgsZTtBQUNNWixjQUFBQSxNLDRIQTFHSixDQUNQLE9BQU8sS0FBS0wsUUFBTCxDQUFjb0IsUUFBZCxDQUF1QixJQUF2QixDQUFQLENBQ0gsQyx1QkF0Q2tCdEIsWTs7Ozs7QUFtSnZCQyxRQUFRLENBQUNLLFVBQVQsR0FBc0IsSUFBSVAsZUFBSixFQUF0QixDO0FBQ2VFLFEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge3dyYXBTY29wZSwgZnVuY3Rpb25Gcm9tU2NyaXB0LCBnZXRTY3JpcHQsIGNvbnZlcnRSZXN1bHQsIGdlbmVyYXRlUmFuZG9tSGFzaH0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCBNYWxpYnVuQ2FjaGUgZnJvbSBcIi4vTWFsaWJ1bkNhY2hlXCI7XG5pbXBvcnQgXyBmcm9tICd1bmRlcnNjb3JlJztcbmltcG9ydCBWTVJ1bm5lckNvbnRleHQgZnJvbSBcIi4vVk1SdW5uZXJDb250ZXh0XCI7XG5pbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJ2V2ZW50cyc7XG4vKipcbiAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBnbG9iYWxcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gdGhyb3dcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gY29udmVydFJlc3VsdFxuICogQHByb3BlcnR5IHtVc2Vyc01vZGVsfSB1c2VyXG4gKiAqL1xuXG5jbGFzcyBWTVJ1bm5lciBleHRlbmRzIEV2ZW50RW1pdHRlcntcbiAgICAvKipAcGFyYW0ge1ZNUnVubmVyQ29udGV4dH0gc2NvcGVDdHgqL1xuICAgIGNvbnN0cnVjdG9yKHNjb3BlQ3R4KXtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy53aXRoVGhyb3coZmFsc2UpXG4gICAgICAgICAgICAud2l0aENvbnZlcnRSZXN1bHQodHJ1ZSlcbiAgICAgICAgICAgIC53aXRoU2NvcGVDdHgoc2NvcGVDdHh8fFZNUnVubmVyLmRlZmF1bHRDdHgpO1xuICAgIH1cblxuICAgIGFzeW5jIGRvQ29udmVydFJlc3VsdChyZXN1bHQpe1xuICAgICAgICByZXR1cm4gY29udmVydFJlc3VsdChyZXN1bHQpO1xuICAgIH1cblxuICAgIC8qKkByZXR1cm5zIHtWTVJ1bm5lcn0qL1xuICAgIHdpdGhUaHJvdyhfdGhyb3c9dHJ1ZSl7XG4gICAgICAgIHRoaXMudGhyb3c9X3Rocm93O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipAcmV0dXJucyB7Vk1SdW5uZXJ9Ki9cbiAgICB3aXRoQ29udmVydFJlc3VsdChjb252ZXJ0UmVzdWx0PXRydWUpe1xuICAgICAgICB0aGlzLmNvbnZlcnRSZXN1bHQ9Y29udmVydFJlc3VsdDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqQHJldHVybnMge3RoaXN9Ki9cbiAgICB3aXRoU2NvcGVDdHgoc2NvcGVDdHgpe1xuICAgICAgICB0aGlzLnNjb3BlQ3R4ID0gc2NvcGVDdHg7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IHNjb3BlXG4gICAgICogQHJldHVybnMge09iamVjdH0gc2NvcGUudm1cbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBzY29wZS5vcmlnaW5hbFxuICAgICAqL1xuICAgIGdldCBzY29wZSgpe1xuICAgICAgICByZXR1cm4gdGhpcy5zY29wZUN0eC5nZXRTY29wZSh0aGlzKTtcbiAgICB9XG5cbiAgICB2YWxpZGF0ZShleHByZXNzaW9uKXtcbiAgICAgICAgY29uc3Qgc2NvcGUgPSB0aGlzLnNjb3BlO1xuICAgICAgICBsZXQgZiA9IGZ1bmN0aW9uRnJvbVNjcmlwdChleHByZXNzaW9uLHNjb3BlLnZtKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgYXN5bmMgcnVuKGV4cHJlc3Npb24sY29udGV4dCl7XG4gICAgICAgIGNvbnRleHQgPSBjb250ZXh0IHx8IHt9O1xuICAgICAgICBpZighZXhwcmVzc2lvbiYmXy5pc0VtcHR5KGV4cHJlc3Npb24pKVxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgLy9jb25zdCBjb250ZXh0Q29weSA9IE9iamVjdC5hc3NpZ24oe30sY29udGV4dCk7XG4gICAgICAgIGNvbnN0IHNjb3BlID0gdGhpcy5zY29wZTtcbiAgICAgICAgLypcbiAgICAgICAgY29uc3QgcHJveHkgPSAgbmV3IFByb3h5KGNvbnRleHQse1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbih0YXJnZXQsIHByb3BlcnR5KSB7XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygncHJveHkgZ2V0OicscHJvcGVydHkpO1xuICAgICAgICAgICAgICAgIGlmKGNvbnRleHRDb3B5Lmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRleHRDb3B5W3Byb3BlcnR5XTtcbiAgICAgICAgICAgICAgICBpZihjb250ZXh0Lmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRleHRbcHJvcGVydHldO1xuICAgICAgICAgICAgICAgIGlmKHNjb3BlLm9yaWdpbmFsLmhhc093blByb3BlcnR5KHByb3BlcnR5KSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNjb3BlLm9yaWdpbmFsW3Byb3BlcnR5XTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh0YXJnZXQsIGtleSwgdmFsdWUsIHJlY2VpdmVyKSB7XG4gICAgICAgICAgICAgICAgY29udGV4dENvcHlba2V5XT12YWx1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBuYW1lKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihjb250ZXh0Q29weSwgbmFtZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb3duS2V5cyh0YXJnZXQpe1xuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhjb250ZXh0Q29weSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBuYW1lLCBwcm9wZXJ0eURlc2NyaXB0b3Ipe1xuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29udGV4dENvcHksbmFtZSxwcm9wZXJ0eURlc2NyaXB0b3IpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRlbGV0ZVByb3BlcnR5KHRhcmdldCwgbmFtZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlbGV0ZSBjb250ZXh0Q29weVtuYW1lXTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwcmV2ZW50RXh0ZW5zaW9ucyh0YXJnZXQpe1xuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QucHJldmVudEV4dGVuc2lvbnMoY29udGV4dENvcHkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhhcyh0YXJnZXQsIG5hbWUpe1xuICAgICAgICAgICAgICAgIHJldHVybiBuYW1lIGluIGNvbnRleHRDb3B5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IHJlc3VsdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgbGV0IGYgPSBudWxsO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZiA9IGZ1bmN0aW9uRnJvbVNjcmlwdChleHByZXNzaW9uLHNjb3BlLnZtKTtcbiAgICAgICAgfWNhdGNoIChlKSB7XG4gICAgICAgICAgICBpZih0aGlzLmxpc3RlbmVyQ291bnQoJ2Vycm9yJyk+MCl7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdlcnJvcicsZSx7XG4gICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb24sXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQsXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlOnNjb3BlLnZtLFxuICAgICAgICAgICAgICAgICAgICBzY29wZU9yaWdpbmFsOnNjb3BlLm9yaWdpbmFsXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHRoaXMudGhyb3cpe1xuICAgICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgICAgIGlmKCFmKVxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgdHJ5e1xuICAgICAgICAgICAgcmVzdWx0ID0gYXdhaXQgZi5hcHBseShjb250ZXh0KTtcbiAgICAgICAgfWNhdGNoKGUpe1xuICAgICAgICAgICAgaWYodGhpcy5saXN0ZW5lckNvdW50KCdlcnJvcicpPjApe1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnZXJyb3InLGUse1xuICAgICAgICAgICAgICAgICAgICBleHByZXNzaW9uLFxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LFxuICAgICAgICAgICAgICAgICAgICBzY29wZTpzY29wZS52bSxcbiAgICAgICAgICAgICAgICAgICAgc2NvcGVPcmlnaW5hbDpzY29wZS5vcmlnaW5hbFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZih0aGlzLnRocm93KXtcbiAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICBpZih0aGlzLmNvbnZlcnRSZXN1bHQpXG4gICAgICAgICAgICByZXN1bHQgPSBhd2FpdCB0aGlzLmRvQ29udmVydFJlc3VsdChyZXN1bHQpO1xuICAgICAgICAgICAgaWYodGhpcy5saXN0ZW5lckNvdW50KCdyZXN1bHQnKT4wKXtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ3Jlc3VsdCcscmVzdWx0LHtcbiAgICAgICAgICAgICAgICAgICAgZXhwcmVzc2lvbixcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dCxcbiAgICAgICAgICAgICAgICAgICAgc2NvcGU6c2NvcGUudm0sXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlT3JpZ2luYWw6c2NvcGUub3JpZ2luYWxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZih0aGlzLmxpc3RlbmVyQ291bnQoJ3Jlc3VsdCcpPjApe1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgncmVzdWx0JyxyZXN1bHQse1xuICAgICAgICAgICAgICAgICAgICBleHByZXNzaW9uLFxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LFxuICAgICAgICAgICAgICAgICAgICBzY29wZTpzY29wZS52bSxcbiAgICAgICAgICAgICAgICAgICAgc2NvcGVPcmlnaW5hbDpzY29wZS5vcmlnaW5hbFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuVk1SdW5uZXIuZGVmYXVsdEN0eCA9IG5ldyBWTVJ1bm5lckNvbnRleHQoKTtcbmV4cG9ydCBkZWZhdWx0IFZNUnVubmVyOyJdfQ==