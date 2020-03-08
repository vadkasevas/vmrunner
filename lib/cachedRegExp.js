"use strict";var _interopRequireDefault3 = require("@babel/runtime/helpers/interopRequireDefault");var _interopRequireDefault2 = _interopRequireDefault3(require("@babel/runtime/helpers/interopRequireDefault"));Object.defineProperty(exports, "__esModule", { value: true });exports["default"] =


cachedRegExp;var _MalibunCache = require("./MalibunCache");var MalibunCache = (0, _interopRequireDefault2["default"])(_MalibunCache)["default"];var cache = new MalibunCache();function cachedRegExp(pattern, options) {
  if (pattern instanceof RegExp) {
    var key = pattern.toString();
    if (!cache.has(key)) {
      cache.set(key, pattern, 60 * 1000);
      return pattern;
    } else {
      var result = cache.get(key);
      result.lastIndex = 0;
      return result;
    }
  } else {
    var key = "".concat(pattern, ":").concat(options || '');
    if (!cache.has(key)) {
      var re = new RegExp(pattern, options);
      cache.set(key, re, 60 * 1000);
      return re;
    } else {
      var result = cache.get(key);
      result.lastIndex = 0;
      return result;
    }
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jYWNoZWRSZWdFeHAuanMiXSwibmFtZXMiOlsiY2FjaGVkUmVnRXhwIiwiTWFsaWJ1bkNhY2hlIiwiY2FjaGUiLCJwYXR0ZXJuIiwib3B0aW9ucyIsIlJlZ0V4cCIsImtleSIsInRvU3RyaW5nIiwiaGFzIiwic2V0IiwicmVzdWx0IiwiZ2V0IiwibGFzdEluZGV4IiwicmUiXSwibWFwcGluZ3MiOiI7OztBQUd3QkEsWSxDQUZ4Qiw4QyxJQUFPQyxZLHFFQURQLElBQUlDLEtBQUssR0FBRyxJQUFJRCxZQUFKLEVBQVosQ0FHZSxTQUFTRCxZQUFULENBQXNCRyxPQUF0QixFQUE4QkMsT0FBOUIsRUFBc0M7QUFDakQsTUFBR0QsT0FBTyxZQUFZRSxNQUF0QixFQUE2QjtBQUN6QixRQUFJQyxHQUFHLEdBQUdILE9BQU8sQ0FBQ0ksUUFBUixFQUFWO0FBQ0EsUUFBSSxDQUFDTCxLQUFLLENBQUNNLEdBQU4sQ0FBVUYsR0FBVixDQUFMLEVBQXFCO0FBQ2pCSixNQUFBQSxLQUFLLENBQUNPLEdBQU4sQ0FBVUgsR0FBVixFQUFlSCxPQUFmLEVBQXdCLEtBQUssSUFBN0I7QUFDQSxhQUFPQSxPQUFQO0FBQ0gsS0FIRCxNQUdPO0FBQ0gsVUFBSU8sTUFBTSxHQUFHUixLQUFLLENBQUNTLEdBQU4sQ0FBVUwsR0FBVixDQUFiO0FBQ0FJLE1BQUFBLE1BQU0sQ0FBQ0UsU0FBUCxHQUFtQixDQUFuQjtBQUNBLGFBQU9GLE1BQVA7QUFDSDtBQUNKLEdBVkQsTUFVTTtBQUNGLFFBQUlKLEdBQUcsYUFBTUgsT0FBTixjQUFpQkMsT0FBTyxJQUFJLEVBQTVCLENBQVA7QUFDQSxRQUFJLENBQUNGLEtBQUssQ0FBQ00sR0FBTixDQUFVRixHQUFWLENBQUwsRUFBcUI7QUFDakIsVUFBSU8sRUFBRSxHQUFHLElBQUlSLE1BQUosQ0FBV0YsT0FBWCxFQUFvQkMsT0FBcEIsQ0FBVDtBQUNBRixNQUFBQSxLQUFLLENBQUNPLEdBQU4sQ0FBVUgsR0FBVixFQUFlTyxFQUFmLEVBQW1CLEtBQUssSUFBeEI7QUFDQSxhQUFPQSxFQUFQO0FBQ0gsS0FKRCxNQUlPO0FBQ0gsVUFBSUgsTUFBTSxHQUFHUixLQUFLLENBQUNTLEdBQU4sQ0FBVUwsR0FBVixDQUFiO0FBQ0FJLE1BQUFBLE1BQU0sQ0FBQ0UsU0FBUCxHQUFtQixDQUFuQjtBQUNBLGFBQU9GLE1BQVA7QUFDSDtBQUNKO0FBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgY2FjaGUgPSBuZXcgTWFsaWJ1bkNhY2hlKCk7XG5pbXBvcnQgTWFsaWJ1bkNhY2hlIGZyb20gXCIuL01hbGlidW5DYWNoZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjYWNoZWRSZWdFeHAocGF0dGVybixvcHRpb25zKXtcbiAgICBpZihwYXR0ZXJuIGluc3RhbmNlb2YgUmVnRXhwKXtcbiAgICAgICAgdmFyIGtleSA9IHBhdHRlcm4udG9TdHJpbmcoKTtcbiAgICAgICAgaWYgKCFjYWNoZS5oYXMoa2V5KSkge1xuICAgICAgICAgICAgY2FjaGUuc2V0KGtleSwgcGF0dGVybiwgNjAgKiAxMDAwKTtcbiAgICAgICAgICAgIHJldHVybiBwYXR0ZXJuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGNhY2hlLmdldChrZXkpO1xuICAgICAgICAgICAgcmVzdWx0Lmxhc3RJbmRleCA9IDA7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgfWVsc2Uge1xuICAgICAgICB2YXIga2V5ID0gYCR7cGF0dGVybn06JHtvcHRpb25zIHx8ICcnfWA7XG4gICAgICAgIGlmICghY2FjaGUuaGFzKGtleSkpIHtcbiAgICAgICAgICAgIHZhciByZSA9IG5ldyBSZWdFeHAocGF0dGVybiwgb3B0aW9ucyk7XG4gICAgICAgICAgICBjYWNoZS5zZXQoa2V5LCByZSwgNjAgKiAxMDAwKTtcbiAgICAgICAgICAgIHJldHVybiByZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBjYWNoZS5nZXQoa2V5KTtcbiAgICAgICAgICAgIHJlc3VsdC5sYXN0SW5kZXggPSAwO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbiJdfQ==