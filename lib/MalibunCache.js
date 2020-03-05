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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9NYWxpYnVuQ2FjaGUuanMiXSwibmFtZXMiOlsiRXZlbnRFbWl0dGVyIiwiXyIsIk1hbGlidW5DYWNoZSIsInNldE1heExpc3RlbmVycyIsInN0b3JlIiwia2V5IiwidW5kZWZpbmVkIiwidmFsdWUiLCJ0dGwiLCJFcnJvciIsIm9sZFJlY29yZCIsImhhcyIsInRpbWVvdXQiLCJjbGVhclRpbWVvdXQiLCJyZWNvcmQiLCJzZXRUaW1lb3V0IiwiZGVsIiwiYWN0aW9uIiwiZW1pdCIsInNpemUiLCJlYWNoIiwia2V5cyJdLCJtYXBwaW5ncyI6InNtQ0FBQSxnQyxJQUFPQSxZO0FBQ1Asd0MsSUFBT0MsQzs7QUFFY0MsWTtBQUNqQiwwQkFBYTtBQUNUO0FBQ0EsVUFBS0MsZUFBTCxDQUFxQixDQUFyQjtBQUNBLFVBQUtDLEtBQUwsR0FBYSxFQUFiLENBSFM7QUFJWixHOztBQUVHQyxJQUFBQSxHLEVBQUk7QUFDSixhQUFPLEtBQUtELEtBQUwsQ0FBV0MsR0FBWCxNQUFrQkMsU0FBekI7QUFDSDs7QUFFRDs7Ozs7OztBQU9JRCxJQUFBQSxHLEVBQUtFLEssRUFBT0MsRyxFQUFJO0FBQ2hCLFVBQUcsT0FBT0gsR0FBUCxLQUFlLFdBQWxCLEVBQStCLE1BQU0sSUFBSUksS0FBSixDQUFVLG9DQUFWLENBQU47QUFDL0IsVUFBSUMsU0FBUyxHQUFHLEtBQUtDLEdBQUwsQ0FBU04sR0FBVCxJQUFlLEtBQUtELEtBQUwsQ0FBV0MsR0FBWCxDQUFmLEdBQWlDQyxTQUFqRDtBQUNBLFVBQUdJLFNBQVMsSUFBSUEsU0FBUyxDQUFDRSxPQUExQixFQUFrQztBQUM5QkMsUUFBQUEsWUFBWSxDQUFDSCxTQUFTLENBQUNFLE9BQVgsQ0FBWjtBQUNIOztBQUVEO0FBQ0EsVUFBSUUsTUFBTSxHQUFHLEVBQUNQLEtBQUssRUFBRUEsS0FBUixFQUFiO0FBQ0EsVUFBRyxPQUFPQyxHQUFQLEtBQWUsUUFBZixJQUF5QkEsR0FBRyxHQUFDLENBQWhDLEVBQWtDO0FBQzlCTSxRQUFBQSxNQUFNLENBQUNGLE9BQVAsR0FBaUJHLFVBQVUsQ0FBQyxZQUFJO0FBQzVCLFVBQUEsTUFBSSxDQUFDQyxHQUFMLENBQVNYLEdBQVQ7QUFDSCxTQUYwQixFQUV6QkcsR0FGeUIsQ0FBM0I7QUFHSDtBQUNELFdBQUtKLEtBQUwsQ0FBV0MsR0FBWCxJQUFrQlMsTUFBbEI7O0FBRUE7QUFDQSxVQUFJRyxNQUFNLEdBQUdQLFNBQVMsR0FBRSxRQUFGLEdBQWEsS0FBbkM7QUFDQSxXQUFLUSxJQUFMLENBQVVELE1BQVYsRUFBa0JaLEdBQWxCLEVBQXVCRSxLQUF2QixFQUE4QkMsR0FBOUI7QUFDQSxXQUFLVSxJQUFMLENBQVVELE1BQU0sR0FBRyxHQUFULEdBQWVaLEdBQXpCLEVBQThCRSxLQUE5QixFQUFxQ0MsR0FBckM7QUFDSCxLOztBQUVEOzs7Ozs7O0FBT0lILElBQUFBLEcsRUFBSTtBQUNKLFVBQUcsT0FBT0EsR0FBUCxLQUFlLFdBQWxCO0FBQ0ksWUFBTSxJQUFJSSxLQUFKLENBQVUsb0NBQVYsQ0FBTjtBQUNKLFVBQUlLLE1BQU0sR0FBRyxLQUFLVixLQUFMLENBQVdDLEdBQVgsQ0FBYjtBQUNBLFVBQUdTLE1BQUgsRUFBVTtBQUNOLGVBQU9BLE1BQU0sQ0FBQ1AsS0FBZDtBQUNIO0FBQ0osSzs7QUFFRDs7Ozs7O0FBTUlGLElBQUFBLEcsRUFBSTtBQUNKLFVBQUcsT0FBT0EsR0FBUCxLQUFlLFdBQWxCLEVBQStCLE1BQU0sSUFBSUksS0FBSixDQUFVLG9DQUFWLENBQU47QUFDL0IsVUFBRyxLQUFLRSxHQUFMLENBQVNOLEdBQVQsQ0FBSCxFQUFpQjtBQUNiLFlBQUcsS0FBS0QsS0FBTCxDQUFXQyxHQUFYLEVBQWdCTyxPQUFuQixFQUEyQjtBQUN2QkMsVUFBQUEsWUFBWSxDQUFDLEtBQUtULEtBQUwsQ0FBV0MsR0FBWCxFQUFnQk8sT0FBakIsQ0FBWjtBQUNIO0FBQ0QsZUFBTyxLQUFLUixLQUFMLENBQVdDLEdBQVgsQ0FBUDtBQUNBLGFBQUthLElBQUwsQ0FBVSxLQUFWLEVBQWlCYixHQUFqQjtBQUNBLGFBQUthLElBQUwsQ0FBVSxTQUFTYixHQUFuQjtBQUNBLGVBQU8sSUFBUDtBQUNILE9BUkQsTUFRSztBQUNELGVBQU8sS0FBUDtBQUNIO0FBQ0o7O0FBRUQ7Ozs7O0FBS087QUFDSCxVQUFJYyxJQUFJLEdBQUcsS0FBS0EsSUFBTCxFQUFYO0FBQ0FsQixNQUFBQSxDQUFDLENBQUNtQixJQUFGLENBQU9uQixDQUFDLENBQUNvQixJQUFGLENBQU8sS0FBS2pCLEtBQVosQ0FBUCxFQUEwQixVQUFDQyxHQUFELEVBQU87QUFDN0IsUUFBQSxNQUFJLENBQUNXLEdBQUwsQ0FBU1gsR0FBVDtBQUNILE9BRkQ7QUFHQSxXQUFLRCxLQUFMLEdBQWEsRUFBYjtBQUNBLFdBQUtjLElBQUwsQ0FBVSxPQUFWLEVBQW1CQyxJQUFuQjtBQUNBLGFBQU9BLElBQVA7QUFDSCxLOztBQUVEOzs7OztBQUtNO0FBQ0YsYUFBT2xCLENBQUMsQ0FBQ2tCLElBQUYsQ0FBTyxLQUFLZixLQUFaLENBQVA7QUFDSCxLOztBQUVEOzs7OztBQUtPO0FBQ0gsYUFBTyxLQUFLQSxLQUFaO0FBQ0gsSywyQkE1R3FDSixZLHVCQUFyQkUsWTs7Ozs7QUFpSHBCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICdldmVudHMnO1xuaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hbGlidW5DYWNoZSBleHRlbmRzIEV2ZW50RW1pdHRlcntcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnNldE1heExpc3RlbmVycygwKTtcbiAgICAgICAgdGhpcy5zdG9yZSA9IHt9O1xuICAgIH1cblxuICAgIGhhcyhrZXkpe1xuICAgICAgICByZXR1cm4gdGhpcy5zdG9yZVtrZXldIT09dW5kZWZpbmVkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluc2VydCBvciBvdmVyd3JpdGUgZGF0YVxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleVxuICAgICAqIEBwYXJhbSAgdmFsdWVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdHRsICAgVGltZSB0byBsaXZlIGluIG1pbGxpc2Vjb25kcyAob3B0aW9uYWwpXG4gICAgICovXG4gICAgc2V0KGtleSwgdmFsdWUsIHR0bCl7XG4gICAgICAgIGlmKHR5cGVvZiBrZXkgPT09ICd1bmRlZmluZWQnKSB0aHJvdyBuZXcgRXJyb3IoJ1JlcXVpcmVkIGFyZ3VtZW50IGtleSBpcyB1bmRlZmluZWQnKTtcbiAgICAgICAgdmFyIG9sZFJlY29yZCA9IHRoaXMuaGFzKGtleSk/IHRoaXMuc3RvcmVba2V5XSA6IHVuZGVmaW5lZDtcbiAgICAgICAgaWYob2xkUmVjb3JkICYmIG9sZFJlY29yZC50aW1lb3V0KXtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dChvbGRSZWNvcmQudGltZW91dCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZXQgdmFsdWUgKyB0aW1lb3V0IG9uIG5ldyByZWNvcmRcbiAgICAgICAgdmFyIHJlY29yZCA9IHt2YWx1ZTogdmFsdWV9O1xuICAgICAgICBpZih0eXBlb2YgdHRsID09PSAnbnVtYmVyJyYmdHRsPjApe1xuICAgICAgICAgICAgcmVjb3JkLnRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpPT57XG4gICAgICAgICAgICAgICAgdGhpcy5kZWwoa2V5KTtcbiAgICAgICAgICAgIH0sdHRsKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0b3JlW2tleV0gPSByZWNvcmQ7XG5cbiAgICAgICAgLy8gRW1pdCB1cGRhdGUvc2V0IGV2ZW50c1xuICAgICAgICB2YXIgYWN0aW9uID0gb2xkUmVjb3JkPyAndXBkYXRlJyA6ICdzZXQnO1xuICAgICAgICB0aGlzLmVtaXQoYWN0aW9uLCBrZXksIHZhbHVlLCB0dGwpO1xuICAgICAgICB0aGlzLmVtaXQoYWN0aW9uICsgJzonICsga2V5LCB2YWx1ZSwgdHRsKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogR2V0IGNhY2hlZCBkYXRhXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5XG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgIFJldHVybiB2YWx1ZSBpbiBjYWxsYmFjayBpZiByZWNvcmRzIGV4aXN0cyBsb2NhbGx5IG9yIG9uIGV4dGVybmFsIHJlc291cmNlIChvcHRpb25hbClcbiAgICAgKiBAcmV0dXJuIHttaXhlZH0gdmFsdWUgT25seSByZXR1cm5lZCBpZiBjYWxsYmFjayBpcyB1bmRlZmluZWRcbiAgICAgKi9cbiAgICBnZXQoa2V5KXtcbiAgICAgICAgaWYodHlwZW9mIGtleSA9PT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlcXVpcmVkIGFyZ3VtZW50IGtleSBpcyB1bmRlZmluZWQnKTtcbiAgICAgICAgdmFyIHJlY29yZCA9IHRoaXMuc3RvcmVba2V5XTtcbiAgICAgICAgaWYocmVjb3JkKXtcbiAgICAgICAgICAgIHJldHVybiByZWNvcmQudmFsdWU7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRGVsZXRlIGNhY2hlZCBkYXRhXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5XG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gUmV0dXJucyB0cnVlIGlmIHJlY29yZCBleGlzdGVkXG4gICAgICovXG4gICAgZGVsKGtleSl7XG4gICAgICAgIGlmKHR5cGVvZiBrZXkgPT09ICd1bmRlZmluZWQnKSB0aHJvdyBuZXcgRXJyb3IoJ1JlcXVpcmVkIGFyZ3VtZW50IGtleSBpcyB1bmRlZmluZWQnKTtcbiAgICAgICAgaWYodGhpcy5oYXMoa2V5KSl7XG4gICAgICAgICAgICBpZih0aGlzLnN0b3JlW2tleV0udGltZW91dCl7XG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuc3RvcmVba2V5XS50aW1lb3V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnN0b3JlW2tleV07XG4gICAgICAgICAgICB0aGlzLmVtaXQoJ2RlbCcsIGtleSk7XG4gICAgICAgICAgICB0aGlzLmVtaXQoJ2RlbDonICsga2V5KTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENsZWFyIGNhY2hlZCBkYXRhXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IFJldHVybnMgbnVtYmVyIG9mIGNsZWFyZWQgcmVjb3Jkc1xuICAgICAqL1xuICAgIGNsZWFyKCl7XG4gICAgICAgIHZhciBzaXplID0gdGhpcy5zaXplKCk7XG4gICAgICAgIF8uZWFjaChfLmtleXModGhpcy5zdG9yZSksKGtleSk9PntcbiAgICAgICAgICAgIHRoaXMuZGVsKGtleSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnN0b3JlID0ge307XG4gICAgICAgIHRoaXMuZW1pdCgnY2xlYXInLCBzaXplKTtcbiAgICAgICAgcmV0dXJuIHNpemU7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlIG51bWJlciBvZiByZWNvcmRzXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAgICovXG4gICAgc2l6ZSgpe1xuICAgICAgICByZXR1cm4gXy5zaXplKHRoaXMuc3RvcmUpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZSBpbnRlcm5hbCBzdG9yZVxuICAgICAqXG4gICAgICogQHJldHVybiB7b2JqZWN0fVxuICAgICAqL1xuICAgIGRlYnVnKCl7XG4gICAgICAgIHJldHVybiB0aGlzLnN0b3JlO1xuICAgIH07XG5cblxuXG5cbn07Il19