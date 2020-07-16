"use strict";var _interopRequireDefault3 = require("@babel/runtime/helpers/interopRequireDefault");var _interopRequireDefault2 = _interopRequireDefault3(require("@babel/runtime/helpers/interopRequireDefault"));var _regenerator = require("@babel/runtime/regenerator");var _regeneratorRuntime = (0, _interopRequireDefault2["default"])(_regenerator)["default"];var _index = require("./index");var VMRunner = _index.VMRunner;var VMRunnerContext = _index.VMRunnerContext;
function vmCodeFrame(expression, line) {
  var codeFrameColumns = require('@babel/code-frame').codeFrameColumns;
  if (expression) {
    var location = { start: { line: line, column: null } };
    var result = codeFrameColumns(expression, location, { linesAbove: 5 });
    return result;
  }
  return '';
}
var _ = require('underscore');

var f = function f() {var context, runner, result, promises, j, i, results;return _regeneratorRuntime.async(function f$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
          context = new VMRunnerContext().
          withScopeObj({
            Object: Object,
            //Function,
            Array: Array,
            Number: Number,
            parseFloat: parseFloat,
            parseInt: parseInt,
            'Infinity': Infinity,
            'NaN': NaN,
            'undefined': void 0,
            'Boolean': Boolean,
            'String': String,
            'Symbol': Symbol,
            'Date': Date,
            'RegExp': RegExp,
            'Error': Error,
            'EvalError': EvalError,
            'RangeError': RangeError,
            'ReferenceError': ReferenceError,
            'SyntaxError': SyntaxError,
            'TypeError': TypeError,
            'URIError': URIError,
            'JSON': JSON,
            'Math': Math,
            'console': console,
            'Intl': Intl,
            'ArrayBuffer': ArrayBuffer,
            'Uint8Array': Uint8Array,
            'Int8Array': Int8Array,
            'Uint16Array': Uint16Array,
            'Int16Array': Int16Array,
            'Uint32Array': Uint32Array,
            'Int32Array': Int32Array,
            'Float32Array': Float32Array,
            'Float64Array': Float64Array,
            'Uint8ClampedArray': Uint8ClampedArray,
            'DataView': DataView,
            'Map': Map,
            'Set': Set,
            'WeakMap': WeakMap,
            'WeakSet': WeakSet,
            'Proxy': Proxy,
            'Reflect': Reflect,
            'decodeURI': decodeURI,
            'decodeURIComponent': decodeURIComponent,
            'encodeURI': encodeURI,
            'encodeURIComponent': encodeURIComponent,
            'escape': escape,
            'unescape': unescape,
            'isFinite': isFinite,
            'isNaN': isNaN,
            'WebAssembly': WebAssembly,
            'Buffer': Buffer,
            'clearImmediate': clearImmediate,
            'clearInterval': clearInterval,
            'clearTimeout': clearTimeout,
            'setImmediate': setImmediate,
            'setInterval': setInterval,
            'setTimeout': setTimeout,
            Promise: Promise,
            vmCodeFrame: vmCodeFrame,
            _: _ });

          runner = new VMRunner(context).withThrow(true);_context.next = 4;return _regeneratorRuntime.awrap(

          runner.run("\n    class Test{\n        test(){\n            this.value();\n        }\n        \n        value(){\n            return 1;\n        }\n    }\n    \n    const test = new Test();\n    test.test();\n    \n    ",













          {}));case 4:result = _context.sent;

          console.log(result);

          promises = [];
          for (j = 0; j < 2000; j++) {
            i = _.random(0, 1000);
            (function (i) {
              var expression = "\n                        //console.log('vm2Options:',_.size(vm2Options));\n                        //i".concat(

              i, "\n                        var i = ").concat(
              i, ";\n                        trace:i,vm2Expression,VM_RUNNER_HASH;\n                        return {i,VM_RUNNER_HASH};\n                        return new Promise((resolve,reject)=>{\n                            if( vm2Expression.indexOf('//i").concat(



              i, "') ==-1){\n                                throw new Error(vm2Expression);\n                            }\n                            setTimeout( ()=>{\n                                return resolve({i,VM_RUNNER_HASH});\n                            },_.random(0,100))\n                        });\n                        ");







              var promise = runner.run(expression, {}, {
                trace: {
                  aliases: {
                    trace: function trace(message) {
                      if (expression !== message.data.vm2Expression) {
                        console.error("".concat(message.data.vm2Expression));
                      }
                      if (message.data.i !== i) {
                        console.error("".concat(message.data.i, "!==").concat(i));
                      }
                    } } } });




              promise.then(function (vmResult) {
                vmResult.realI = i;
                //console.log (`vmResult:${JSON.stringify(vmResult)}, i:${i}`);
              });
              promises.push(promise);
            })(i);
          }_context.next = 10;return _regeneratorRuntime.awrap(
          Promise.all(promises));case 10:results = _context.sent;
          //global.gc();
          console.log(JSON.stringify(results));case 12:case "end":return _context.stop();}}});};

