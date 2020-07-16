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

var f = function f() {var context, runner, arr, promises, j, i, results;return _regeneratorRuntime.async(function f$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
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


          runner.run("\n    return VM_RUNNER_HASH;    \n    ",

          {}, {
            localScope: {
              test: 1 } }));case 4:_context.t0 = _context.sent;_context.next = 7;return _regeneratorRuntime.awrap(



          runner.run("\n    return VM_RUNNER_HASH;    \n    ",

          {}, {
            localScope: {
              test: 1 } }));case 7:_context.t1 = _context.sent;_context.next = 10;return _regeneratorRuntime.awrap(



          runner.run("\n    return VM_RUNNER_HASH;    \n    ",

          {}, {
            localScope: {
              test2: 2 } }));case 10:_context.t2 = _context.sent;arr = [_context.t0, _context.t1, _context.t2];





          console.log(arr);

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
          }_context.next = 17;return _regeneratorRuntime.awrap(
          Promise.all(promises));case 17:results = _context.sent;
          //global.gc();
          console.log(JSON.stringify(results));case 19:case "end":return _context.stop();}}});};

setInterval(function () {
  f();
}, 1 * 1000);
f();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kZXYuanMiXSwibmFtZXMiOlsiVk1SdW5uZXIiLCJWTVJ1bm5lckNvbnRleHQiLCJ2bUNvZGVGcmFtZSIsImV4cHJlc3Npb24iLCJsaW5lIiwiY29kZUZyYW1lQ29sdW1ucyIsInJlcXVpcmUiLCJsb2NhdGlvbiIsInN0YXJ0IiwiY29sdW1uIiwicmVzdWx0IiwibGluZXNBYm92ZSIsIl8iLCJmIiwiY29udGV4dCIsIndpdGhTY29wZU9iaiIsIk9iamVjdCIsIkFycmF5IiwiTnVtYmVyIiwicGFyc2VGbG9hdCIsInBhcnNlSW50IiwiSW5maW5pdHkiLCJOYU4iLCJCb29sZWFuIiwiU3RyaW5nIiwiU3ltYm9sIiwiRGF0ZSIsIlJlZ0V4cCIsIkVycm9yIiwiRXZhbEVycm9yIiwiUmFuZ2VFcnJvciIsIlJlZmVyZW5jZUVycm9yIiwiU3ludGF4RXJyb3IiLCJUeXBlRXJyb3IiLCJVUklFcnJvciIsIkpTT04iLCJNYXRoIiwiY29uc29sZSIsIkludGwiLCJBcnJheUJ1ZmZlciIsIlVpbnQ4QXJyYXkiLCJJbnQ4QXJyYXkiLCJVaW50MTZBcnJheSIsIkludDE2QXJyYXkiLCJVaW50MzJBcnJheSIsIkludDMyQXJyYXkiLCJGbG9hdDMyQXJyYXkiLCJGbG9hdDY0QXJyYXkiLCJVaW50OENsYW1wZWRBcnJheSIsIkRhdGFWaWV3IiwiTWFwIiwiU2V0IiwiV2Vha01hcCIsIldlYWtTZXQiLCJQcm94eSIsIlJlZmxlY3QiLCJkZWNvZGVVUkkiLCJkZWNvZGVVUklDb21wb25lbnQiLCJlbmNvZGVVUkkiLCJlbmNvZGVVUklDb21wb25lbnQiLCJlc2NhcGUiLCJ1bmVzY2FwZSIsImlzRmluaXRlIiwiaXNOYU4iLCJXZWJBc3NlbWJseSIsIkJ1ZmZlciIsImNsZWFySW1tZWRpYXRlIiwiY2xlYXJJbnRlcnZhbCIsImNsZWFyVGltZW91dCIsInNldEltbWVkaWF0ZSIsInNldEludGVydmFsIiwic2V0VGltZW91dCIsIlByb21pc2UiLCJydW5uZXIiLCJ3aXRoVGhyb3ciLCJydW4iLCJsb2NhbFNjb3BlIiwidGVzdCIsInRlc3QyIiwiYXJyIiwibG9nIiwicHJvbWlzZXMiLCJqIiwiaSIsInJhbmRvbSIsInByb21pc2UiLCJ0cmFjZSIsImFsaWFzZXMiLCJtZXNzYWdlIiwiZGF0YSIsInZtMkV4cHJlc3Npb24iLCJlcnJvciIsInRoZW4iLCJ2bVJlc3VsdCIsInJlYWxJIiwicHVzaCIsImFsbCIsInJlc3VsdHMiLCJzdHJpbmdpZnkiXSwibWFwcGluZ3MiOiJzV0FBQSxnQyxJQUFRQSxRLFVBQUFBLFEsS0FBVUMsZSxVQUFBQSxlO0FBQ2xCLFNBQVNDLFdBQVQsQ0FBc0JDLFVBQXRCLEVBQWtDQyxJQUFsQyxFQUF3QztBQUNwQyxNQUFJQyxnQkFBZ0IsR0FBR0MsT0FBTyxDQUFFLG1CQUFGLENBQVAsQ0FBOEJELGdCQUFyRDtBQUNBLE1BQUlGLFVBQUosRUFBZ0I7QUFDWixRQUFJSSxRQUFRLEdBQUcsRUFBQ0MsS0FBSyxFQUFFLEVBQUNKLElBQUksRUFBRUEsSUFBUCxFQUFhSyxNQUFNLEVBQUUsSUFBckIsRUFBUixFQUFmO0FBQ0EsUUFBSUMsTUFBTSxHQUFHTCxnQkFBZ0IsQ0FBRUYsVUFBRixFQUFjSSxRQUFkLEVBQXdCLEVBQUNJLFVBQVUsRUFBRSxDQUFiLEVBQXhCLENBQTdCO0FBQ0EsV0FBT0QsTUFBUDtBQUNIO0FBQ0QsU0FBTyxFQUFQO0FBQ0g7QUFDRCxJQUFNRSxDQUFDLEdBQUdOLE9BQU8sQ0FBRSxZQUFGLENBQWpCOztBQUVBLElBQUlPLENBQUMsR0FBRyxTQUFKQSxDQUFJO0FBQ0FDLFVBQUFBLE9BREEsR0FDVSxJQUFJYixlQUFKO0FBQ2JjLFVBQUFBLFlBRGEsQ0FDQztBQUNYQyxZQUFBQSxNQUFNLEVBQU5BLE1BRFc7QUFFWDtBQUNBQyxZQUFBQSxLQUFLLEVBQUxBLEtBSFc7QUFJWEMsWUFBQUEsTUFBTSxFQUFOQSxNQUpXO0FBS1hDLFlBQUFBLFVBQVUsRUFBVkEsVUFMVztBQU1YQyxZQUFBQSxRQUFRLEVBQVJBLFFBTlc7QUFPWCx3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Q0FGVSxFQUVSLElBQUksSUFGSSxDQUFYO0FBR0FBLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1ZNUnVubmVyLCBWTVJ1bm5lckNvbnRleHR9IGZyb20gXCIuL2luZGV4XCI7XG5mdW5jdGlvbiB2bUNvZGVGcmFtZSAoZXhwcmVzc2lvbiwgbGluZSkge1xuICAgIHZhciBjb2RlRnJhbWVDb2x1bW5zID0gcmVxdWlyZSAoJ0BiYWJlbC9jb2RlLWZyYW1lJykuY29kZUZyYW1lQ29sdW1ucztcbiAgICBpZiAoZXhwcmVzc2lvbikge1xuICAgICAgICB2YXIgbG9jYXRpb24gPSB7c3RhcnQ6IHtsaW5lOiBsaW5lLCBjb2x1bW46IG51bGx9fTtcbiAgICAgICAgdmFyIHJlc3VsdCA9IGNvZGVGcmFtZUNvbHVtbnMgKGV4cHJlc3Npb24sIGxvY2F0aW9uLCB7bGluZXNBYm92ZTogNX0pO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICByZXR1cm4gJyc7XG59XG5jb25zdCBfID0gcmVxdWlyZSAoJ3VuZGVyc2NvcmUnKTtcblxudmFyIGYgPSBhc3luYyAoKSA9PiB7XG4gICAgbGV0IGNvbnRleHQgPSBuZXcgVk1SdW5uZXJDb250ZXh0ICgpXG4gICAgLndpdGhTY29wZU9iaiAoe1xuICAgICAgICBPYmplY3QsXG4gICAgICAgIC8vRnVuY3Rpb24sXG4gICAgICAgIEFycmF5LFxuICAgICAgICBOdW1iZXIsXG4gICAgICAgIHBhcnNlRmxvYXQsXG4gICAgICAgIHBhcnNlSW50LFxuICAgICAgICAnSW5maW5pdHknOiBJbmZpbml0eSxcbiAgICAgICAgJ05hTic6IE5hTixcbiAgICAgICAgJ3VuZGVmaW5lZCc6IHZvaWQgMCxcbiAgICAgICAgJ0Jvb2xlYW4nOiBCb29sZWFuLFxuICAgICAgICAnU3RyaW5nJzogU3RyaW5nLFxuICAgICAgICAnU3ltYm9sJzogU3ltYm9sLFxuICAgICAgICAnRGF0ZSc6IERhdGUsXG4gICAgICAgICdSZWdFeHAnOiBSZWdFeHAsXG4gICAgICAgICdFcnJvcic6IEVycm9yLFxuICAgICAgICAnRXZhbEVycm9yJzogRXZhbEVycm9yLFxuICAgICAgICAnUmFuZ2VFcnJvcic6IFJhbmdlRXJyb3IsXG4gICAgICAgICdSZWZlcmVuY2VFcnJvcic6IFJlZmVyZW5jZUVycm9yLFxuICAgICAgICAnU3ludGF4RXJyb3InOiBTeW50YXhFcnJvcixcbiAgICAgICAgJ1R5cGVFcnJvcic6IFR5cGVFcnJvcixcbiAgICAgICAgJ1VSSUVycm9yJzogVVJJRXJyb3IsXG4gICAgICAgICdKU09OJzogSlNPTixcbiAgICAgICAgJ01hdGgnOiBNYXRoLFxuICAgICAgICAnY29uc29sZSc6IGNvbnNvbGUsXG4gICAgICAgICdJbnRsJzogSW50bCxcbiAgICAgICAgJ0FycmF5QnVmZmVyJzogQXJyYXlCdWZmZXIsXG4gICAgICAgICdVaW50OEFycmF5JzogVWludDhBcnJheSxcbiAgICAgICAgJ0ludDhBcnJheSc6IEludDhBcnJheSxcbiAgICAgICAgJ1VpbnQxNkFycmF5JzogVWludDE2QXJyYXksXG4gICAgICAgICdJbnQxNkFycmF5JzogSW50MTZBcnJheSxcbiAgICAgICAgJ1VpbnQzMkFycmF5JzogVWludDMyQXJyYXksXG4gICAgICAgICdJbnQzMkFycmF5JzogSW50MzJBcnJheSxcbiAgICAgICAgJ0Zsb2F0MzJBcnJheSc6IEZsb2F0MzJBcnJheSxcbiAgICAgICAgJ0Zsb2F0NjRBcnJheSc6IEZsb2F0NjRBcnJheSxcbiAgICAgICAgJ1VpbnQ4Q2xhbXBlZEFycmF5JzogVWludDhDbGFtcGVkQXJyYXksXG4gICAgICAgICdEYXRhVmlldyc6IERhdGFWaWV3LFxuICAgICAgICAnTWFwJzogTWFwLFxuICAgICAgICAnU2V0JzogU2V0LFxuICAgICAgICAnV2Vha01hcCc6IFdlYWtNYXAsXG4gICAgICAgICdXZWFrU2V0JzogV2Vha1NldCxcbiAgICAgICAgJ1Byb3h5JzogUHJveHksXG4gICAgICAgICdSZWZsZWN0JzogUmVmbGVjdCxcbiAgICAgICAgJ2RlY29kZVVSSSc6IGRlY29kZVVSSSxcbiAgICAgICAgJ2RlY29kZVVSSUNvbXBvbmVudCc6IGRlY29kZVVSSUNvbXBvbmVudCxcbiAgICAgICAgJ2VuY29kZVVSSSc6IGVuY29kZVVSSSxcbiAgICAgICAgJ2VuY29kZVVSSUNvbXBvbmVudCc6IGVuY29kZVVSSUNvbXBvbmVudCxcbiAgICAgICAgJ2VzY2FwZSc6IGVzY2FwZSxcbiAgICAgICAgJ3VuZXNjYXBlJzogdW5lc2NhcGUsXG4gICAgICAgICdpc0Zpbml0ZSc6IGlzRmluaXRlLFxuICAgICAgICAnaXNOYU4nOiBpc05hTixcbiAgICAgICAgJ1dlYkFzc2VtYmx5JzogV2ViQXNzZW1ibHksXG4gICAgICAgICdCdWZmZXInOiBCdWZmZXIsXG4gICAgICAgICdjbGVhckltbWVkaWF0ZSc6IGNsZWFySW1tZWRpYXRlLFxuICAgICAgICAnY2xlYXJJbnRlcnZhbCc6IGNsZWFySW50ZXJ2YWwsXG4gICAgICAgICdjbGVhclRpbWVvdXQnOiBjbGVhclRpbWVvdXQsXG4gICAgICAgICdzZXRJbW1lZGlhdGUnOiBzZXRJbW1lZGlhdGUsXG4gICAgICAgICdzZXRJbnRlcnZhbCc6IHNldEludGVydmFsLFxuICAgICAgICAnc2V0VGltZW91dCc6IHNldFRpbWVvdXQsXG4gICAgICAgIFByb21pc2U6IFByb21pc2UsXG4gICAgICAgIHZtQ29kZUZyYW1lLFxuICAgICAgICBfXG4gICAgfSk7XG4gICAgbGV0IHJ1bm5lciA9IG5ldyBWTVJ1bm5lciAoY29udGV4dCkud2l0aFRocm93ICh0cnVlKTtcblxuICAgIGxldCBhcnIgPSBbXG4gICAgICAgIGF3YWl0IHJ1bm5lci5ydW4oYFxuICAgIHJldHVybiBWTV9SVU5ORVJfSEFTSDsgICAgXG4gICAgYCx7fSx7XG4gICAgICAgIGxvY2FsU2NvcGU6e1xuICAgICAgICAgICAgdGVzdDoxXG4gICAgICAgIH1cbiAgICB9KSxcblxuICAgICAgICBhd2FpdCBydW5uZXIucnVuKGBcbiAgICByZXR1cm4gVk1fUlVOTkVSX0hBU0g7ICAgIFxuICAgIGAse30se1xuICAgICAgICAgICAgbG9jYWxTY29wZTp7XG4gICAgICAgICAgICAgICAgdGVzdDoxXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLFxuXG4gICAgICAgIGF3YWl0IHJ1bm5lci5ydW4oYFxuICAgIHJldHVybiBWTV9SVU5ORVJfSEFTSDsgICAgXG4gICAgYCx7fSx7XG4gICAgICAgICAgICBsb2NhbFNjb3BlOntcbiAgICAgICAgICAgICAgICB0ZXN0MjoyXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLFxuXG4gICAgICAgIF07XG5cbiAgICBjb25zb2xlLmxvZyhhcnIpO1xuXG4gICAgbGV0IHByb21pc2VzID0gW107XG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCAyMDAwOyBqKyspIHtcbiAgICAgICAgbGV0IGkgPSBfLnJhbmRvbSAoMCwgMTAwMCk7XG4gICAgICAgICgoaSkgPT4ge1xuICAgICAgICAgICAgbGV0IGV4cHJlc3Npb24gPSBgXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCd2bTJPcHRpb25zOicsXy5zaXplKHZtMk9wdGlvbnMpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vaSR7aX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpID0gJHtpfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYWNlOmksdm0yRXhwcmVzc2lvbixWTV9SVU5ORVJfSEFTSDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7aSxWTV9SVU5ORVJfSEFTSH07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUscmVqZWN0KT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCB2bTJFeHByZXNzaW9uLmluZGV4T2YoJy8vaSR7aX0nKSA9PS0xKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHZtMkV4cHJlc3Npb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCAoKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSh7aSxWTV9SVU5ORVJfSEFTSH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXy5yYW5kb20oMCwxMDApKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBgO1xuICAgICAgICAgICAgbGV0IHByb21pc2UgPSBydW5uZXIucnVuIChleHByZXNzaW9uLCB7fSwge1xuICAgICAgICAgICAgICAgIHRyYWNlOiB7XG4gICAgICAgICAgICAgICAgICAgIGFsaWFzZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYWNlIChtZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoZXhwcmVzc2lvbiE9PW1lc3NhZ2UuZGF0YS52bTJFeHByZXNzaW9uKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgJHttZXNzYWdlLmRhdGEudm0yRXhwcmVzc2lvbn1gKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYobWVzc2FnZS5kYXRhLmkhPT1pKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgJHttZXNzYWdlLmRhdGEuaX0hPT0ke2l9YCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHByb21pc2UudGhlbiAoKHZtUmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgdm1SZXN1bHQucmVhbEkgPSBpO1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2cgKGB2bVJlc3VsdDoke0pTT04uc3RyaW5naWZ5KHZtUmVzdWx0KX0sIGk6JHtpfWApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoIChwcm9taXNlKTtcbiAgICAgICAgfSkgKGkpO1xuICAgIH1cbiAgICBsZXQgcmVzdWx0cyA9IGF3YWl0IFByb21pc2UuYWxsIChwcm9taXNlcyk7XG4gICAgLy9nbG9iYWwuZ2MoKTtcbiAgICBjb25zb2xlLmxvZyAoSlNPTi5zdHJpbmdpZnkgKHJlc3VsdHMpKTtcbn1cbnNldEludGVydmFsICgoKSA9PiB7XG4gICAgZiAoKTtcbn0sIDEgKiAxMDAwKVxuZiAoKTsiXX0=