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
//# sourceMappingURL=VMRunnerContext.js.map