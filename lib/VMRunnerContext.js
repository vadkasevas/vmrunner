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
      if (this.scopeObj && this.wrapScope) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9WTVJ1bm5lckNvbnRleHQuanMiXSwibmFtZXMiOlsiZ2VuZXJhdGVSYW5kb21IYXNoIiwid3JhcFNjb3BlIiwiTWFsaWJ1bkNhY2hlIiwidm0iLCJIQVNIX0tFWSIsIlZNUnVubmVyQ29udGV4dCIsInNjb3BlT2JqIiwic2NvcGVDYWNoZSIsInNjb3BlQ2FjaGVUdGwiLCJzY29wZSIsImNsZWFyIiwid3JhcCIsInJ1bm5lciIsImhhc2giLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImNvbmZpZ3VyYWJsZSIsImVudW1lcmFibGUiLCJ2YWx1ZSIsImUiLCJoYXMiLCJzZXQiLCJkb1dyYXBTY29wZSIsImdldCIsInZtQ29udGV4dCIsImNyZWF0ZUNvbnRleHQiLCJvcmlnaW5hbCJdLCJtYXBwaW5ncyI6InltQkFBQSxnQyxJQUFRQSxrQixVQUFBQSxrQixLQUFvQkMsUyxVQUFBQSxTO0FBQzVCLDhDLElBQU9DLFk7QUFDUCx3QixJQUFPQyxFOztBQUVQLElBQU1DLFFBQVEsR0FBRyxnQkFBakIsQzs7QUFFcUJDLGU7QUFDakIsNkJBQWE7QUFDVCxTQUFLQyxRQUFMLEdBQWdCLElBQWhCO0FBQ0EsU0FBS0wsU0FBTCxHQUFpQixLQUFqQjtBQUNBLFNBQUtNLFVBQUwsR0FBa0IsSUFBSUwsWUFBSixFQUFsQjtBQUNBLFNBQUtNLGFBQUwsR0FBcUIsS0FBRyxFQUFILEdBQU0sSUFBM0I7QUFDSDs7QUFFRCxzQjtBQUNhQyxJQUFBQSxLLEVBQU07QUFDZixVQUFHQSxLQUFLLEtBQUcsS0FBS0gsUUFBaEIsRUFBeUI7QUFDckIsYUFBS0MsVUFBTCxDQUFnQkcsS0FBaEI7QUFDQSxhQUFLSixRQUFMLEdBQWdCRyxLQUFoQjtBQUNIO0FBQ0QsYUFBTyxJQUFQO0FBQ0g7O0FBRUQsd0I7QUFDd0IsU0FBVkUsSUFBVSx1RUFBTCxJQUFLO0FBQ3BCLFVBQUcsS0FBS1YsU0FBTCxLQUFpQlUsSUFBcEIsRUFBeUI7QUFDckIsYUFBS0osVUFBTCxDQUFnQkcsS0FBaEI7QUFDSDtBQUNELFdBQUtULFNBQUwsR0FBZVUsSUFBZjtBQUNBLGFBQU8sSUFBUDtBQUNIOztBQUVELHdCO0FBQ2tCSCxJQUFBQSxhLEVBQWM7QUFDNUIsVUFBRyxLQUFLQSxhQUFMLEtBQXFCQSxhQUF4QixFQUFzQztBQUNsQyxhQUFLRCxVQUFMLENBQWdCRyxLQUFoQjtBQUNIO0FBQ0QsV0FBS0YsYUFBTCxHQUFxQkEsYUFBckI7QUFDQSxhQUFPLElBQVA7QUFDSCxLOztBQUVXRixJQUFBQSxRLEVBQVNNLE0sRUFBTztBQUN4QixVQUFJQyxJQUFJLEdBQUdQLFFBQVEsQ0FBQ0YsUUFBRCxDQUFuQjtBQUNBLFVBQUcsQ0FBQ1MsSUFBSixFQUFTO0FBQ0xBLFFBQUFBLElBQUksR0FBR2Isa0JBQWtCLEVBQXpCO0FBQ0g7QUFDRCxhQUFPQyxTQUFTLENBQUVLLFFBQUYsRUFBYU0sTUFBYixFQUFzQixFQUFDQyxJQUFJLEVBQUNBLElBQU4sRUFBdEIsQ0FBaEI7QUFDSDs7QUFFRDs7Ozs7O0FBTVNELElBQUFBLE0sRUFBTztBQUNaLFVBQUlDLElBQUksR0FBRyxLQUFLUCxRQUFMLENBQWNGLFFBQWQsQ0FBWDtBQUNBLFVBQUksQ0FBQ1MsSUFBTCxFQUFXO0FBQ1BBLFFBQUFBLElBQUksYUFBTWIsa0JBQWtCLEVBQXhCLE1BQUo7QUFDQSxZQUFJO0FBQ0FjLFVBQUFBLE1BQU0sQ0FBQ0MsY0FBUCxDQUFzQixLQUFLVCxRQUEzQixFQUFxQ0YsUUFBckMsRUFBK0M7QUFDM0NZLFlBQUFBLFlBQVksRUFBRSxLQUQ2QjtBQUUzQ0MsWUFBQUEsVUFBVSxFQUFFLEtBRitCO0FBRzNDQyxZQUFBQSxLQUFLLEVBQUVMLElBSG9DLEVBQS9DOztBQUtILFNBTkQsQ0FNRSxPQUFPTSxDQUFQLEVBQVU7O0FBRVg7QUFDSjtBQUNELFVBQUcsS0FBS2IsUUFBTCxJQUFlLEtBQUtMLFNBQXZCLEVBQWtDO0FBQzlCLFlBQUcsS0FBS0ssUUFBTCxDQUFjRixRQUFkLEtBQXlCLEtBQUtJLGFBQWpDLEVBQWdEO0FBQzVDLGNBQUcsQ0FBQyxLQUFLRCxVQUFMLENBQWdCYSxHQUFoQixDQUFvQixLQUFLZCxRQUFMLENBQWNGLFFBQWQsQ0FBcEIsQ0FBSixFQUFrRDtBQUM5QyxpQkFBS0csVUFBTCxDQUFnQmMsR0FBaEIsQ0FBcUIsS0FBS2YsUUFBTCxDQUFjRixRQUFkLENBQXJCLEVBQStDLEtBQUtrQixXQUFMLENBQWlCLEtBQUtoQixRQUF0QixFQUErQk0sTUFBL0IsQ0FBL0MsRUFBc0YsS0FBS0osYUFBM0Y7QUFDSDtBQUNELGlCQUFPLEtBQUtELFVBQUwsQ0FBZ0JnQixHQUFoQixDQUFvQixLQUFLakIsUUFBTCxDQUFjRixRQUFkLENBQXBCLENBQVA7QUFDSCxTQUxEO0FBTUksZUFBTyxLQUFLa0IsV0FBTCxDQUFpQixLQUFLaEIsUUFBdEIsRUFBK0JNLE1BQS9CLENBQVA7QUFDUCxPQVJELE1BUUs7QUFDQSxZQUFHLENBQUMsS0FBS0wsVUFBTCxDQUFnQmEsR0FBaEIsQ0FBb0JoQixRQUFwQixDQUFKLEVBQWtDO0FBQzlCLGNBQUlvQixTQUFTLEdBQUdyQixFQUFFLENBQUNzQixhQUFILENBQWtCLEtBQUtuQixRQUF2QixDQUFoQjtBQUNBLGNBQUlHLEtBQUssR0FBRztBQUNSTixZQUFBQSxFQUFFLEVBQUNxQixTQURLO0FBRVJFLFlBQUFBLFFBQVEsRUFBQyxLQUFLcEIsUUFGTixFQUFaOztBQUlBLGNBQUcsS0FBS0UsYUFBTCxHQUFtQixDQUF0QjtBQUNHLGVBQUtELFVBQUwsQ0FBZ0JjLEdBQWhCLENBQW9CakIsUUFBcEIsRUFBNkJLLEtBQTdCLEVBQW1DLEtBQUtELGFBQXhDO0FBQ0gsaUJBQU9DLEtBQVA7QUFDSDtBQUNELGVBQU8sS0FBS0YsVUFBTCxDQUFnQmdCLEdBQWhCLENBQW9CbkIsUUFBcEIsQ0FBUDtBQUNKOztBQUVKLEsscURBckZnQkMsZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Z2VuZXJhdGVSYW5kb21IYXNoLCB3cmFwU2NvcGV9IGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQgTWFsaWJ1bkNhY2hlIGZyb20gXCIuL01hbGlidW5DYWNoZVwiO1xuaW1wb3J0IHZtIGZyb20gXCJ2bVwiO1xuXG5jb25zdCBIQVNIX0tFWSA9ICdfX3ZtUnVubmVySGFzaCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZNUnVubmVyQ29udGV4dHtcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICB0aGlzLnNjb3BlT2JqID0gbnVsbDtcbiAgICAgICAgdGhpcy53cmFwU2NvcGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zY29wZUNhY2hlID0gbmV3IE1hbGlidW5DYWNoZSgpO1xuICAgICAgICB0aGlzLnNjb3BlQ2FjaGVUdGwgPSAxMCo2MCoxMDAwO1xuICAgIH1cblxuICAgIC8qKkByZXR1cm5zIHt0aGlzfSovXG4gICAgd2l0aFNjb3BlT2JqKHNjb3BlKXtcbiAgICAgICAgaWYoc2NvcGUhPT10aGlzLnNjb3BlT2JqKXtcbiAgICAgICAgICAgIHRoaXMuc2NvcGVDYWNoZS5jbGVhcigpO1xuICAgICAgICAgICAgdGhpcy5zY29wZU9iaiA9IHNjb3BlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKkByZXR1cm5zIHt0aGlzfSovXG4gICAgd2l0aFdyYXBTY29wZSh3cmFwPXRydWUpe1xuICAgICAgICBpZih0aGlzLndyYXBTY29wZSE9PXdyYXApe1xuICAgICAgICAgICAgdGhpcy5zY29wZUNhY2hlLmNsZWFyKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy53cmFwU2NvcGU9d3JhcDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqQHJldHVybnMge3RoaXN9Ki9cbiAgICB3aXRoU2NvcGVDYWNoZVR0bChzY29wZUNhY2hlVHRsKXtcbiAgICAgICAgaWYodGhpcy5zY29wZUNhY2hlVHRsIT09c2NvcGVDYWNoZVR0bCl7XG4gICAgICAgICAgICB0aGlzLnNjb3BlQ2FjaGUuY2xlYXIoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNjb3BlQ2FjaGVUdGwgPSBzY29wZUNhY2hlVHRsO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBkb1dyYXBTY29wZShzY29wZU9iaixydW5uZXIpe1xuICAgICAgICBsZXQgaGFzaCA9IHNjb3BlT2JqW0hBU0hfS0VZXTtcbiAgICAgICAgaWYoIWhhc2gpe1xuICAgICAgICAgICAgaGFzaCA9IGdlbmVyYXRlUmFuZG9tSGFzaCgpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHdyYXBTY29wZSggc2NvcGVPYmogLCBydW5uZXIgLCB7aGFzaDpoYXNofSApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7Vk1SdW5uZXJ9IHJ1bm5lclxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IHNjb3BlXG4gICAgICogQHJldHVybnMge09iamVjdH0gc2NvcGUudm1cbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBzY29wZS5vcmlnaW5hbFxuICAgICAqL1xuICAgIGdldFNjb3BlKHJ1bm5lcil7XG4gICAgICAgIGxldCBoYXNoID0gdGhpcy5zY29wZU9ialtIQVNIX0tFWV07XG4gICAgICAgIGlmICghaGFzaCkge1xuICAgICAgICAgICAgaGFzaCA9IGAke2dlbmVyYXRlUmFuZG9tSGFzaCgpfTpgO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5zY29wZU9iaiwgSEFTSF9LRVksIHtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBoYXNoXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZih0aGlzLnNjb3BlT2JqJiZ0aGlzLndyYXBTY29wZSkge1xuICAgICAgICAgICAgaWYodGhpcy5zY29wZU9ialtIQVNIX0tFWV0mJnRoaXMuc2NvcGVDYWNoZVR0bCkge1xuICAgICAgICAgICAgICAgIGlmKCF0aGlzLnNjb3BlQ2FjaGUuaGFzKHRoaXMuc2NvcGVPYmpbSEFTSF9LRVldKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjb3BlQ2FjaGUuc2V0KCB0aGlzLnNjb3BlT2JqW0hBU0hfS0VZXSAsIHRoaXMuZG9XcmFwU2NvcGUodGhpcy5zY29wZU9iaixydW5uZXIpLHRoaXMuc2NvcGVDYWNoZVR0bCApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zY29wZUNhY2hlLmdldCh0aGlzLnNjb3BlT2JqW0hBU0hfS0VZXSk7XG4gICAgICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmRvV3JhcFNjb3BlKHRoaXMuc2NvcGVPYmoscnVubmVyKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgaWYoIXRoaXMuc2NvcGVDYWNoZS5oYXMoSEFTSF9LRVkpKXtcbiAgICAgICAgICAgICAgICAgbGV0IHZtQ29udGV4dCA9IHZtLmNyZWF0ZUNvbnRleHQoIHRoaXMuc2NvcGVPYmogKTtcbiAgICAgICAgICAgICAgICAgbGV0IHNjb3BlID0ge1xuICAgICAgICAgICAgICAgICAgICAgdm06dm1Db250ZXh0LFxuICAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWw6dGhpcy5zY29wZU9ialxuICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICBpZih0aGlzLnNjb3BlQ2FjaGVUdGw+MClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY29wZUNhY2hlLnNldChIQVNIX0tFWSxzY29wZSx0aGlzLnNjb3BlQ2FjaGVUdGwpO1xuICAgICAgICAgICAgICAgICByZXR1cm4gc2NvcGU7XG4gICAgICAgICAgICAgfVxuICAgICAgICAgICAgIHJldHVybiB0aGlzLnNjb3BlQ2FjaGUuZ2V0KEhBU0hfS0VZKTtcbiAgICAgICAgfVxuXG4gICAgfVxufSJdfQ==