setInterval(function () {
  f();
}, 1 * 1000);
f();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kZXYuanMiXSwibmFtZXMiOlsiVk1SdW5uZXIiLCJWTVJ1bm5lckNvbnRleHQiLCJ2bUNvZGVGcmFtZSIsImV4cHJlc3Npb24iLCJsaW5lIiwiY29kZUZyYW1lQ29sdW1ucyIsInJlcXVpcmUiLCJsb2NhdGlvbiIsInN0YXJ0IiwiY29sdW1uIiwicmVzdWx0IiwibGluZXNBYm92ZSIsIl8iLCJmIiwiY29udGV4dCIsIndpdGhTY29wZU9iaiIsIk9iamVjdCIsIkFycmF5IiwiTnVtYmVyIiwicGFyc2VGbG9hdCIsInBhcnNlSW50IiwiSW5maW5pdHkiLCJOYU4iLCJCb29sZWFuIiwiU3RyaW5nIiwiU3ltYm9sIiwiRGF0ZSIsIlJlZ0V4cCIsIkVycm9yIiwiRXZhbEVycm9yIiwiUmFuZ2VFcnJvciIsIlJlZmVyZW5jZUVycm9yIiwiU3ludGF4RXJyb3IiLCJUeXBlRXJyb3IiLCJVUklFcnJvciIsIkpTT04iLCJNYXRoIiwiY29uc29sZSIsIkludGwiLCJBcnJheUJ1ZmZlciIsIlVpbnQ4QXJyYXkiLCJJbnQ4QXJyYXkiLCJVaW50MTZBcnJheSIsIkludDE2QXJyYXkiLCJVaW50MzJBcnJheSIsIkludDMyQXJyYXkiLCJGbG9hdDMyQXJyYXkiLCJGbG9hdDY0QXJyYXkiLCJVaW50OENsYW1wZWRBcnJheSIsIkRhdGFWaWV3IiwiTWFwIiwiU2V0IiwiV2Vha01hcCIsIldlYWtTZXQiLCJQcm94eSIsIlJlZmxlY3QiLCJkZWNvZGVVUkkiLCJkZWNvZGVVUklDb21wb25lbnQiLCJlbmNvZGVVUkkiLCJlbmNvZGVVUklDb21wb25lbnQiLCJlc2NhcGUiLCJ1bmVzY2FwZSIsImlzRmluaXRlIiwiaXNOYU4iLCJXZWJBc3NlbWJseSIsIkJ1ZmZlciIsImNsZWFySW1tZWRpYXRlIiwiY2xlYXJJbnRlcnZhbCIsImNsZWFyVGltZW91dCIsInNldEltbWVkaWF0ZSIsInNldEludGVydmFsIiwic2V0VGltZW91dCIsIlByb21pc2UiLCJydW5uZXIiLCJ3aXRoVGhyb3ciLCJydW4iLCJsb2ciLCJwcm9taXNlcyIsImoiLCJpIiwicmFuZG9tIiwicHJvbWlzZSIsInRyYWNlIiwiYWxpYXNlcyIsIm1lc3NhZ2UiLCJkYXRhIiwidm0yRXhwcmVzc2lvbiIsImVycm9yIiwidGhlbiIsInZtUmVzdWx0IiwicmVhbEkiLCJwdXNoIiwiYWxsIiwicmVzdWx0cyIsInN0cmluZ2lmeSJdLCJtYXBwaW5ncyI6InNXQUFBLGdDLElBQVFBLFEsVUFBQUEsUSxLQUFVQyxlLFVBQUFBLGU7QUFDbEIsU0FBU0MsV0FBVCxDQUFzQkMsVUFBdEIsRUFBa0NDLElBQWxDLEVBQXdDO0FBQ3BDLE1BQUlDLGdCQUFnQixHQUFHQyxPQUFPLENBQUUsbUJBQUYsQ0FBUCxDQUE4QkQsZ0JBQXJEO0FBQ0EsTUFBSUYsVUFBSixFQUFnQjtBQUNaLFFBQUlJLFFBQVEsR0FBRyxFQUFDQyxLQUFLLEVBQUUsRUFBQ0osSUFBSSxFQUFFQSxJQUFQLEVBQWFLLE1BQU0sRUFBRSxJQUFyQixFQUFSLEVBQWY7QUFDQSxRQUFJQyxNQUFNLEdBQUdMLGdCQUFnQixDQUFFRixVQUFGLEVBQWNJLFFBQWQsRUFBd0IsRUFBQ0ksVUFBVSxFQUFFLENBQWIsRUFBeEIsQ0FBN0I7QUFDQSxXQUFPRCxNQUFQO0FBQ0g7QUFDRCxTQUFPLEVBQVA7QUFDSDtBQUNELElBQU1FLENBQUMsR0FBR04sT0FBTyxDQUFFLFlBQUYsQ0FBakI7O0FBRUEsSUFBSU8sQ0FBQyxHQUFHLFNBQUpBLENBQUk7QUFDQUMsVUFBQUEsT0FEQSxHQUNVLElBQUliLGVBQUo7QUFDYmMsVUFBQUEsWUFEYSxDQUNDO0FBQ1hDLFlBQUFBLE1BQU0sRUFBTkEsTUFEVztBQUVYO0FBQ0FDLFlBQUFBLEtBQUssRUFBTEEsS0FIVztBQUlYQyxZQUFBQSxNQUFNLEVBQU5BLE1BSlc7QUFLWEMsWUFBQUEsVUFBVSxFQUFWQSxVQUxXO0FBTVhDLFlBQUFBLFFBQVEsRUFBUkEsUUFOVztBQU9YLHdCQUFZQyxRQVBEO0FBUVgsbUJBQU9DLEdBUkk7QUFTWCx5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QyxJQUFSLENBQWFDLGFBQTlCO0FBQ0g7QUFDRCwwQkFBR0YsT0FBTyxDQUFDQyxJQUFSLENBQWFOLENBQWIsS0FBaUJBLENBQXBCLEVBQXNCO0FBQ2xCMUMsd0JBQUFBLE9BQU8sQ0FBQ2tELEtBQVIsV0FBaUJILE9BQU8sQ0FBQ0MsSUFBUixDQUFhTixDQUE5QixnQkFBcUNBLENBQXJDO0FBQ0g7QUFDSixxQkFSSSxFQUROLEVBRCtCLEVBQTVCLENBQWQ7Ozs7O0FBZUFFLGNBQUFBLE9BQU8sQ0FBQ08sSUFBUixDQUFjLFVBQUNDLFFBQUQsRUFBYztBQUN4QkEsZ0JBQUFBLFFBQVEsQ0FBQ0MsS0FBVCxHQUFpQlgsQ0FBakI7QUFDQTtBQUNILGVBSEQ7QUFJQUYsY0FBQUEsUUFBUSxDQUFDYyxJQUFULENBQWVWLE9BQWY7QUFDSCxhQXBDRCxFQW9DSUYsQ0FwQ0o7QUFxQ0gsV0E3SEc7QUE4SGdCUCxVQUFBQSxPQUFPLENBQUNvQixHQUFSLENBQWFmLFFBQWIsQ0E5SGhCLFVBOEhBZ0IsT0E5SEE7QUErSEo7QUFDQXhELFVBQUFBLE9BQU8sQ0FBQ3VDLEdBQVIsQ0FBYXpDLElBQUksQ0FBQzJELFNBQUwsQ0FBZ0JELE9BQWhCLENBQWIsRUFoSUksZ0RBQVI7O0FBa0lBdkIsV0FBVyxDQUFFLFlBQU07QUFDZnpELEVBQUFBLENBQUM7QUFDSixDQUZVLEVBRVIsSUFBSSxJQUZJLENBQVg7QUFHQUEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Vk1SdW5uZXIsIFZNUnVubmVyQ29udGV4dH0gZnJvbSBcIi4vaW5kZXhcIjtcbmZ1bmN0aW9uIHZtQ29kZUZyYW1lIChleHByZXNzaW9uLCBsaW5lKSB7XG4gICAgdmFyIGNvZGVGcmFtZUNvbHVtbnMgPSByZXF1aXJlICgnQGJhYmVsL2NvZGUtZnJhbWUnKS5jb2RlRnJhbWVDb2x1bW5zO1xuICAgIGlmIChleHByZXNzaW9uKSB7XG4gICAgICAgIHZhciBsb2NhdGlvbiA9IHtzdGFydDoge2xpbmU6IGxpbmUsIGNvbHVtbjogbnVsbH19O1xuICAgICAgICB2YXIgcmVzdWx0ID0gY29kZUZyYW1lQ29sdW1ucyAoZXhwcmVzc2lvbiwgbG9jYXRpb24sIHtsaW5lc0Fib3ZlOiA1fSk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIHJldHVybiAnJztcbn1cbmNvbnN0IF8gPSByZXF1aXJlICgndW5kZXJzY29yZScpO1xuXG52YXIgZiA9IGFzeW5jICgpID0+IHtcbiAgICBsZXQgY29udGV4dCA9IG5ldyBWTVJ1bm5lckNvbnRleHQgKClcbiAgICAud2l0aFNjb3BlT2JqICh7XG4gICAgICAgIE9iamVjdCxcbiAgICAgICAgLy9GdW5jdGlvbixcbiAgICAgICAgQXJyYXksXG4gICAgICAgIE51bWJlcixcbiAgICAgICAgcGFyc2VGbG9hdCxcbiAgICAgICAgcGFyc2VJbnQsXG4gICAgICAgICdJbmZpbml0eSc6IEluZmluaXR5LFxuICAgICAgICAnTmFOJzogTmFOLFxuICAgICAgICAndW5kZWZpbmVkJzogdm9pZCAwLFxuICAgICAgICAnQm9vbGVhbic6IEJvb2xlYW4sXG4gICAgICAgICdTdHJpbmcnOiBTdHJpbmcsXG4gICAgICAgICdTeW1ib2wnOiBTeW1ib2wsXG4gICAgICAgICdEYXRlJzogRGF0ZSxcbiAgICAgICAgJ1JlZ0V4cCc6IFJlZ0V4cCxcbiAgICAgICAgJ0Vycm9yJzogRXJyb3IsXG4gICAgICAgICdFdmFsRXJyb3InOiBFdmFsRXJyb3IsXG4gICAgICAgICdSYW5nZUVycm9yJzogUmFuZ2VFcnJvcixcbiAgICAgICAgJ1JlZmVyZW5jZUVycm9yJzogUmVmZXJlbmNlRXJyb3IsXG4gICAgICAgICdTeW50YXhFcnJvcic6IFN5bnRheEVycm9yLFxuICAgICAgICAnVHlwZUVycm9yJzogVHlwZUVycm9yLFxuICAgICAgICAnVVJJRXJyb3InOiBVUklFcnJvcixcbiAgICAgICAgJ0pTT04nOiBKU09OLFxuICAgICAgICAnTWF0aCc6IE1hdGgsXG4gICAgICAgICdjb25zb2xlJzogY29uc29sZSxcbiAgICAgICAgJ0ludGwnOiBJbnRsLFxuICAgICAgICAnQXJyYXlCdWZmZXInOiBBcnJheUJ1ZmZlcixcbiAgICAgICAgJ1VpbnQ4QXJyYXknOiBVaW50OEFycmF5LFxuICAgICAgICAnSW50OEFycmF5JzogSW50OEFycmF5LFxuICAgICAgICAnVWludDE2QXJyYXknOiBVaW50MTZBcnJheSxcbiAgICAgICAgJ0ludDE2QXJyYXknOiBJbnQxNkFycmF5LFxuICAgICAgICAnVWludDMyQXJyYXknOiBVaW50MzJBcnJheSxcbiAgICAgICAgJ0ludDMyQXJyYXknOiBJbnQzMkFycmF5LFxuICAgICAgICAnRmxvYXQzMkFycmF5JzogRmxvYXQzMkFycmF5LFxuICAgICAgICAnRmxvYXQ2NEFycmF5JzogRmxvYXQ2NEFycmF5LFxuICAgICAgICAnVWludDhDbGFtcGVkQXJyYXknOiBVaW50OENsYW1wZWRBcnJheSxcbiAgICAgICAgJ0RhdGFWaWV3JzogRGF0YVZpZXcsXG4gICAgICAgICdNYXAnOiBNYXAsXG4gICAgICAgICdTZXQnOiBTZXQsXG4gICAgICAgICdXZWFrTWFwJzogV2Vha01hcCxcbiAgICAgICAgJ1dlYWtTZXQnOiBXZWFrU2V0LFxuICAgICAgICAnUHJveHknOiBQcm94eSxcbiAgICAgICAgJ1JlZmxlY3QnOiBSZWZsZWN0LFxuICAgICAgICAnZGVjb2RlVVJJJzogZGVjb2RlVVJJLFxuICAgICAgICAnZGVjb2RlVVJJQ29tcG9uZW50JzogZGVjb2RlVVJJQ29tcG9uZW50LFxuICAgICAgICAnZW5jb2RlVVJJJzogZW5jb2RlVVJJLFxuICAgICAgICAnZW5jb2RlVVJJQ29tcG9uZW50JzogZW5jb2RlVVJJQ29tcG9uZW50LFxuICAgICAgICAnZXNjYXBlJzogZXNjYXBlLFxuICAgICAgICAndW5lc2NhcGUnOiB1bmVzY2FwZSxcbiAgICAgICAgJ2lzRmluaXRlJzogaXNGaW5pdGUsXG4gICAgICAgICdpc05hTic6IGlzTmFOLFxuICAgICAgICAnV2ViQXNzZW1ibHknOiBXZWJBc3NlbWJseSxcbiAgICAgICAgJ0J1ZmZlcic6IEJ1ZmZlcixcbiAgICAgICAgJ2NsZWFySW1tZWRpYXRlJzogY2xlYXJJbW1lZGlhdGUsXG4gICAgICAgICdjbGVhckludGVydmFsJzogY2xlYXJJbnRlcnZhbCxcbiAgICAgICAgJ2NsZWFyVGltZW91dCc6IGNsZWFyVGltZW91dCxcbiAgICAgICAgJ3NldEltbWVkaWF0ZSc6IHNldEltbWVkaWF0ZSxcbiAgICAgICAgJ3NldEludGVydmFsJzogc2V0SW50ZXJ2YWwsXG4gICAgICAgICdzZXRUaW1lb3V0Jzogc2V0VGltZW91dCxcbiAgICAgICAgUHJvbWlzZTogUHJvbWlzZSxcbiAgICAgICAgdm1Db2RlRnJhbWUsXG4gICAgICAgIF9cbiAgICB9KTtcbiAgICBsZXQgcnVubmVyID0gbmV3IFZNUnVubmVyIChjb250ZXh0KS53aXRoVGhyb3cgKHRydWUpO1xuXG4gICAgbGV0IHJlc3VsdCA9IGF3YWl0IHJ1bm5lci5ydW4oYFxuICAgIGNsYXNzIFRlc3R7XG4gICAgICAgIHRlc3QoKXtcbiAgICAgICAgICAgIHRoaXMudmFsdWUoKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdmFsdWUoKXtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGNvbnN0IHRlc3QgPSBuZXcgVGVzdCgpO1xuICAgIHRlc3QudGVzdCgpO1xuICAgIFxuICAgIGAse30pO1xuXG4gICAgY29uc29sZS5sb2cocmVzdWx0KTtcblxuICAgIGxldCBwcm9taXNlcyA9IFtdO1xuICAgIGZvciAodmFyIGogPSAwOyBqIDwgMjAwMDsgaisrKSB7XG4gICAgICAgIGxldCBpID0gXy5yYW5kb20gKDAsIDEwMDApO1xuICAgICAgICAoKGkpID0+IHtcbiAgICAgICAgICAgIGxldCBleHByZXNzaW9uID0gYFxuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygndm0yT3B0aW9uczonLF8uc2l6ZSh2bTJPcHRpb25zKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2kke2l9XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaSA9ICR7aX07XG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFjZTppLHZtMkV4cHJlc3Npb24sVk1fUlVOTkVSX0hBU0g7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge2ksVk1fUlVOTkVSX0hBU0h9O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLHJlamVjdCk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiggdm0yRXhwcmVzc2lvbi5pbmRleE9mKCcvL2kke2l9JykgPT0tMSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcih2bTJFeHByZXNzaW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCggKCk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoe2ksVk1fUlVOTkVSX0hBU0h9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LF8ucmFuZG9tKDAsMTAwKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYDtcbiAgICAgICAgICAgIGxldCBwcm9taXNlID0gcnVubmVyLnJ1biAoZXhwcmVzc2lvbiwge30sIHtcbiAgICAgICAgICAgICAgICB0cmFjZToge1xuICAgICAgICAgICAgICAgICAgICBhbGlhc2VzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFjZSAobWVzc2FnZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGV4cHJlc3Npb24hPT1tZXNzYWdlLmRhdGEudm0yRXhwcmVzc2lvbil7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYCR7bWVzc2FnZS5kYXRhLnZtMkV4cHJlc3Npb259YCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKG1lc3NhZ2UuZGF0YS5pIT09aSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYCR7bWVzc2FnZS5kYXRhLml9IT09JHtpfWApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBwcm9taXNlLnRoZW4gKCh2bVJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgIHZtUmVzdWx0LnJlYWxJID0gaTtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nIChgdm1SZXN1bHQ6JHtKU09OLnN0cmluZ2lmeSh2bVJlc3VsdCl9LCBpOiR7aX1gKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcHJvbWlzZXMucHVzaCAocHJvbWlzZSk7XG4gICAgICAgIH0pIChpKTtcbiAgICB9XG4gICAgbGV0IHJlc3VsdHMgPSBhd2FpdCBQcm9taXNlLmFsbCAocHJvbWlzZXMpO1xuICAgIC8vZ2xvYmFsLmdjKCk7XG4gICAgY29uc29sZS5sb2cgKEpTT04uc3RyaW5naWZ5IChyZXN1bHRzKSk7XG59XG5zZXRJbnRlcnZhbCAoKCkgPT4ge1xuICAgIGYgKCk7XG59LCAxICogMTAwMClcbmYgKCk7Il19