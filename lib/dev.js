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

          runner.run("'item2'", {}));case 4:result = _context.sent;

          promises = [];
          for (j = 0; j < 2000; j++) {
            i = _.random(0, 10000);
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
          }_context.next = 9;return _regeneratorRuntime.awrap(
          Promise.all(promises));case 9:results = _context.sent;
          //global.gc();
          console.log(JSON.stringify(results));case 11:case "end":return _context.stop();}}});};

setInterval(function () {
  f();
}, 1 * 1000);
f();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kZXYuanMiXSwibmFtZXMiOlsiVk1SdW5uZXIiLCJWTVJ1bm5lckNvbnRleHQiLCJ2bUNvZGVGcmFtZSIsImV4cHJlc3Npb24iLCJsaW5lIiwiY29kZUZyYW1lQ29sdW1ucyIsInJlcXVpcmUiLCJsb2NhdGlvbiIsInN0YXJ0IiwiY29sdW1uIiwicmVzdWx0IiwibGluZXNBYm92ZSIsIl8iLCJmIiwiY29udGV4dCIsIndpdGhTY29wZU9iaiIsIk9iamVjdCIsIkFycmF5IiwiTnVtYmVyIiwicGFyc2VGbG9hdCIsInBhcnNlSW50IiwiSW5maW5pdHkiLCJOYU4iLCJCb29sZWFuIiwiU3RyaW5nIiwiU3ltYm9sIiwiRGF0ZSIsIlJlZ0V4cCIsIkVycm9yIiwiRXZhbEVycm9yIiwiUmFuZ2VFcnJvciIsIlJlZmVyZW5jZUVycm9yIiwiU3ludGF4RXJyb3IiLCJUeXBlRXJyb3IiLCJVUklFcnJvciIsIkpTT04iLCJNYXRoIiwiY29uc29sZSIsIkludGwiLCJBcnJheUJ1ZmZlciIsIlVpbnQ4QXJyYXkiLCJJbnQ4QXJyYXkiLCJVaW50MTZBcnJheSIsIkludDE2QXJyYXkiLCJVaW50MzJBcnJheSIsIkludDMyQXJyYXkiLCJGbG9hdDMyQXJyYXkiLCJGbG9hdDY0QXJyYXkiLCJVaW50OENsYW1wZWRBcnJheSIsIkRhdGFWaWV3IiwiTWFwIiwiU2V0IiwiV2Vha01hcCIsIldlYWtTZXQiLCJQcm94eSIsIlJlZmxlY3QiLCJkZWNvZGVVUkkiLCJkZWNvZGVVUklDb21wb25lbnQiLCJlbmNvZGVVUkkiLCJlbmNvZGVVUklDb21wb25lbnQiLCJlc2NhcGUiLCJ1bmVzY2FwZSIsImlzRmluaXRlIiwiaXNOYU4iLCJXZWJBc3NlbWJseSIsIkJ1ZmZlciIsImNsZWFySW1tZWRpYXRlIiwiY2xlYXJJbnRlcnZhbCIsImNsZWFyVGltZW91dCIsInNldEltbWVkaWF0ZSIsInNldEludGVydmFsIiwic2V0VGltZW91dCIsIlByb21pc2UiLCJydW5uZXIiLCJ3aXRoVGhyb3ciLCJydW4iLCJwcm9taXNlcyIsImoiLCJpIiwicmFuZG9tIiwicHJvbWlzZSIsInRyYWNlIiwiYWxpYXNlcyIsIm1lc3NhZ2UiLCJkYXRhIiwidm0yRXhwcmVzc2lvbiIsImVycm9yIiwidGhlbiIsInZtUmVzdWx0IiwicmVhbEkiLCJwdXNoIiwiYWxsIiwicmVzdWx0cyIsImxvZyIsInN0cmluZ2lmeSJdLCJtYXBwaW5ncyI6InNXQUFBLGdDLElBQVFBLFEsVUFBQUEsUSxLQUFVQyxlLFVBQUFBLGU7QUFDbEIsU0FBU0MsV0FBVCxDQUFzQkMsVUFBdEIsRUFBa0NDLElBQWxDLEVBQXdDO0FBQ3BDLE1BQUlDLGdCQUFnQixHQUFHQyxPQUFPLENBQUUsbUJBQUYsQ0FBUCxDQUE4QkQsZ0JBQXJEO0FBQ0EsTUFBSUYsVUFBSixFQUFnQjtBQUNaLFFBQUlJLFFBQVEsR0FBRyxFQUFDQyxLQUFLLEVBQUUsRUFBQ0osSUFBSSxFQUFFQSxJQUFQLEVBQWFLLE1BQU0sRUFBRSxJQUFyQixFQUFSLEVBQWY7QUFDQSxRQUFJQyxNQUFNLEdBQUdMLGdCQUFnQixDQUFFRixVQUFGLEVBQWNJLFFBQWQsRUFBd0IsRUFBQ0ksVUFBVSxFQUFFLENBQWIsRUFBeEIsQ0FBN0I7QUFDQSxXQUFPRCxNQUFQO0FBQ0g7QUFDRCxTQUFPLEVBQVA7QUFDSDtBQUNELElBQU1FLENBQUMsR0FBR04sT0FBTyxDQUFFLFlBQUYsQ0FBakI7O0FBRUEsSUFBSU8sQ0FBQyxHQUFHLFNBQUpBLENBQUk7QUFDQUMsVUFBQUEsT0FEQSxHQUNVLElBQUliLGVBQUo7QUFDYmMsVUFBQUEsWUFEYSxDQUNDO0FBQ1hDLFlBQUFBLE1BQU0sRUFBTkEsTUFEVztBQUVYO0FBQ0FDLFlBQUFBLEtBQUssRUFBTEEsS0FIVztBQUlYQyxZQUFBQSxNQUFNLEVBQU5BLE1BSlc7QUFLWEMsWUFBQUEsVUFBVSxFQUFWQSxVQUxXO0FBTVhDLFlBQUFBLFFBQVEsRUFBUkEsUUFOVztBQU9YLHdCQUFZQyxRQVBEO0FBUVgsbUJBQU9DLEdBUkk7QUFTWCx5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TixDQUFiLEtBQWlCQSxDQUFwQixFQUFzQjtBQUNsQnpDLHdCQUFBQSxPQUFPLENBQUNpRCxLQUFSLFdBQWlCSCxPQUFPLENBQUNDLElBQVIsQ0FBYU4sQ0FBOUIsZ0JBQXFDQSxDQUFyQztBQUNIO0FBQ0oscUJBUkksRUFETixFQUQrQixFQUE1QixDQUFkOzs7OztBQWVBRSxjQUFBQSxPQUFPLENBQUNPLElBQVIsQ0FBYyxVQUFDQyxRQUFELEVBQWM7QUFDeEJBLGdCQUFBQSxRQUFRLENBQUNDLEtBQVQsR0FBaUJYLENBQWpCO0FBQ0E7QUFDSCxlQUhEO0FBSUFGLGNBQUFBLFFBQVEsQ0FBQ2MsSUFBVCxDQUFlVixPQUFmO0FBQ0gsYUFwQ0QsRUFvQ0lGLENBcENKO0FBcUNILFdBN0dHO0FBOEdnQk4sVUFBQUEsT0FBTyxDQUFDbUIsR0FBUixDQUFhZixRQUFiLENBOUdoQixTQThHQWdCLE9BOUdBO0FBK0dKO0FBQ0F2RCxVQUFBQSxPQUFPLENBQUN3RCxHQUFSLENBQWExRCxJQUFJLENBQUMyRCxTQUFMLENBQWdCRixPQUFoQixDQUFiLEVBaEhJLGdEQUFSOztBQWtIQXRCLFdBQVcsQ0FBRSxZQUFNO0FBQ2Z6RCxFQUFBQSxDQUFDO0FBQ0osQ0FGVSxFQUVSLElBQUksSUFGSSxDQUFYO0FBR0FBLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1ZNUnVubmVyLCBWTVJ1bm5lckNvbnRleHR9IGZyb20gXCIuL2luZGV4XCI7XG5mdW5jdGlvbiB2bUNvZGVGcmFtZSAoZXhwcmVzc2lvbiwgbGluZSkge1xuICAgIHZhciBjb2RlRnJhbWVDb2x1bW5zID0gcmVxdWlyZSAoJ0BiYWJlbC9jb2RlLWZyYW1lJykuY29kZUZyYW1lQ29sdW1ucztcbiAgICBpZiAoZXhwcmVzc2lvbikge1xuICAgICAgICB2YXIgbG9jYXRpb24gPSB7c3RhcnQ6IHtsaW5lOiBsaW5lLCBjb2x1bW46IG51bGx9fTtcbiAgICAgICAgdmFyIHJlc3VsdCA9IGNvZGVGcmFtZUNvbHVtbnMgKGV4cHJlc3Npb24sIGxvY2F0aW9uLCB7bGluZXNBYm92ZTogNX0pO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICByZXR1cm4gJyc7XG59XG5jb25zdCBfID0gcmVxdWlyZSAoJ3VuZGVyc2NvcmUnKTtcblxudmFyIGYgPSBhc3luYyAoKSA9PiB7XG4gICAgbGV0IGNvbnRleHQgPSBuZXcgVk1SdW5uZXJDb250ZXh0ICgpXG4gICAgLndpdGhTY29wZU9iaiAoe1xuICAgICAgICBPYmplY3QsXG4gICAgICAgIC8vRnVuY3Rpb24sXG4gICAgICAgIEFycmF5LFxuICAgICAgICBOdW1iZXIsXG4gICAgICAgIHBhcnNlRmxvYXQsXG4gICAgICAgIHBhcnNlSW50LFxuICAgICAgICAnSW5maW5pdHknOiBJbmZpbml0eSxcbiAgICAgICAgJ05hTic6IE5hTixcbiAgICAgICAgJ3VuZGVmaW5lZCc6IHZvaWQgMCxcbiAgICAgICAgJ0Jvb2xlYW4nOiBCb29sZWFuLFxuICAgICAgICAnU3RyaW5nJzogU3RyaW5nLFxuICAgICAgICAnU3ltYm9sJzogU3ltYm9sLFxuICAgICAgICAnRGF0ZSc6IERhdGUsXG4gICAgICAgICdSZWdFeHAnOiBSZWdFeHAsXG4gICAgICAgICdFcnJvcic6IEVycm9yLFxuICAgICAgICAnRXZhbEVycm9yJzogRXZhbEVycm9yLFxuICAgICAgICAnUmFuZ2VFcnJvcic6IFJhbmdlRXJyb3IsXG4gICAgICAgICdSZWZlcmVuY2VFcnJvcic6IFJlZmVyZW5jZUVycm9yLFxuICAgICAgICAnU3ludGF4RXJyb3InOiBTeW50YXhFcnJvcixcbiAgICAgICAgJ1R5cGVFcnJvcic6IFR5cGVFcnJvcixcbiAgICAgICAgJ1VSSUVycm9yJzogVVJJRXJyb3IsXG4gICAgICAgICdKU09OJzogSlNPTixcbiAgICAgICAgJ01hdGgnOiBNYXRoLFxuICAgICAgICAnY29uc29sZSc6IGNvbnNvbGUsXG4gICAgICAgICdJbnRsJzogSW50bCxcbiAgICAgICAgJ0FycmF5QnVmZmVyJzogQXJyYXlCdWZmZXIsXG4gICAgICAgICdVaW50OEFycmF5JzogVWludDhBcnJheSxcbiAgICAgICAgJ0ludDhBcnJheSc6IEludDhBcnJheSxcbiAgICAgICAgJ1VpbnQxNkFycmF5JzogVWludDE2QXJyYXksXG4gICAgICAgICdJbnQxNkFycmF5JzogSW50MTZBcnJheSxcbiAgICAgICAgJ1VpbnQzMkFycmF5JzogVWludDMyQXJyYXksXG4gICAgICAgICdJbnQzMkFycmF5JzogSW50MzJBcnJheSxcbiAgICAgICAgJ0Zsb2F0MzJBcnJheSc6IEZsb2F0MzJBcnJheSxcbiAgICAgICAgJ0Zsb2F0NjRBcnJheSc6IEZsb2F0NjRBcnJheSxcbiAgICAgICAgJ1VpbnQ4Q2xhbXBlZEFycmF5JzogVWludDhDbGFtcGVkQXJyYXksXG4gICAgICAgICdEYXRhVmlldyc6IERhdGFWaWV3LFxuICAgICAgICAnTWFwJzogTWFwLFxuICAgICAgICAnU2V0JzogU2V0LFxuICAgICAgICAnV2Vha01hcCc6IFdlYWtNYXAsXG4gICAgICAgICdXZWFrU2V0JzogV2Vha1NldCxcbiAgICAgICAgJ1Byb3h5JzogUHJveHksXG4gICAgICAgICdSZWZsZWN0JzogUmVmbGVjdCxcbiAgICAgICAgJ2RlY29kZVVSSSc6IGRlY29kZVVSSSxcbiAgICAgICAgJ2RlY29kZVVSSUNvbXBvbmVudCc6IGRlY29kZVVSSUNvbXBvbmVudCxcbiAgICAgICAgJ2VuY29kZVVSSSc6IGVuY29kZVVSSSxcbiAgICAgICAgJ2VuY29kZVVSSUNvbXBvbmVudCc6IGVuY29kZVVSSUNvbXBvbmVudCxcbiAgICAgICAgJ2VzY2FwZSc6IGVzY2FwZSxcbiAgICAgICAgJ3VuZXNjYXBlJzogdW5lc2NhcGUsXG4gICAgICAgICdpc0Zpbml0ZSc6IGlzRmluaXRlLFxuICAgICAgICAnaXNOYU4nOiBpc05hTixcbiAgICAgICAgJ1dlYkFzc2VtYmx5JzogV2ViQXNzZW1ibHksXG4gICAgICAgICdCdWZmZXInOiBCdWZmZXIsXG4gICAgICAgICdjbGVhckltbWVkaWF0ZSc6IGNsZWFySW1tZWRpYXRlLFxuICAgICAgICAnY2xlYXJJbnRlcnZhbCc6IGNsZWFySW50ZXJ2YWwsXG4gICAgICAgICdjbGVhclRpbWVvdXQnOiBjbGVhclRpbWVvdXQsXG4gICAgICAgICdzZXRJbW1lZGlhdGUnOiBzZXRJbW1lZGlhdGUsXG4gICAgICAgICdzZXRJbnRlcnZhbCc6IHNldEludGVydmFsLFxuICAgICAgICAnc2V0VGltZW91dCc6IHNldFRpbWVvdXQsXG4gICAgICAgIFByb21pc2U6IFByb21pc2UsXG4gICAgICAgIHZtQ29kZUZyYW1lLFxuICAgICAgICBfXG4gICAgfSk7XG4gICAgbGV0IHJ1bm5lciA9IG5ldyBWTVJ1bm5lciAoY29udGV4dCkud2l0aFRocm93ICh0cnVlKTtcblxuICAgIGxldCByZXN1bHQgPSBhd2FpdCBydW5uZXIucnVuKGAnaXRlbTInYCx7fSk7XG5cbiAgICBsZXQgcHJvbWlzZXMgPSBbXTtcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IDIwMDA7IGorKykge1xuICAgICAgICBsZXQgaSA9IF8ucmFuZG9tICgwLCAxMDAwMCk7XG4gICAgICAgICgoaSkgPT4ge1xuICAgICAgICAgICAgbGV0IGV4cHJlc3Npb24gPSBgXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCd2bTJPcHRpb25zOicsXy5zaXplKHZtMk9wdGlvbnMpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vaSR7aX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpID0gJHtpfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYWNlOmksdm0yRXhwcmVzc2lvbixWTV9SVU5ORVJfSEFTSDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7aSxWTV9SVU5ORVJfSEFTSH07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUscmVqZWN0KT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCB2bTJFeHByZXNzaW9uLmluZGV4T2YoJy8vaSR7aX0nKSA9PS0xKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHZtMkV4cHJlc3Npb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCAoKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSh7aSxWTV9SVU5ORVJfSEFTSH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXy5yYW5kb20oMCwxMDApKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBgO1xuICAgICAgICAgICAgbGV0IHByb21pc2UgPSBydW5uZXIucnVuIChleHByZXNzaW9uLCB7fSwge1xuICAgICAgICAgICAgICAgIHRyYWNlOiB7XG4gICAgICAgICAgICAgICAgICAgIGFsaWFzZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYWNlIChtZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoZXhwcmVzc2lvbiE9PW1lc3NhZ2UuZGF0YS52bTJFeHByZXNzaW9uKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgJHttZXNzYWdlLmRhdGEudm0yRXhwcmVzc2lvbn1gKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYobWVzc2FnZS5kYXRhLmkhPT1pKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgJHttZXNzYWdlLmRhdGEuaX0hPT0ke2l9YCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHByb21pc2UudGhlbiAoKHZtUmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgdm1SZXN1bHQucmVhbEkgPSBpO1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2cgKGB2bVJlc3VsdDoke0pTT04uc3RyaW5naWZ5KHZtUmVzdWx0KX0sIGk6JHtpfWApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoIChwcm9taXNlKTtcbiAgICAgICAgfSkgKGkpO1xuICAgIH1cbiAgICBsZXQgcmVzdWx0cyA9IGF3YWl0IFByb21pc2UuYWxsIChwcm9taXNlcyk7XG4gICAgLy9nbG9iYWwuZ2MoKTtcbiAgICBjb25zb2xlLmxvZyAoSlNPTi5zdHJpbmdpZnkgKHJlc3VsdHMpKTtcbn1cbnNldEludGVydmFsICgoKSA9PiB7XG4gICAgZiAoKTtcbn0sIDEgKiAxMDAwKVxuZiAoKTsiXX0=