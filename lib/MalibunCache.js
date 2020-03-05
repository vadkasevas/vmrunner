"use strict";var _interopRequireDefault3 = require("@babel/runtime/helpers/interopRequireDefault");var _interopRequireDefault2 = _interopRequireDefault3(require("@babel/runtime/helpers/interopRequireDefault"));Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = undefined;var _classCallCheck2 = require("@babel/runtime/helpers/classCallCheck");var _classCallCheck = (0, _interopRequireDefault2["default"])(_classCallCheck2)["default"];var _createClass2 = require("@babel/runtime/helpers/createClass");var _createClass = (0, _interopRequireDefault2["default"])(_createClass2)["default"];var _possibleConstructorReturn2 = require("@babel/runtime/helpers/possibleConstructorReturn");var _possibleConstructorReturn = (0, _interopRequireDefault2["default"])(_possibleConstructorReturn2)["default"];var _getPrototypeOf2 = require("@babel/runtime/helpers/getPrototypeOf");var _getPrototypeOf = (0, _interopRequireDefault2["default"])(_getPrototypeOf2)["default"];var _inherits2 = require("@babel/runtime/helpers/inherits");var _inherits = (0, _interopRequireDefault2["default"])(_inherits2)["default"];var _events = require("events");var EventEmitter = (0, _interopRequireDefault2["default"])(_events)["default"];
var _underscore = require("underscore");var _ = (0, _interopRequireDefault2["default"])(_underscore)["default"];var

MalibunCache = /*#__PURE__*/function (_EventEmitter) {_inherits(MalibunCache, _EventEmitter);
  function MalibunCache() {var _this;_classCallCheck(this, MalibunCache);
    _this = _possibleConstructorReturn(this, _getPrototypeOf(MalibunCache).call(this));
    _this.setMaxListeners(0);
    _this.store = {};return _this;
  }_createClass(MalibunCache, [{ key: "has", value: function has(

    key) {
      return this.store[key] !== undefined;
    }

    /**
       * Insert or overwrite data
       *
       * @param {string} key
       * @param  value
       * @param {number} ttl   Time to live in milliseconds (optional)
       */ }, { key: "set", value: function set(
    key, value, ttl) {var _this2 = this;
      if (typeof key === 'undefined') throw new Error('Required argument key is undefined');
      var oldRecord = this.has(key) ? this.store[key] : undefined;
      if (oldRecord && oldRecord.timeout) {
        clearTimeout(oldRecord.timeout);
      }

      // Set value + timeout on new record
      var record = { value: value };
      if (typeof ttl === 'number' && ttl > 0) {
        record.timeout = setTimeout(function () {
          _this2.del(key);
        }, ttl);
      }
      this.store[key] = record;

      // Emit update/set events
      var action = oldRecord ? 'update' : 'set';
      this.emit(action, key, value, ttl);
      this.emit(action + ':' + key, value, ttl);
    } }, { key: "get",

    /**
                        * Get cached data
                        *
                        * @param {string} key
                        * @param {function} callback  Return value in callback if records exists locally or on external resource (optional)
                        * @return {mixed} value Only returned if callback is undefined
                        */value: function get(
    key) {
      if (typeof key === 'undefined')
      throw new Error('Required argument key is undefined');
      var record = this.store[key];
      if (record) {
        return record.value;
      }
    } }, { key: "del",

    /**
                        * Delete cached data
                        *
                        * @param {string} key
                        * @return {boolean} Returns true if record existed
                        */value: function del(
    key) {
      if (typeof key === 'undefined') throw new Error('Required argument key is undefined');
      if (this.has(key)) {
        if (this.store[key].timeout) {
          clearTimeout(this.store[key].timeout);
        }
        delete this.store[key];
        this.emit('del', key);
        this.emit('del:' + key);
        return true;
      } else {
        return false;
      }
    }

    /**
       * Clear cached data
       *
       * @return {number} Returns number of cleared records
       */ }, { key: "clear", value: function clear()
    {var _this3 = this;
      var size = this.size();
      _.each(_.keys(this.store), function (key) {
        _this3.del(key);
      });
      this.store = {};
      this.emit('clear', size);
      return size;
    } }, { key: "size",

    /**
                         * Retrieve number of records
                         *
                         * @return {number}
                         */value: function size()
    {
      return _.size(this.store);
    } }, { key: "debug",

    /**
                          * Retrieve internal store
                          *
                          * @return {object}
                          */value: function debug()
    {
      return this.store;
    } }]);return MalibunCache;}(EventEmitter);exports["default"] = MalibunCache;




;
//# sourceMappingURL=MalibunCache.js.map