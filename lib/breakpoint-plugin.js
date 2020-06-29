"use strict";var _interopRequireDefault3 = require("@babel/runtime/helpers/interopRequireDefault");var _interopRequireDefault2 = _interopRequireDefault3(require("@babel/runtime/helpers/interopRequireDefault"));Object.defineProperty(exports, "__esModule", { value: true });exports["default"] =
function (babel) {
  var parsed = {
    'ArrayExpression': '[]',
    'AssignmentExpression': 'arr = 1;',
    'BinaryExpression': 'var a = 1+2;',
    InterpreterDirective: '?',
    Directive: '?',
    DirectiveLiteral: 'use strict',
    BlockStatement: "for (var i=0;i<10;i++){}",
    BreakStatement: 'while(true){break;}',
    CallExpression: 'f.apply();',
    CatchClause: 'catch(e){}',
    ConditionalExpression: "i?1:2",
    ContinueStatement: 'while(true){continue;}',
    DebuggerStatement: 'debugger',
    DoWhileStatement: ' do{ }while(true){',
    EmptyStatement: 'label:;',
    ExpressionStatement: 'f();' };

  _.each(babel.types.TYPES, function (type) {

  });

  return {
    visitor: {
      Program: function Program(program, _ref) {var opts = _ref.opts;
        program.traverse({
          'La': function La(path) {
            console.log(path);
          } });

      } } };


};var _underscore = require("underscore");var _ = (0, _interopRequireDefault2["default"])(_underscore)["default"];;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9icmVha3BvaW50LXBsdWdpbi5qcyJdLCJuYW1lcyI6WyJiYWJlbCIsInBhcnNlZCIsIkludGVycHJldGVyRGlyZWN0aXZlIiwiRGlyZWN0aXZlIiwiRGlyZWN0aXZlTGl0ZXJhbCIsIkJsb2NrU3RhdGVtZW50IiwiQnJlYWtTdGF0ZW1lbnQiLCJDYWxsRXhwcmVzc2lvbiIsIkNhdGNoQ2xhdXNlIiwiQ29uZGl0aW9uYWxFeHByZXNzaW9uIiwiQ29udGludWVTdGF0ZW1lbnQiLCJEZWJ1Z2dlclN0YXRlbWVudCIsIkRvV2hpbGVTdGF0ZW1lbnQiLCJFbXB0eVN0YXRlbWVudCIsIkV4cHJlc3Npb25TdGF0ZW1lbnQiLCJfIiwiZWFjaCIsInR5cGVzIiwiVFlQRVMiLCJ0eXBlIiwidmlzaXRvciIsIlByb2dyYW0iLCJwcm9ncmFtIiwib3B0cyIsInRyYXZlcnNlIiwicGF0aCIsImNvbnNvbGUiLCJsb2ciXSwibWFwcGluZ3MiOiI7QUFDZSxVQUFVQSxLQUFWLEVBQWlCO0FBQzVCLE1BQUlDLE1BQU0sR0FBRztBQUNULHVCQUFrQixJQURUO0FBRVQsNEJBQXVCLFVBRmQ7QUFHVCx3QkFBbUIsY0FIVjtBQUlUQyxJQUFBQSxvQkFBb0IsRUFBQyxHQUpaO0FBS1RDLElBQUFBLFNBQVMsRUFBQyxHQUxEO0FBTVRDLElBQUFBLGdCQUFnQixFQUFDLFlBTlI7QUFPVEMsSUFBQUEsY0FBYyw0QkFQTDtBQVFUQyxJQUFBQSxjQUFjLEVBQUMscUJBUk47QUFTVEMsSUFBQUEsY0FBYyxFQUFDLFlBVE47QUFVVEMsSUFBQUEsV0FBVyxFQUFDLFlBVkg7QUFXVEMsSUFBQUEscUJBQXFCLFNBWFo7QUFZVEMsSUFBQUEsaUJBQWlCLEVBQUMsd0JBWlQ7QUFhVEMsSUFBQUEsaUJBQWlCLEVBQUMsVUFiVDtBQWNUQyxJQUFBQSxnQkFBZ0IsRUFBQyxvQkFkUjtBQWVUQyxJQUFBQSxjQUFjLEVBQUMsU0FmTjtBQWdCVEMsSUFBQUEsbUJBQW1CLEVBQUMsTUFoQlgsRUFBYjs7QUFrQkFDLEVBQUFBLENBQUMsQ0FBQ0MsSUFBRixDQUFPaEIsS0FBSyxDQUFDaUIsS0FBTixDQUFZQyxLQUFuQixFQUF5QixVQUFDQyxJQUFELEVBQVE7O0FBRWhDLEdBRkQ7O0FBSUEsU0FBTztBQUNIQyxJQUFBQSxPQUFPLEVBQUU7QUFDTEMsTUFBQUEsT0FESyxtQkFDSUMsT0FESixRQUNxQixLQUFQQyxJQUFPLFFBQVBBLElBQU87QUFDdEJELFFBQUFBLE9BQU8sQ0FBQ0UsUUFBUixDQUFrQjtBQUNkLGNBRGMsY0FDUkMsSUFEUSxFQUNGO0FBQ1JDLFlBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZRixJQUFaO0FBQ0gsV0FIYSxFQUFsQjs7QUFLSCxPQVBJLEVBRE4sRUFBUDs7O0FBV0gsQyxDQW5DRCx3QyxJQUFPVixDLG1FQW1DTiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUnO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKGJhYmVsKSB7XG4gICAgbGV0IHBhcnNlZCA9IHtcbiAgICAgICAgJ0FycmF5RXhwcmVzc2lvbic6J1tdJyxcbiAgICAgICAgJ0Fzc2lnbm1lbnRFeHByZXNzaW9uJzonYXJyID0gMTsnLFxuICAgICAgICAnQmluYXJ5RXhwcmVzc2lvbic6J3ZhciBhID0gMSsyOycsXG4gICAgICAgIEludGVycHJldGVyRGlyZWN0aXZlOic/JyxcbiAgICAgICAgRGlyZWN0aXZlOic/JyxcbiAgICAgICAgRGlyZWN0aXZlTGl0ZXJhbDondXNlIHN0cmljdCcsXG4gICAgICAgIEJsb2NrU3RhdGVtZW50OmBmb3IgKHZhciBpPTA7aTwxMDtpKyspe31gLFxuICAgICAgICBCcmVha1N0YXRlbWVudDond2hpbGUodHJ1ZSl7YnJlYWs7fScsXG4gICAgICAgIENhbGxFeHByZXNzaW9uOidmLmFwcGx5KCk7JyxcbiAgICAgICAgQ2F0Y2hDbGF1c2U6J2NhdGNoKGUpe30nLFxuICAgICAgICBDb25kaXRpb25hbEV4cHJlc3Npb246YGk/MToyYCxcbiAgICAgICAgQ29udGludWVTdGF0ZW1lbnQ6J3doaWxlKHRydWUpe2NvbnRpbnVlO30nLFxuICAgICAgICBEZWJ1Z2dlclN0YXRlbWVudDonZGVidWdnZXInLFxuICAgICAgICBEb1doaWxlU3RhdGVtZW50OicgZG97IH13aGlsZSh0cnVlKXsnLFxuICAgICAgICBFbXB0eVN0YXRlbWVudDonbGFiZWw6OycsXG4gICAgICAgIEV4cHJlc3Npb25TdGF0ZW1lbnQ6J2YoKTsnXG4gICAgfVxuICAgIF8uZWFjaChiYWJlbC50eXBlcy5UWVBFUywodHlwZSk9PntcblxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdmlzaXRvcjoge1xuICAgICAgICAgICAgUHJvZ3JhbSAocHJvZ3JhbSwge29wdHN9KSB7XG4gICAgICAgICAgICAgICAgcHJvZ3JhbS50cmF2ZXJzZSAoe1xuICAgICAgICAgICAgICAgICAgICAnTGEnIChwYXRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhwYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTsiXX0=