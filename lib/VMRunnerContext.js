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
      this.scopeObj = scope;
      return this;
    }

    /**@returns {this}*/ }, { key: "withWrapScope", value: function withWrapScope()
    {var wrap = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      this.wrapScope = wrap;
      return this;
    }

    /**@returns {this}*/ }, { key: "withScopeCacheTtl", value: function withScopeCacheTtl(
    scopeCacheTtl) {
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
      }
      var vmContext = vm.createContext(this.scopeObj);
      return {
        vm: vmContext,
        original: this.scopeObj };


    } }]);return VMRunnerContext;}();exports["default"] = VMRunnerContext;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9WTVJ1bm5lckNvbnRleHQuanMiXSwibmFtZXMiOlsiZ2VuZXJhdGVSYW5kb21IYXNoIiwid3JhcFNjb3BlIiwiTWFsaWJ1bkNhY2hlIiwidm0iLCJIQVNIX0tFWSIsIlZNUnVubmVyQ29udGV4dCIsInNjb3BlT2JqIiwic2NvcGVDYWNoZSIsInNjb3BlQ2FjaGVUdGwiLCJzY29wZSIsIndyYXAiLCJydW5uZXIiLCJoYXNoIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJjb25maWd1cmFibGUiLCJlbnVtZXJhYmxlIiwidmFsdWUiLCJlIiwiaGFzIiwic2V0IiwiZG9XcmFwU2NvcGUiLCJnZXQiLCJ2bUNvbnRleHQiLCJjcmVhdGVDb250ZXh0Iiwib3JpZ2luYWwiXSwibWFwcGluZ3MiOiJ5bUJBQUEsZ0MsSUFBUUEsa0IsVUFBQUEsa0IsS0FBb0JDLFMsVUFBQUEsUztBQUM1Qiw4QyxJQUFPQyxZO0FBQ1Asd0IsSUFBT0MsRTs7QUFFUCxJQUFNQyxRQUFRLEdBQUcsZ0JBQWpCLEM7O0FBRXFCQyxlO0FBQ2pCLDZCQUFhO0FBQ1QsU0FBS0MsUUFBTCxHQUFnQixJQUFoQjtBQUNBLFNBQUtMLFNBQUwsR0FBaUIsS0FBakI7QUFDQSxTQUFLTSxVQUFMLEdBQWtCLElBQUlMLFlBQUosRUFBbEI7QUFDQSxTQUFLTSxhQUFMLEdBQXFCLEtBQUcsRUFBSCxHQUFNLElBQTNCO0FBQ0g7O0FBRUQsc0I7QUFDYUMsSUFBQUEsSyxFQUFNO0FBQ2YsV0FBS0gsUUFBTCxHQUFnQkcsS0FBaEI7QUFDQSxhQUFPLElBQVA7QUFDSDs7QUFFRCx3QjtBQUN3QixTQUFWQyxJQUFVLHVFQUFMLElBQUs7QUFDcEIsV0FBS1QsU0FBTCxHQUFlUyxJQUFmO0FBQ0EsYUFBTyxJQUFQO0FBQ0g7O0FBRUQsd0I7QUFDa0JGLElBQUFBLGEsRUFBYztBQUM1QixXQUFLQSxhQUFMLEdBQXFCQSxhQUFyQjtBQUNBLGFBQU8sSUFBUDtBQUNILEs7O0FBRVdGLElBQUFBLFEsRUFBU0ssTSxFQUFPO0FBQ3hCLFVBQUlDLElBQUksR0FBR04sUUFBUSxDQUFDRixRQUFELENBQW5CO0FBQ0EsVUFBRyxDQUFDUSxJQUFKLEVBQVM7QUFDTEEsUUFBQUEsSUFBSSxHQUFHWixrQkFBa0IsRUFBekI7QUFDSDtBQUNELGFBQU9DLFNBQVMsQ0FBRUssUUFBRixFQUFhSyxNQUFiLEVBQXNCLEVBQUNDLElBQUksRUFBQ0EsSUFBTixFQUF0QixDQUFoQjtBQUNIOztBQUVEOzs7Ozs7QUFNU0QsSUFBQUEsTSxFQUFPO0FBQ1osVUFBRyxLQUFLTCxRQUFMLElBQWUsS0FBS0wsU0FBdkIsRUFBa0M7QUFDOUIsWUFBSVcsSUFBSSxHQUFHLEtBQUtOLFFBQUwsQ0FBY0YsUUFBZCxDQUFYO0FBQ0EsWUFBSSxDQUFDUSxJQUFMLEVBQVc7QUFDUEEsVUFBQUEsSUFBSSxhQUFNWixrQkFBa0IsRUFBeEIsTUFBSjtBQUNBLGNBQUk7QUFDQWEsWUFBQUEsTUFBTSxDQUFDQyxjQUFQLENBQXNCLEtBQUtSLFFBQTNCLEVBQXFDRixRQUFyQyxFQUErQztBQUMzQ1csY0FBQUEsWUFBWSxFQUFFLEtBRDZCO0FBRTNDQyxjQUFBQSxVQUFVLEVBQUUsS0FGK0I7QUFHM0NDLGNBQUFBLEtBQUssRUFBRUwsSUFIb0MsRUFBL0M7O0FBS0gsV0FORCxDQU1FLE9BQU9NLENBQVAsRUFBVTs7QUFFWDtBQUNKO0FBQ0QsWUFBRyxLQUFLWixRQUFMLENBQWNGLFFBQWQsS0FBeUIsS0FBS0ksYUFBakMsRUFBZ0Q7QUFDNUMsY0FBRyxDQUFDLEtBQUtELFVBQUwsQ0FBZ0JZLEdBQWhCLENBQW9CLEtBQUtiLFFBQUwsQ0FBY0YsUUFBZCxDQUFwQixDQUFKLEVBQWtEO0FBQzlDLGlCQUFLRyxVQUFMLENBQWdCYSxHQUFoQixDQUFxQixLQUFLZCxRQUFMLENBQWNGLFFBQWQsQ0FBckIsRUFBK0MsS0FBS2lCLFdBQUwsQ0FBaUIsS0FBS2YsUUFBdEIsRUFBK0JLLE1BQS9CLENBQS9DLEVBQXNGLEtBQUtILGFBQTNGO0FBQ0g7QUFDRCxpQkFBTyxLQUFLRCxVQUFMLENBQWdCZSxHQUFoQixDQUFvQixLQUFLaEIsUUFBTCxDQUFjRixRQUFkLENBQXBCLENBQVA7QUFDSCxTQUxEO0FBTUksZUFBTyxLQUFLaUIsV0FBTCxDQUFpQixLQUFLZixRQUF0QixFQUErQkssTUFBL0IsQ0FBUDtBQUNQO0FBQ0QsVUFBSVksU0FBUyxHQUFHcEIsRUFBRSxDQUFDcUIsYUFBSCxDQUFrQixLQUFLbEIsUUFBdkIsQ0FBaEI7QUFDQSxhQUFPO0FBQ0hILFFBQUFBLEVBQUUsRUFBQ29CLFNBREE7QUFFSEUsUUFBQUEsUUFBUSxFQUFDLEtBQUtuQixRQUZYLEVBQVA7OztBQUtILEsscURBckVnQkQsZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Z2VuZXJhdGVSYW5kb21IYXNoLCB3cmFwU2NvcGV9IGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQgTWFsaWJ1bkNhY2hlIGZyb20gXCIuL01hbGlidW5DYWNoZVwiO1xuaW1wb3J0IHZtIGZyb20gXCJ2bVwiO1xuXG5jb25zdCBIQVNIX0tFWSA9ICdfX3ZtUnVubmVySGFzaCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZNUnVubmVyQ29udGV4dHtcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICB0aGlzLnNjb3BlT2JqID0gbnVsbDtcbiAgICAgICAgdGhpcy53cmFwU2NvcGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zY29wZUNhY2hlID0gbmV3IE1hbGlidW5DYWNoZSgpO1xuICAgICAgICB0aGlzLnNjb3BlQ2FjaGVUdGwgPSAxMCo2MCoxMDAwO1xuICAgIH1cblxuICAgIC8qKkByZXR1cm5zIHt0aGlzfSovXG4gICAgd2l0aFNjb3BlT2JqKHNjb3BlKXtcbiAgICAgICAgdGhpcy5zY29wZU9iaiA9IHNjb3BlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipAcmV0dXJucyB7dGhpc30qL1xuICAgIHdpdGhXcmFwU2NvcGUod3JhcD10cnVlKXtcbiAgICAgICAgdGhpcy53cmFwU2NvcGU9d3JhcDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqQHJldHVybnMge3RoaXN9Ki9cbiAgICB3aXRoU2NvcGVDYWNoZVR0bChzY29wZUNhY2hlVHRsKXtcbiAgICAgICAgdGhpcy5zY29wZUNhY2hlVHRsID0gc2NvcGVDYWNoZVR0bDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZG9XcmFwU2NvcGUoc2NvcGVPYmoscnVubmVyKXtcbiAgICAgICAgbGV0IGhhc2ggPSBzY29wZU9ialtIQVNIX0tFWV07XG4gICAgICAgIGlmKCFoYXNoKXtcbiAgICAgICAgICAgIGhhc2ggPSBnZW5lcmF0ZVJhbmRvbUhhc2goKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB3cmFwU2NvcGUoIHNjb3BlT2JqICwgcnVubmVyICwge2hhc2g6aGFzaH0gKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge1ZNUnVubmVyfSBydW5uZXJcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBzY29wZVxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IHNjb3BlLnZtXG4gICAgICogQHJldHVybnMge09iamVjdH0gc2NvcGUub3JpZ2luYWxcbiAgICAgKi9cbiAgICBnZXRTY29wZShydW5uZXIpe1xuICAgICAgICBpZih0aGlzLnNjb3BlT2JqJiZ0aGlzLndyYXBTY29wZSkge1xuICAgICAgICAgICAgbGV0IGhhc2ggPSB0aGlzLnNjb3BlT2JqW0hBU0hfS0VZXTtcbiAgICAgICAgICAgIGlmICghaGFzaCkge1xuICAgICAgICAgICAgICAgIGhhc2ggPSBgJHtnZW5lcmF0ZVJhbmRvbUhhc2goKX06YDtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5zY29wZU9iaiwgSEFTSF9LRVksIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBoYXNoXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHRoaXMuc2NvcGVPYmpbSEFTSF9LRVldJiZ0aGlzLnNjb3BlQ2FjaGVUdGwpIHtcbiAgICAgICAgICAgICAgICBpZighdGhpcy5zY29wZUNhY2hlLmhhcyh0aGlzLnNjb3BlT2JqW0hBU0hfS0VZXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY29wZUNhY2hlLnNldCggdGhpcy5zY29wZU9ialtIQVNIX0tFWV0gLCB0aGlzLmRvV3JhcFNjb3BlKHRoaXMuc2NvcGVPYmoscnVubmVyKSx0aGlzLnNjb3BlQ2FjaGVUdGwgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2NvcGVDYWNoZS5nZXQodGhpcy5zY29wZU9ialtIQVNIX0tFWV0pO1xuICAgICAgICAgICAgfWVsc2VcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5kb1dyYXBTY29wZSh0aGlzLnNjb3BlT2JqLHJ1bm5lcik7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHZtQ29udGV4dCA9IHZtLmNyZWF0ZUNvbnRleHQoIHRoaXMuc2NvcGVPYmogKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHZtOnZtQ29udGV4dCxcbiAgICAgICAgICAgIG9yaWdpbmFsOnRoaXMuc2NvcGVPYmpcbiAgICAgICAgfVxuXG4gICAgfVxufSJdfQ==