"use strict";var _interopRequireDefault3 = require("@babel/runtime/helpers/interopRequireDefault");var _interopRequireDefault2 = _interopRequireDefault3(require("@babel/runtime/helpers/interopRequireDefault"));var _babelPlugin = require("./babel-plugin");var vmBabelPlugin = (0, _interopRequireDefault2["default"])(_babelPlugin)["default"];

var breakpointPlugin = require('./breakpoint-plugin');var _require =
require("@babel/core"),parse = _require.parse,transform = _require.transform,traverse = _require.traverse;


var source = "console.log(__line);\nclass TestClass{\n    stat(){\n        var self = this;\n        var propVariable = 1;\n        //trace:;\n        1;\n    }\n}\nvar val = 1;\nvar val2 = 2;\ntrace:val,val2,this;\n\n";














var transformed = transform(source, {
  filename: 'test.js',
  "presets": [["@babel/preset-env", { targets: { node: 'current', esmodules: false } }]],
  babelrc: false,
  configFile: false,
  //debug:true,
  plugins: [
  [vmBabelPlugin],
  ['babel-plugin-transform-line']],

  parserOpts: { allowReturnOutsideFunction: true } });


console.log(transformed.code);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kZXYuanMiXSwibmFtZXMiOlsidm1CYWJlbFBsdWdpbiIsImJyZWFrcG9pbnRQbHVnaW4iLCJyZXF1aXJlIiwicGFyc2UiLCJ0cmFuc2Zvcm0iLCJ0cmF2ZXJzZSIsInNvdXJjZSIsInRyYW5zZm9ybWVkIiwiZmlsZW5hbWUiLCJ0YXJnZXRzIiwibm9kZSIsImVzbW9kdWxlcyIsImJhYmVscmMiLCJjb25maWdGaWxlIiwicGx1Z2lucyIsInBhcnNlck9wdHMiLCJhbGxvd1JldHVybk91dHNpZGVGdW5jdGlvbiIsImNvbnNvbGUiLCJsb2ciLCJjb2RlIl0sIm1hcHBpbmdzIjoia05BQUEsNkMsSUFBT0EsYTs7QUFFUCxJQUFNQyxnQkFBZ0IsR0FBR0MsT0FBTyxDQUFDLHFCQUFELENBQWhDLEM7QUFDcUNBLE9BQU8sQ0FBQyxhQUFELEMsQ0FBckNDLEssWUFBQUEsSyxDQUFPQyxTLFlBQUFBLFMsQ0FBV0MsUSxZQUFBQSxROzs7QUFHekIsSUFBTUMsTUFBTSxpTkFBWjs7Ozs7Ozs7Ozs7Ozs7O0FBZUEsSUFBTUMsV0FBVyxHQUFHSCxTQUFTLENBQUNFLE1BQUQsRUFBUztBQUNsQ0UsRUFBQUEsUUFBUSxFQUFFLFNBRHdCO0FBRWxDLGFBQVcsQ0FBQyxDQUFDLG1CQUFELEVBQXFCLEVBQUNDLE9BQU8sRUFBQyxFQUFDQyxJQUFJLEVBQUMsU0FBTixFQUFnQkMsU0FBUyxFQUFDLEtBQTFCLEVBQVQsRUFBckIsQ0FBRCxDQUZ1QjtBQUdsQ0MsRUFBQUEsT0FBTyxFQUFFLEtBSHlCO0FBSWxDQyxFQUFBQSxVQUFVLEVBQUUsS0FKc0I7QUFLbEM7QUFDQUMsRUFBQUEsT0FBTyxFQUFFO0FBQ0wsR0FBQ2QsYUFBRCxDQURLO0FBRUwsR0FBQyw2QkFBRCxDQUZLLENBTnlCOztBQVVsQ2UsRUFBQUEsVUFBVSxFQUFFLEVBQUVDLDBCQUEwQixFQUFFLElBQTlCLEVBVnNCLEVBQVQsQ0FBN0I7OztBQWFBQyxPQUFPLENBQUNDLEdBQVIsQ0FBWVgsV0FBVyxDQUFDWSxJQUF4QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB2bUJhYmVsUGx1Z2luIGZyb20gXCIuL2JhYmVsLXBsdWdpblwiO1xuXG5jb25zdCBicmVha3BvaW50UGx1Z2luID0gcmVxdWlyZSgnLi9icmVha3BvaW50LXBsdWdpbicpO1xuY29uc3Qge3BhcnNlLCB0cmFuc2Zvcm0sIHRyYXZlcnNlfSA9IHJlcXVpcmUoXCJAYmFiZWwvY29yZVwiKTtcblxuXG5jb25zdCBzb3VyY2UgPSAgYGNvbnNvbGUubG9nKF9fbGluZSk7XG5jbGFzcyBUZXN0Q2xhc3N7XG4gICAgc3RhdCgpe1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBwcm9wVmFyaWFibGUgPSAxO1xuICAgICAgICAvL3RyYWNlOjtcbiAgICAgICAgMTtcbiAgICB9XG59XG52YXIgdmFsID0gMTtcbnZhciB2YWwyID0gMjtcbnRyYWNlOnZhbCx2YWwyLHRoaXM7XG5cbmA7XG5cbmNvbnN0IHRyYW5zZm9ybWVkID0gdHJhbnNmb3JtKHNvdXJjZSwge1xuICAgIGZpbGVuYW1lOiAndGVzdC5qcycsXG4gICAgXCJwcmVzZXRzXCI6IFtbXCJAYmFiZWwvcHJlc2V0LWVudlwiLHt0YXJnZXRzOntub2RlOidjdXJyZW50Jyxlc21vZHVsZXM6ZmFsc2V9fV1dLFxuICAgIGJhYmVscmM6IGZhbHNlLFxuICAgIGNvbmZpZ0ZpbGU6IGZhbHNlLFxuICAgIC8vZGVidWc6dHJ1ZSxcbiAgICBwbHVnaW5zOiBbXG4gICAgICAgIFt2bUJhYmVsUGx1Z2luXSxcbiAgICAgICAgWydiYWJlbC1wbHVnaW4tdHJhbnNmb3JtLWxpbmUnXSxcbiAgICBdLFxuICAgIHBhcnNlck9wdHM6IHsgYWxsb3dSZXR1cm5PdXRzaWRlRnVuY3Rpb246IHRydWUgfVxufSk7XG5cbmNvbnNvbGUubG9nKHRyYW5zZm9ybWVkLmNvZGUpOyJdfQ==