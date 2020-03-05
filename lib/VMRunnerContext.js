"use strict";var _interopRequireDefault3 = require("@babel/runtime/helpers/interopRequireDefault");var _interopRequireDefault2 = _interopRequireDefault3(require("@babel/runtime/helpers/interopRequireDefault"));Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = undefined;var _classCallCheck2 = require("@babel/runtime/helpers/classCallCheck");var _classCallCheck = (0, _interopRequireDefault2["default"])(_classCallCheck2)["default"];var _createClass2 = require("@babel/runtime/helpers/createClass");var _createClass = (0, _interopRequireDefault2["default"])(_createClass2)["default"];var _utils = require("./utils");var generateRandomHash = _utils.generateRandomHash;var wrapScope = _utils.wrapScope;
var _MalibunCache = require("./MalibunCache");var MalibunCache = (0, _interopRequireDefault2["default"])(_MalibunCache)["default"];
var _vm = require("vm");var vm = (0, _interopRequireDefault2["default"])(_vm)["default"];

var HASH_KEY = '__vmRunnerHash';var

VMRunnerContext = /*#__PURE__*/function () {
  function VMRunnerContext() {_classCallCheck(this, VMRunnerContext);
    this.scopeObj = null;
    this.wrapScope = false;
    this.scopeCache = new MalibunCache();
    this.scopeCacheTtl = 10 * 60 * 1000;
  }

  /**@returns {this}*/_createClass(VMRunnerContext, [{ key: "withScopeObj", value: function withScopeObj(
    scope) {
      if (scope !== this.scopeObj) {
        this.scopeCache.clear();
        this.scopeObj = scope;
      }
      return this;
    }

    /**@returns {this}*/ }, { key: "withWrapScope", value: function withWrapScope()
    {var wrap = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      if (this.wrapScope !== wrap) {
        this.scopeCache.clear();
      }
      this.wrapScope = wrap;
      return this;
    }

    /**@returns {this}*/ }, { key: "withScopeCacheTtl", value: function withScopeCacheTtl(
    scopeCacheTtl) {
      if (this.scopeCacheTtl !== scopeCacheTtl) {
        this.scopeCache.clear();
      }
      this.scopeCacheTtl = scopeCacheTtl;
      return this;
    } }, { key: "doWrapScope", value: function doWrapScope(

    scopeObj, runner) {
      var hash = scopeObj[HASH_KEY];
      if (!hash) {
        hash = generateRandomHash();
      }
      return wrapScope(scopeObj, runner, { hash: hash });
    }

    /**
       * @property {VMRunner} runner
       * @returns {Object} scope
       * @returns {Object} scope.vm
       * @returns {Object} scope.original
       */ }, { key: "getScope", value: function getScope(
    runner) {
      if (this.scopeObj && this.wrapScope) {
        var hash = this.scopeObj[HASH_KEY];
        if (!hash) {
          hash = "".concat(generateRandomHash(), ":");
          try {
            Object.defineProperty(this.scopeObj, HASH_KEY, {
              configurable: false,
              enumerable: false,
              value: hash });

          } catch (e) {

          }
        }
        if (this.scopeObj[HASH_KEY] && this.scopeCacheTtl) {
          if (!this.scopeCache.has(this.scopeObj[HASH_KEY])) {
            this.scopeCache.set(this.scopeObj[HASH_KEY], this.doWrapScope(this.scopeObj, runner), this.scopeCacheTtl);
          }
          return this.scopeCache.get(this.scopeObj[HASH_KEY]);
        } else
        return this.doWrapScope(this.scopeObj, runner);
      } else {
        if (!this.scopeCache.has(HASH_KEY)) {
          var vmContext = vm.createContext(this.scopeObj);
          var scope = {
            vm: vmContext,
            original: this.scopeObj };

          if (this.scopeCacheTtl > 0)
          this.scopeCache.set(HASH_KEY, scope, this.scopeCacheTtl);
          return scope;
        }
        return this.scopeCache.get(HASH_KEY);
      }

    } }]);return VMRunnerContext;}();exports["default"] = VMRunnerContext;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9WTVJ1bm5lckNvbnRleHQuanMiXSwibmFtZXMiOlsiZ2VuZXJhdGVSYW5kb21IYXNoIiwid3JhcFNjb3BlIiwiTWFsaWJ1bkNhY2hlIiwidm0iLCJIQVNIX0tFWSIsIlZNUnVubmVyQ29udGV4dCIsInNjb3BlT2JqIiwic2NvcGVDYWNoZSIsInNjb3BlQ2FjaGVUdGwiLCJzY29wZSIsImNsZWFyIiwid3JhcCIsInJ1bm5lciIsImhhc2giLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImNvbmZpZ3VyYWJsZSIsImVudW1lcmFibGUiLCJ2YWx1ZSIsImUiLCJoYXMiLCJzZXQiLCJkb1dyYXBTY29wZSIsImdldCIsInZtQ29udGV4dCIsImNyZWF0ZUNvbnRleHQiLCJvcmlnaW5hbCJdLCJtYXBwaW5ncyI6InltQkFBQSxnQyxJQUFRQSxrQixVQUFBQSxrQixLQUFvQkMsUyxVQUFBQSxTO0FBQzVCLDhDLElBQU9DLFk7QUFDUCx3QixJQUFPQyxFOztBQUVQLElBQU1DLFFBQVEsR0FBRyxnQkFBakIsQzs7QUFFcUJDLGU7QUFDakIsNkJBQWE7QUFDVCxTQUFLQyxRQUFMLEdBQWdCLElBQWhCO0FBQ0EsU0FBS0wsU0FBTCxHQUFpQixLQUFqQjtBQUNBLFNBQUtNLFVBQUwsR0FBa0IsSUFBSUwsWUFBSixFQUFsQjtBQUNBLFNBQUtNLGFBQUwsR0FBcUIsS0FBRyxFQUFILEdBQU0sSUFBM0I7QUFDSDs7QUFFRCxzQjtBQUNhQyxJQUFBQSxLLEVBQU07QUFDZixVQUFHQSxLQUFLLEtBQUcsS0FBS0gsUUFBaEIsRUFBeUI7QUFDckIsYUFBS0MsVUFBTCxDQUFnQkcsS0FBaEI7QUFDQSxhQUFLSixRQUFMLEdBQWdCRyxLQUFoQjtBQUNIO0FBQ0QsYUFBTyxJQUFQO0FBQ0g7O0FBRUQsd0I7QUFDd0IsU0FBVkUsSUFBVSx1RUFBTCxJQUFLO0FBQ3BCLFVBQUcsS0FBS1YsU0FBTCxLQUFpQlUsSUFBcEIsRUFBeUI7QUFDckIsYUFBS0osVUFBTCxDQUFnQkcsS0FBaEI7QUFDSDtBQUNELFdBQUtULFNBQUwsR0FBZVUsSUFBZjtBQUNBLGFBQU8sSUFBUDtBQUNIOztBQUVELHdCO0FBQ2tCSCxJQUFBQSxhLEVBQWM7QUFDNUIsVUFBRyxLQUFLQSxhQUFMLEtBQXFCQSxhQUF4QixFQUFzQztBQUNsQyxhQUFLRCxVQUFMLENBQWdCRyxLQUFoQjtBQUNIO0FBQ0QsV0FBS0YsYUFBTCxHQUFxQkEsYUFBckI7QUFDQSxhQUFPLElBQVA7QUFDSCxLOztBQUVXRixJQUFBQSxRLEVBQVNNLE0sRUFBTztBQUN4QixVQUFJQyxJQUFJLEdBQUdQLFFBQVEsQ0FBQ0YsUUFBRCxDQUFuQjtBQUNBLFVBQUcsQ0FBQ1MsSUFBSixFQUFTO0FBQ0xBLFFBQUFBLElBQUksR0FBR2Isa0JBQWtCLEVBQXpCO0FBQ0g7QUFDRCxhQUFPQyxTQUFTLENBQUVLLFFBQUYsRUFBYU0sTUFBYixFQUFzQixFQUFDQyxJQUFJLEVBQUNBLElBQU4sRUFBdEIsQ0FBaEI7QUFDSDs7QUFFRDs7Ozs7O0FBTVNELElBQUFBLE0sRUFBTztBQUNaLFVBQUcsS0FBS04sUUFBTCxJQUFlLEtBQUtMLFNBQXZCLEVBQWtDO0FBQzlCLFlBQUlZLElBQUksR0FBRyxLQUFLUCxRQUFMLENBQWNGLFFBQWQsQ0FBWDtBQUNBLFlBQUksQ0FBQ1MsSUFBTCxFQUFXO0FBQ1BBLFVBQUFBLElBQUksYUFBTWIsa0JBQWtCLEVBQXhCLE1BQUo7QUFDQSxjQUFJO0FBQ0FjLFlBQUFBLE1BQU0sQ0FBQ0MsY0FBUCxDQUFzQixLQUFLVCxRQUEzQixFQUFxQ0YsUUFBckMsRUFBK0M7QUFDM0NZLGNBQUFBLFlBQVksRUFBRSxLQUQ2QjtBQUUzQ0MsY0FBQUEsVUFBVSxFQUFFLEtBRitCO0FBRzNDQyxjQUFBQSxLQUFLLEVBQUVMLElBSG9DLEVBQS9DOztBQUtILFdBTkQsQ0FNRSxPQUFPTSxDQUFQLEVBQVU7O0FBRVg7QUFDSjtBQUNELFlBQUcsS0FBS2IsUUFBTCxDQUFjRixRQUFkLEtBQXlCLEtBQUtJLGFBQWpDLEVBQWdEO0FBQzVDLGNBQUcsQ0FBQyxLQUFLRCxVQUFMLENBQWdCYSxHQUFoQixDQUFvQixLQUFLZCxRQUFMLENBQWNGLFFBQWQsQ0FBcEIsQ0FBSixFQUFrRDtBQUM5QyxpQkFBS0csVUFBTCxDQUFnQmMsR0FBaEIsQ0FBcUIsS0FBS2YsUUFBTCxDQUFjRixRQUFkLENBQXJCLEVBQStDLEtBQUtrQixXQUFMLENBQWlCLEtBQUtoQixRQUF0QixFQUErQk0sTUFBL0IsQ0FBL0MsRUFBc0YsS0FBS0osYUFBM0Y7QUFDSDtBQUNELGlCQUFPLEtBQUtELFVBQUwsQ0FBZ0JnQixHQUFoQixDQUFvQixLQUFLakIsUUFBTCxDQUFjRixRQUFkLENBQXBCLENBQVA7QUFDSCxTQUxEO0FBTUksZUFBTyxLQUFLa0IsV0FBTCxDQUFpQixLQUFLaEIsUUFBdEIsRUFBK0JNLE1BQS9CLENBQVA7QUFDUCxPQXJCRCxNQXFCSztBQUNBLFlBQUcsQ0FBQyxLQUFLTCxVQUFMLENBQWdCYSxHQUFoQixDQUFvQmhCLFFBQXBCLENBQUosRUFBa0M7QUFDOUIsY0FBSW9CLFNBQVMsR0FBR3JCLEVBQUUsQ0FBQ3NCLGFBQUgsQ0FBa0IsS0FBS25CLFFBQXZCLENBQWhCO0FBQ0EsY0FBSUcsS0FBSyxHQUFHO0FBQ1JOLFlBQUFBLEVBQUUsRUFBQ3FCLFNBREs7QUFFUkUsWUFBQUEsUUFBUSxFQUFDLEtBQUtwQixRQUZOLEVBQVo7O0FBSUEsY0FBRyxLQUFLRSxhQUFMLEdBQW1CLENBQXRCO0FBQ0csZUFBS0QsVUFBTCxDQUFnQmMsR0FBaEIsQ0FBb0JqQixRQUFwQixFQUE2QkssS0FBN0IsRUFBbUMsS0FBS0QsYUFBeEM7QUFDSCxpQkFBT0MsS0FBUDtBQUNIO0FBQ0QsZUFBTyxLQUFLRixVQUFMLENBQWdCZ0IsR0FBaEIsQ0FBb0JuQixRQUFwQixDQUFQO0FBQ0o7O0FBRUosSyxxREFyRmdCQyxlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtnZW5lcmF0ZVJhbmRvbUhhc2gsIHdyYXBTY29wZX0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCBNYWxpYnVuQ2FjaGUgZnJvbSBcIi4vTWFsaWJ1bkNhY2hlXCI7XG5pbXBvcnQgdm0gZnJvbSBcInZtXCI7XG5cbmNvbnN0IEhBU0hfS0VZID0gJ19fdm1SdW5uZXJIYXNoJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVk1SdW5uZXJDb250ZXh0e1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHRoaXMuc2NvcGVPYmogPSBudWxsO1xuICAgICAgICB0aGlzLndyYXBTY29wZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnNjb3BlQ2FjaGUgPSBuZXcgTWFsaWJ1bkNhY2hlKCk7XG4gICAgICAgIHRoaXMuc2NvcGVDYWNoZVR0bCA9IDEwKjYwKjEwMDA7XG4gICAgfVxuXG4gICAgLyoqQHJldHVybnMge3RoaXN9Ki9cbiAgICB3aXRoU2NvcGVPYmooc2NvcGUpe1xuICAgICAgICBpZihzY29wZSE9PXRoaXMuc2NvcGVPYmope1xuICAgICAgICAgICAgdGhpcy5zY29wZUNhY2hlLmNsZWFyKCk7XG4gICAgICAgICAgICB0aGlzLnNjb3BlT2JqID0gc2NvcGU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqQHJldHVybnMge3RoaXN9Ki9cbiAgICB3aXRoV3JhcFNjb3BlKHdyYXA9dHJ1ZSl7XG4gICAgICAgIGlmKHRoaXMud3JhcFNjb3BlIT09d3JhcCl7XG4gICAgICAgICAgICB0aGlzLnNjb3BlQ2FjaGUuY2xlYXIoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLndyYXBTY29wZT13cmFwO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipAcmV0dXJucyB7dGhpc30qL1xuICAgIHdpdGhTY29wZUNhY2hlVHRsKHNjb3BlQ2FjaGVUdGwpe1xuICAgICAgICBpZih0aGlzLnNjb3BlQ2FjaGVUdGwhPT1zY29wZUNhY2hlVHRsKXtcbiAgICAgICAgICAgIHRoaXMuc2NvcGVDYWNoZS5jbGVhcigpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2NvcGVDYWNoZVR0bCA9IHNjb3BlQ2FjaGVUdGw7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGRvV3JhcFNjb3BlKHNjb3BlT2JqLHJ1bm5lcil7XG4gICAgICAgIGxldCBoYXNoID0gc2NvcGVPYmpbSEFTSF9LRVldO1xuICAgICAgICBpZighaGFzaCl7XG4gICAgICAgICAgICBoYXNoID0gZ2VuZXJhdGVSYW5kb21IYXNoKClcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gd3JhcFNjb3BlKCBzY29wZU9iaiAsIHJ1bm5lciAsIHtoYXNoOmhhc2h9ICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtWTVJ1bm5lcn0gcnVubmVyXG4gICAgICogQHJldHVybnMge09iamVjdH0gc2NvcGVcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBzY29wZS52bVxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IHNjb3BlLm9yaWdpbmFsXG4gICAgICovXG4gICAgZ2V0U2NvcGUocnVubmVyKXtcbiAgICAgICAgaWYodGhpcy5zY29wZU9iaiYmdGhpcy53cmFwU2NvcGUpIHtcbiAgICAgICAgICAgIGxldCBoYXNoID0gdGhpcy5zY29wZU9ialtIQVNIX0tFWV07XG4gICAgICAgICAgICBpZiAoIWhhc2gpIHtcbiAgICAgICAgICAgICAgICBoYXNoID0gYCR7Z2VuZXJhdGVSYW5kb21IYXNoKCl9OmA7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuc2NvcGVPYmosIEhBU0hfS0VZLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogaGFzaFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZih0aGlzLnNjb3BlT2JqW0hBU0hfS0VZXSYmdGhpcy5zY29wZUNhY2hlVHRsKSB7XG4gICAgICAgICAgICAgICAgaWYoIXRoaXMuc2NvcGVDYWNoZS5oYXModGhpcy5zY29wZU9ialtIQVNIX0tFWV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2NvcGVDYWNoZS5zZXQoIHRoaXMuc2NvcGVPYmpbSEFTSF9LRVldICwgdGhpcy5kb1dyYXBTY29wZSh0aGlzLnNjb3BlT2JqLHJ1bm5lciksdGhpcy5zY29wZUNhY2hlVHRsICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNjb3BlQ2FjaGUuZ2V0KHRoaXMuc2NvcGVPYmpbSEFTSF9LRVldKTtcbiAgICAgICAgICAgIH1lbHNlXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZG9XcmFwU2NvcGUodGhpcy5zY29wZU9iaixydW5uZXIpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICBpZighdGhpcy5zY29wZUNhY2hlLmhhcyhIQVNIX0tFWSkpe1xuICAgICAgICAgICAgICAgICBsZXQgdm1Db250ZXh0ID0gdm0uY3JlYXRlQ29udGV4dCggdGhpcy5zY29wZU9iaiApO1xuICAgICAgICAgICAgICAgICBsZXQgc2NvcGUgPSB7XG4gICAgICAgICAgICAgICAgICAgICB2bTp2bUNvbnRleHQsXG4gICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbDp0aGlzLnNjb3BlT2JqXG4gICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgIGlmKHRoaXMuc2NvcGVDYWNoZVR0bD4wKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjb3BlQ2FjaGUuc2V0KEhBU0hfS0VZLHNjb3BlLHRoaXMuc2NvcGVDYWNoZVR0bCk7XG4gICAgICAgICAgICAgICAgIHJldHVybiBzY29wZTtcbiAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2NvcGVDYWNoZS5nZXQoSEFTSF9LRVkpO1xuICAgICAgICB9XG5cbiAgICB9XG59Il19