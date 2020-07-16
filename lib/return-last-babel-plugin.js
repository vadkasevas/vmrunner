"use strict";var _interopRequireDefault3 = require("@babel/runtime/helpers/interopRequireDefault");var _interopRequireDefault2 = _interopRequireDefault3(require("@babel/runtime/helpers/interopRequireDefault"));Object.defineProperty(exports, "__esModule", { value: true });var _defineProperty2 = require("@babel/runtime/helpers/defineProperty");var _defineProperty = (0, _interopRequireDefault2["default"])(_defineProperty2)["default"];var _objectWithoutProperties2 = require("@babel/runtime/helpers/objectWithoutProperties");var _objectWithoutProperties = (0, _interopRequireDefault2["default"])(_objectWithoutProperties2)["default"];exports["default"] =










function (babel) {
  var types = babel.types;
  return {
    visitor: {
      /*
               Program(path,{opts}) {
                   if(opts.topLevel) {
                       maybeInjectReturn (path.node.body, {types, scope: path.scope});
                   }
               },
                // Named functions (sync or async): `function template() {}`
               FunctionDeclaration(path) {
                   maybeInjectReturn(path.node.body, { types, scope: path.scope });
               },
               // Anonymous functions: `const a = function() {}`
               */

      FunctionExpression: function FunctionExpression(path) {
        if (path.node.id && path.node.id.name == 'vmRunnerWrapper') {
          maybeInjectReturn(path.node.body, { types: types, scope: path.scope });
        }
      }
      /*
        // Arrow functions: `() => {}`
        ArrowFunctionExpression(path) {
            maybeInjectReturn(path.node.body, { types, scope: path.scope });
        },
        // Class methods
        // ```js
        // class aClass() {
        //   get property() {}
        //   set property(value) {}
        //   method() {}
        //   static staticMethod() {}
        // }
        // ```
        ClassMethod(path) {
            // Ignore constructors as there's no point injecting anything there
            // given their return value isn't actually returned to caller
            if (path.node.key.name !== 'constructor') {
                maybeInjectReturn(path.node.body, { types, scope: path.scope });
            }
        },
        // Object methods
        // ```js
        // {
        //   get property() {}
        //   set property(value) {}
        //   method() {}
        //   // key: function() {}
        //   // is a FunctionExpression
        // }
        // ```
        ObjectMethod(path) {
            maybeInjectReturn(path.node.body, { types, scope: path.scope });
        }
        */ } };



};function ownKeys(object, enumerableOnly) {var keys = Object.keys(object);if (Object.getOwnPropertySymbols) {var symbols = Object.getOwnPropertySymbols(object);if (enumerableOnly) symbols = symbols.filter(function (sym) {return Object.getOwnPropertyDescriptor(object, sym).enumerable;});keys.push.apply(keys, symbols);}return keys;}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};if (i % 2) {ownKeys(Object(source), true).forEach(function (key) {_defineProperty(target, key, source[key]);});} else if (Object.getOwnPropertyDescriptors) {Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));} else {ownKeys(Object(source)).forEach(function (key) {Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));});}}return target;};

// ## AST Traversal
// Because we need to traverse the statements last to first
// we need a custom traversal.
/**
 * Traverse the given node or array of nodes recursively to look for
 * last statements to process.
 * @param {Object|Array} node - The node or array of nodes to traverse
 * @param {Object} options
 * @param {Object} scope - The Babel `scope`, used for generating new identifiers
 * @param {Object} types - The Babel `types`, used for creating new nodes
 * @param {String|number} [key] - An optional key to look into on the given node (can also be an array index)
 * @param {boolean} [replace=true] - Whether to do the replacement or not (so fallthrough `case`s can be supported)
 * @param {Object} [resultsIdentifier] - An Identifier node into which to `push` the last statements of loops instead of returning them
 * @returns {Boolean|Object|undefined} - Return a node to replace the currently processed value with, or `false` to stop processing other nodes in an array
 */
function maybeInjectReturn(node) {var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},key = _ref.key,options = _objectWithoutProperties(_ref, ["key"]);
  // By default we want replacements to happen
  // unless a SwitchCase turns that off
  if (typeof options.replace === 'undefined') {
    options.replace = true;
  }
  // If provided a key, we're looking to inject return for
  // a specific key of the node
  if (typeof key !== 'undefined') {
    var updatedNode = maybeInjectReturn(node[key], options);
    // Replace the node if the node was transformed
    if (updatedNode) {
      node[key] = updatedNode;
    }
    // And halt the processing of current array
    if (typeof updatedNode !== 'undefined') {
      return false;
    }
    return;
  }

  // If provided an Array, we're looking to iterate over the nodes,
  // last to first.
  // IMPORTANT: This needs to be after the check for the key
  // to avoid infinite loop when calling
  if (Array.isArray(node)) {
    // For switches we want to only replace after we found a BreakStatement
    // We carry on the value for replacement
    var replace = options.afterBreak ? options.replace : true;
    for (var i = node.length; i--; i) {
      // And inject whichever value we found for our replacement
      var _updatedNode = maybeInjectReturn(node, _objectSpread({
        key: i },
      options, {
        replace: replace }));

      // Once we found a 'BreakStatement' we can start replacing
      if (node[i].type === 'BreakStatement') {
        replace = true;
      }
      // Stop iteracting as soon as we got something returned
      if (typeof _updatedNode !== 'undefined') {
        return false;
      }
    }
    return node;
  }
  // ### Traversal of individual statements
  switch (node.type) {
    // Main goal is to process expressions to return them
    case 'ExpressionStatement':{var
        types = options.types,_replace = options.replace,resultsIdentifier = options.resultsIdentifier;

        // First we need to check if we're actually allowed
        // to replace, in case we're in a `switch`.
        // Note that the actuall expression to return is
        // the `node.expression`, not the `ExpressionStatement` itself
        if (_replace) {
          var statement;
          // Now we need to process things slightly differently
          // whether we're inside a loop or not, marked by the
          // presence of a `resultsIdentifier` for the Array
          // in which to `push` the results of the loop
          if (resultsIdentifier) {
            // A bit of a mouthfull to write `<IdentifierName>.push(<NodeExpression>)`
            statement = types.ExpressionStatement(
            types.CallExpression(
            types.MemberExpression(
            resultsIdentifier,
            types.Identifier('push')),

            [node.expression]));


          } else {
            // In all other cases, we wrap the expression with a return
            statement = types.ReturnStatement(node.expression);
          }

          // And make sure comments end up on the wrapping node
          moveComments(node, statement);
          return statement;
        }
        return;
      }
    // If we find a return or throw, we skip
    // Same with `debugger;` and `continue` statements,
    // which shouldn't be short-circuited by an early return
    case 'ReturnStatement':
    case 'ThrowStatement':
    case 'DebuggerStatement':
    case 'ContinueStatement':{
        return false;
      }
    // `if` statements need both their branches visited
    case 'IfStatement':{
        maybeInjectReturn(node, _objectSpread({ key: 'consequent' }, options));
        if (node.alternate) {
          maybeInjectReturn(node, _objectSpread({ key: 'alternate' }, options));
        }
        // Either we'll have injected returns as needed
        // or there will have been some returns already
        // so we can stop there
        return false;
      }
    // `with` blocks only have one body
    // and so do labeledstatements `label: const a = 5;`
    case 'LabeledStatement':
    case 'WithStatement':{
        return maybeInjectReturn(node, _objectSpread({ key: 'body' }, options));
      }
    // We only want to mess with the `try` block
    // `catch` might yield unexpected values being returned
    // so best leave to an explicit return
    // `finally` is even worse: it would return before the `try`
    // so a definite no go:
    // https://eslint.org/docs/rules/no-unsafe-finally
    case 'TryStatement':{
        maybeInjectReturn(node, _objectSpread({ key: 'block' }, options));
        return false;
      }
    // Blocks will have multiple statements in their body,
    // we'll need to traverse them last to first
    case 'BlockStatement':{
        var update = maybeInjectReturn(node, _objectSpread({ key: 'body' }, options));
        if (typeof update !== 'undefined') {
          return false;
        }
        return;
      }
    // `switch` statements need their own processing
    // - each case/default statement can either host a block or an array of statements
    // - we should only inject returns after we found a "break" in `case` statements.
    //   The following `case`/`default` gets run
    //   if there is no `break` and adding a return would prevent that.
    //   While it's recommended not to fallthrough (https://eslint.org/docs/rules/no-fallthrough)
    //   there are some valid use cases, so we need to handle it
    case 'SwitchStatement':{
        node.cases.forEach(function (switchCase) {
          maybeInjectReturn(switchCase, _objectSpread({},
          options, {
            key: 'consequent',
            afterBreak: !!switchCase.test, // Only replace if a break exists for `case`, not `default`
            replace: false }));

        });
        return false;
      }
    // Loops need their own processing too. We need to aggregate their data
    // in an array and then return that array
    case 'ForStatement':
    case 'DoWhileStatement':
    case 'WhileStatement':
    case 'ForInStatement':
    case 'ForOfStatement':{
        return wrapLoopNode(node, options);
      }
    case 'FunctionDeclaration':{
        var expressionStatement = options.types.functionExpression(node.id, node.params, node.body, node.generator, node.async);
        moveComments(node, expressionStatement);
        return options.types.ReturnStatement(expressionStatement);
      }
    // Class declarations need to be turned into ClassExpressions
    // That can be returned as a regular expression
    case 'ClassDeclaration':{
        node.type = 'ClassExpression';
        // We still need to handle it like a regular expression
        // at that point, so let's go for another round
        var _expressionStatement = options.types.ExpressionStatement(node);
        moveComments(node, _expressionStatement);
        return maybeInjectReturn(_expressionStatement, options);
      }}

}

// ## Supporting functions
/**
 * @param {Object} fromNode
 * @param {Object} toNode
 */
function moveComments(fromNode, toNode) {
  toNode.leadingComments = fromNode.leadingComments;
  toNode.trailingComments = fromNode.trailingComments;
  fromNode.leadingComments = null;
  fromNode.trailingComments = null;
}

// We need to add a variable declaration before loops,
// and then return that variable. Quite a block to have
// in the main traversal, so it's in its own function instead.
/**
 * @param {Object} node - The loop node
 * @param {Object} options
 * @param {Object} options.types
 * @param {Object} options.scope
 * @param {Object} options.resultsIdentifier
 */
function wrapLoopNode(node, options) {var
  types = options.types,scope = options.scope;
  // A parent loop might have already created a variable
  // to push into, so we only create on if needed
  var identifier =
  options.resultsIdentifier || scope.generateUidIdentifier('result');

  // Then we can process the content of the loop
  maybeInjectReturn(node, _objectSpread({},
  options, {
    key: 'body',
    resultsIdentifier: identifier }));


  // And finally wrap it only if we created the identifiers beforehand
  if (options.resultsIdentifier) {
    // Just like the other blocks, we consider that either
    // we'll have added a return, or there was one (or a `continue`) already
    // so we stop traversing siblings
    return false;
  } else {
    // We don't have access to `replaceWithMultiple` as we need
    // our own traversal so we replace the for with our own block
    // of commands
    return types.BlockStatement([
    // Using `var` allows terser (maybe other minifiers too) to eliminate the block we just created
    // if it is unnecessary. With `const` or `let`, the variable would be
    // scoped to the block, so terser wouldn't be able to know if it's safe
    // to eliminate the block or not
    types.VariableDeclaration('var', [
    types.VariableDeclarator(identifier, types.ArrayExpression())]),

    node,
    types.ReturnStatement(identifier)]);

  }
}

// Little utility for outputing the name of a node
// cleanly (that is without dumping a whole object
// in the console)
// eslint-disable-next-line no-unused-vars
function nodeDebugName(node) {
  if (typeof node === 'undefined') return 'undefined';
  if (Array.isArray(node)) {
    return 'Array';
  }
  return node && node.type || node;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yZXR1cm4tbGFzdC1iYWJlbC1wbHVnaW4uanMiXSwibmFtZXMiOlsiYmFiZWwiLCJ0eXBlcyIsInZpc2l0b3IiLCJGdW5jdGlvbkV4cHJlc3Npb24iLCJwYXRoIiwibm9kZSIsImlkIiwibmFtZSIsIm1heWJlSW5qZWN0UmV0dXJuIiwiYm9keSIsInNjb3BlIiwia2V5Iiwib3B0aW9ucyIsInJlcGxhY2UiLCJ1cGRhdGVkTm9kZSIsIkFycmF5IiwiaXNBcnJheSIsImFmdGVyQnJlYWsiLCJpIiwibGVuZ3RoIiwidHlwZSIsInJlc3VsdHNJZGVudGlmaWVyIiwic3RhdGVtZW50IiwiRXhwcmVzc2lvblN0YXRlbWVudCIsIkNhbGxFeHByZXNzaW9uIiwiTWVtYmVyRXhwcmVzc2lvbiIsIklkZW50aWZpZXIiLCJleHByZXNzaW9uIiwiUmV0dXJuU3RhdGVtZW50IiwibW92ZUNvbW1lbnRzIiwiYWx0ZXJuYXRlIiwidXBkYXRlIiwiY2FzZXMiLCJmb3JFYWNoIiwic3dpdGNoQ2FzZSIsInRlc3QiLCJ3cmFwTG9vcE5vZGUiLCJleHByZXNzaW9uU3RhdGVtZW50IiwiZnVuY3Rpb25FeHByZXNzaW9uIiwicGFyYW1zIiwiZ2VuZXJhdG9yIiwiYXN5bmMiLCJmcm9tTm9kZSIsInRvTm9kZSIsImxlYWRpbmdDb21tZW50cyIsInRyYWlsaW5nQ29tbWVudHMiLCJpZGVudGlmaWVyIiwiZ2VuZXJhdGVVaWRJZGVudGlmaWVyIiwiQmxvY2tTdGF0ZW1lbnQiLCJWYXJpYWJsZURlY2xhcmF0aW9uIiwiVmFyaWFibGVEZWNsYXJhdG9yIiwiQXJyYXlFeHByZXNzaW9uIiwibm9kZURlYnVnTmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFXZSxVQUFTQSxLQUFULEVBQWdCO0FBQzNCLE1BQU1DLEtBQUssR0FBR0QsS0FBSyxDQUFDQyxLQUFwQjtBQUNBLFNBQU87QUFDSEMsSUFBQUEsT0FBTyxFQUFFO0FBQ0w7Ozs7Ozs7Ozs7Ozs7QUFhQUMsTUFBQUEs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QUNWTyxFQUFBQSxPQURVO0FBRWJELElBQUFBLEdBQUcsRUFBRSxNQUZRO0FBR2JVLElBQUFBLGlCQUFpQixFQUFFeUIsVUFITixJQUFqQjs7O0FBTUE7QUFDQSxNQUFJbEMsT0FBTyxDQUFDUyxpQkFBWixFQUErQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQSxXQUFPLEtBQVA7QUFDSCxHQUxELE1BS087QUFDSDtBQUNBO0FBQ0E7QUFDQSxXQUFPcEIsS0FBSyxDQUFDK0MsY0FBTixDQUFxQjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBL0MsSUFBQUEsS0FBSyxDQUFDZ0QsbUJBQU4sQ0FBMEIsS0FBMUIsRUFBaUM7QUFDN0JoRCxJQUFBQSxLQUFLLENBQUNpRCxrQkFBTixDQUF5QkosVUFBekIsRUFBcUM3QyxLQUFLLENBQUNrRCxlQUFOLEVBQXJDLENBRDZCLENBQWpDLENBTHdCOztBQVF4QjlDLElBQUFBLElBUndCO0FBU3hCSixJQUFBQSxLQUFLLENBQUMyQixlQUFOLENBQXNCa0IsVUFBdEIsQ0FUd0IsQ0FBckIsQ0FBUDs7QUFXSDtBQUNKOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBU00sYUFBVCxDQUF1Qi9DLElBQXZCLEVBQTZCO0FBQ3pCLE1BQUksT0FBT0EsSUFBUCxLQUFnQixXQUFwQixFQUFpQyxPQUFPLFdBQVA7QUFDakMsTUFBSVUsS0FBSyxDQUFDQyxPQUFOLENBQWNYLElBQWQsQ0FBSixFQUF5QjtBQUNyQixXQUFPLE9BQVA7QUFDSDtBQUNELFNBQVFBLElBQUksSUFBSUEsSUFBSSxDQUFDZSxJQUFkLElBQXVCZixJQUE5QjtBQUNIIiwic291cmNlc0NvbnRlbnQiOlsiLy8gIyBiYWJlbC1wbHVnaW4tdHJhbnNmb3JtLWxhc3Qtc3RhdGVtZW50XG5cbi8vICMjIFRoZSBwbHVnaW4gaXRzZWxmXG4vKipcbiAqIENyZWF0ZXMgdGhlIHBsdWdpbiBpdHNlbGYsIGdyYWJiaW5nIHdoYXQncyBuZWVkZWQgZnJvbVxuICogdGhlIGJhYmVsIG9iamVjdCBzZXQgYnkgQmFiZWwgYW5kIHRoZSBvcHRpb25zIHBhc3NlZCBieSB0aGUgY29uZmlndXJhdGlvblxuICogQHBhcmFtIHtPYmplY3R9IGJhYmVsXG4gKiBAcGFyYW0ge09iamVjdH0gYmFiZWwudHlwZXMgLSBUaGUgdHlwZXNcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnRvcExldmVsPWZhbHNlXSAtIFdoZXRoZXIgdG8gcHJvY2VzcyB0aGUgbGFzdCBzdGF0ZW1lbnQgb2YgdGhlIHByb2dyYW1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oYmFiZWwpIHtcbiAgICBjb25zdCB0eXBlcyA9IGJhYmVsLnR5cGVzO1xuICAgIHJldHVybiB7XG4gICAgICAgIHZpc2l0b3I6IHtcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICBQcm9ncmFtKHBhdGgse29wdHN9KSB7XG4gICAgICAgICAgICAgICAgaWYob3B0cy50b3BMZXZlbCkge1xuICAgICAgICAgICAgICAgICAgICBtYXliZUluamVjdFJldHVybiAocGF0aC5ub2RlLmJvZHksIHt0eXBlcywgc2NvcGU6IHBhdGguc2NvcGV9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyBOYW1lZCBmdW5jdGlvbnMgKHN5bmMgb3IgYXN5bmMpOiBgZnVuY3Rpb24gdGVtcGxhdGUoKSB7fWBcbiAgICAgICAgICAgIEZ1bmN0aW9uRGVjbGFyYXRpb24ocGF0aCkge1xuICAgICAgICAgICAgICAgIG1heWJlSW5qZWN0UmV0dXJuKHBhdGgubm9kZS5ib2R5LCB7IHR5cGVzLCBzY29wZTogcGF0aC5zY29wZSB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvLyBBbm9ueW1vdXMgZnVuY3Rpb25zOiBgY29uc3QgYSA9IGZ1bmN0aW9uKCkge31gXG4gICAgICAgICAgICAqL1xuICAgICAgICAgICAgRnVuY3Rpb25FeHByZXNzaW9uKHBhdGgpIHtcbiAgICAgICAgICAgICAgICBpZihwYXRoLm5vZGUuaWQgJiYgcGF0aC5ub2RlLmlkLm5hbWUgPT0ndm1SdW5uZXJXcmFwcGVyJyl7XG4gICAgICAgICAgICAgICAgICAgIG1heWJlSW5qZWN0UmV0dXJuKHBhdGgubm9kZS5ib2R5LCB7IHR5cGVzLCBzY29wZTogcGF0aC5zY29wZSB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIC8vIEFycm93IGZ1bmN0aW9uczogYCgpID0+IHt9YFxuICAgICAgICAgICAgQXJyb3dGdW5jdGlvbkV4cHJlc3Npb24ocGF0aCkge1xuICAgICAgICAgICAgICAgIG1heWJlSW5qZWN0UmV0dXJuKHBhdGgubm9kZS5ib2R5LCB7IHR5cGVzLCBzY29wZTogcGF0aC5zY29wZSB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvLyBDbGFzcyBtZXRob2RzXG4gICAgICAgICAgICAvLyBgYGBqc1xuICAgICAgICAgICAgLy8gY2xhc3MgYUNsYXNzKCkge1xuICAgICAgICAgICAgLy8gICBnZXQgcHJvcGVydHkoKSB7fVxuICAgICAgICAgICAgLy8gICBzZXQgcHJvcGVydHkodmFsdWUpIHt9XG4gICAgICAgICAgICAvLyAgIG1ldGhvZCgpIHt9XG4gICAgICAgICAgICAvLyAgIHN0YXRpYyBzdGF0aWNNZXRob2QoKSB7fVxuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgLy8gYGBgXG4gICAgICAgICAgICBDbGFzc01ldGhvZChwYXRoKSB7XG4gICAgICAgICAgICAgICAgLy8gSWdub3JlIGNvbnN0cnVjdG9ycyBhcyB0aGVyZSdzIG5vIHBvaW50IGluamVjdGluZyBhbnl0aGluZyB0aGVyZVxuICAgICAgICAgICAgICAgIC8vIGdpdmVuIHRoZWlyIHJldHVybiB2YWx1ZSBpc24ndCBhY3R1YWxseSByZXR1cm5lZCB0byBjYWxsZXJcbiAgICAgICAgICAgICAgICBpZiAocGF0aC5ub2RlLmtleS5uYW1lICE9PSAnY29uc3RydWN0b3InKSB7XG4gICAgICAgICAgICAgICAgICAgIG1heWJlSW5qZWN0UmV0dXJuKHBhdGgubm9kZS5ib2R5LCB7IHR5cGVzLCBzY29wZTogcGF0aC5zY29wZSB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLy8gT2JqZWN0IG1ldGhvZHNcbiAgICAgICAgICAgIC8vIGBgYGpzXG4gICAgICAgICAgICAvLyB7XG4gICAgICAgICAgICAvLyAgIGdldCBwcm9wZXJ0eSgpIHt9XG4gICAgICAgICAgICAvLyAgIHNldCBwcm9wZXJ0eSh2YWx1ZSkge31cbiAgICAgICAgICAgIC8vICAgbWV0aG9kKCkge31cbiAgICAgICAgICAgIC8vICAgLy8ga2V5OiBmdW5jdGlvbigpIHt9XG4gICAgICAgICAgICAvLyAgIC8vIGlzIGEgRnVuY3Rpb25FeHByZXNzaW9uXG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAvLyBgYGBcbiAgICAgICAgICAgIE9iamVjdE1ldGhvZChwYXRoKSB7XG4gICAgICAgICAgICAgICAgbWF5YmVJbmplY3RSZXR1cm4ocGF0aC5ub2RlLmJvZHksIHsgdHlwZXMsIHNjb3BlOiBwYXRoLnNjb3BlIH0pO1xuICAgICAgICAgICAgfVxuXG4qL1xuICAgICAgICB9XG4gICAgfTtcbn07XG5cbi8vICMjIEFTVCBUcmF2ZXJzYWxcbi8vIEJlY2F1c2Ugd2UgbmVlZCB0byB0cmF2ZXJzZSB0aGUgc3RhdGVtZW50cyBsYXN0IHRvIGZpcnN0XG4vLyB3ZSBuZWVkIGEgY3VzdG9tIHRyYXZlcnNhbC5cbi8qKlxuICogVHJhdmVyc2UgdGhlIGdpdmVuIG5vZGUgb3IgYXJyYXkgb2Ygbm9kZXMgcmVjdXJzaXZlbHkgdG8gbG9vayBmb3JcbiAqIGxhc3Qgc3RhdGVtZW50cyB0byBwcm9jZXNzLlxuICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IG5vZGUgLSBUaGUgbm9kZSBvciBhcnJheSBvZiBub2RlcyB0byB0cmF2ZXJzZVxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7T2JqZWN0fSBzY29wZSAtIFRoZSBCYWJlbCBgc2NvcGVgLCB1c2VkIGZvciBnZW5lcmF0aW5nIG5ldyBpZGVudGlmaWVyc1xuICogQHBhcmFtIHtPYmplY3R9IHR5cGVzIC0gVGhlIEJhYmVsIGB0eXBlc2AsIHVzZWQgZm9yIGNyZWF0aW5nIG5ldyBub2Rlc1xuICogQHBhcmFtIHtTdHJpbmd8bnVtYmVyfSBba2V5XSAtIEFuIG9wdGlvbmFsIGtleSB0byBsb29rIGludG8gb24gdGhlIGdpdmVuIG5vZGUgKGNhbiBhbHNvIGJlIGFuIGFycmF5IGluZGV4KVxuICogQHBhcmFtIHtib29sZWFufSBbcmVwbGFjZT10cnVlXSAtIFdoZXRoZXIgdG8gZG8gdGhlIHJlcGxhY2VtZW50IG9yIG5vdCAoc28gZmFsbHRocm91Z2ggYGNhc2VgcyBjYW4gYmUgc3VwcG9ydGVkKVxuICogQHBhcmFtIHtPYmplY3R9IFtyZXN1bHRzSWRlbnRpZmllcl0gLSBBbiBJZGVudGlmaWVyIG5vZGUgaW50byB3aGljaCB0byBgcHVzaGAgdGhlIGxhc3Qgc3RhdGVtZW50cyBvZiBsb29wcyBpbnN0ZWFkIG9mIHJldHVybmluZyB0aGVtXG4gKiBAcmV0dXJucyB7Qm9vbGVhbnxPYmplY3R8dW5kZWZpbmVkfSAtIFJldHVybiBhIG5vZGUgdG8gcmVwbGFjZSB0aGUgY3VycmVudGx5IHByb2Nlc3NlZCB2YWx1ZSB3aXRoLCBvciBgZmFsc2VgIHRvIHN0b3AgcHJvY2Vzc2luZyBvdGhlciBub2RlcyBpbiBhbiBhcnJheVxuICovXG5mdW5jdGlvbiBtYXliZUluamVjdFJldHVybihub2RlLCB7IGtleSwgLi4ub3B0aW9ucyB9ID0ge30pIHtcbiAgICAvLyBCeSBkZWZhdWx0IHdlIHdhbnQgcmVwbGFjZW1lbnRzIHRvIGhhcHBlblxuICAgIC8vIHVubGVzcyBhIFN3aXRjaENhc2UgdHVybnMgdGhhdCBvZmZcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMucmVwbGFjZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgb3B0aW9ucy5yZXBsYWNlID0gdHJ1ZTtcbiAgICB9XG4gICAgLy8gSWYgcHJvdmlkZWQgYSBrZXksIHdlJ3JlIGxvb2tpbmcgdG8gaW5qZWN0IHJldHVybiBmb3JcbiAgICAvLyBhIHNwZWNpZmljIGtleSBvZiB0aGUgbm9kZVxuICAgIGlmICh0eXBlb2Yga2V5ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBjb25zdCB1cGRhdGVkTm9kZSA9IG1heWJlSW5qZWN0UmV0dXJuKG5vZGVba2V5XSwgb3B0aW9ucyk7XG4gICAgICAgIC8vIFJlcGxhY2UgdGhlIG5vZGUgaWYgdGhlIG5vZGUgd2FzIHRyYW5zZm9ybWVkXG4gICAgICAgIGlmICh1cGRhdGVkTm9kZSkge1xuICAgICAgICAgICAgbm9kZVtrZXldID0gdXBkYXRlZE5vZGU7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQW5kIGhhbHQgdGhlIHByb2Nlc3Npbmcgb2YgY3VycmVudCBhcnJheVxuICAgICAgICBpZiAodHlwZW9mIHVwZGF0ZWROb2RlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBJZiBwcm92aWRlZCBhbiBBcnJheSwgd2UncmUgbG9va2luZyB0byBpdGVyYXRlIG92ZXIgdGhlIG5vZGVzLFxuICAgIC8vIGxhc3QgdG8gZmlyc3QuXG4gICAgLy8gSU1QT1JUQU5UOiBUaGlzIG5lZWRzIHRvIGJlIGFmdGVyIHRoZSBjaGVjayBmb3IgdGhlIGtleVxuICAgIC8vIHRvIGF2b2lkIGluZmluaXRlIGxvb3Agd2hlbiBjYWxsaW5nXG4gICAgaWYgKEFycmF5LmlzQXJyYXkobm9kZSkpIHtcbiAgICAgICAgLy8gRm9yIHN3aXRjaGVzIHdlIHdhbnQgdG8gb25seSByZXBsYWNlIGFmdGVyIHdlIGZvdW5kIGEgQnJlYWtTdGF0ZW1lbnRcbiAgICAgICAgLy8gV2UgY2Fycnkgb24gdGhlIHZhbHVlIGZvciByZXBsYWNlbWVudFxuICAgICAgICBsZXQgcmVwbGFjZSA9IG9wdGlvbnMuYWZ0ZXJCcmVhayA/IG9wdGlvbnMucmVwbGFjZSA6IHRydWU7XG4gICAgICAgIGZvciAodmFyIGkgPSBub2RlLmxlbmd0aDsgaS0tOyBpKSB7XG4gICAgICAgICAgICAvLyBBbmQgaW5qZWN0IHdoaWNoZXZlciB2YWx1ZSB3ZSBmb3VuZCBmb3Igb3VyIHJlcGxhY2VtZW50XG4gICAgICAgICAgICBjb25zdCB1cGRhdGVkTm9kZSA9IG1heWJlSW5qZWN0UmV0dXJuKG5vZGUsIHtcbiAgICAgICAgICAgICAgICBrZXk6IGksXG4gICAgICAgICAgICAgICAgLi4ub3B0aW9ucyxcbiAgICAgICAgICAgICAgICByZXBsYWNlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIE9uY2Ugd2UgZm91bmQgYSAnQnJlYWtTdGF0ZW1lbnQnIHdlIGNhbiBzdGFydCByZXBsYWNpbmdcbiAgICAgICAgICAgIGlmIChub2RlW2ldLnR5cGUgPT09ICdCcmVha1N0YXRlbWVudCcpIHtcbiAgICAgICAgICAgICAgICByZXBsYWNlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFN0b3AgaXRlcmFjdGluZyBhcyBzb29uIGFzIHdlIGdvdCBzb21ldGhpbmcgcmV0dXJuZWRcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdXBkYXRlZE5vZGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH1cbiAgICAvLyAjIyMgVHJhdmVyc2FsIG9mIGluZGl2aWR1YWwgc3RhdGVtZW50c1xuICAgIHN3aXRjaCAobm9kZS50eXBlKSB7XG4gICAgICAgIC8vIE1haW4gZ29hbCBpcyB0byBwcm9jZXNzIGV4cHJlc3Npb25zIHRvIHJldHVybiB0aGVtXG4gICAgICAgIGNhc2UgJ0V4cHJlc3Npb25TdGF0ZW1lbnQnOiB7XG4gICAgICAgICAgICBjb25zdCB7IHR5cGVzLCByZXBsYWNlLCByZXN1bHRzSWRlbnRpZmllciB9ID0gb3B0aW9ucztcblxuICAgICAgICAgICAgLy8gRmlyc3Qgd2UgbmVlZCB0byBjaGVjayBpZiB3ZSdyZSBhY3R1YWxseSBhbGxvd2VkXG4gICAgICAgICAgICAvLyB0byByZXBsYWNlLCBpbiBjYXNlIHdlJ3JlIGluIGEgYHN3aXRjaGAuXG4gICAgICAgICAgICAvLyBOb3RlIHRoYXQgdGhlIGFjdHVhbGwgZXhwcmVzc2lvbiB0byByZXR1cm4gaXNcbiAgICAgICAgICAgIC8vIHRoZSBgbm9kZS5leHByZXNzaW9uYCwgbm90IHRoZSBgRXhwcmVzc2lvblN0YXRlbWVudGAgaXRzZWxmXG4gICAgICAgICAgICBpZiAocmVwbGFjZSkge1xuICAgICAgICAgICAgICAgIGxldCBzdGF0ZW1lbnQ7XG4gICAgICAgICAgICAgICAgLy8gTm93IHdlIG5lZWQgdG8gcHJvY2VzcyB0aGluZ3Mgc2xpZ2h0bHkgZGlmZmVyZW50bHlcbiAgICAgICAgICAgICAgICAvLyB3aGV0aGVyIHdlJ3JlIGluc2lkZSBhIGxvb3Agb3Igbm90LCBtYXJrZWQgYnkgdGhlXG4gICAgICAgICAgICAgICAgLy8gcHJlc2VuY2Ugb2YgYSBgcmVzdWx0c0lkZW50aWZpZXJgIGZvciB0aGUgQXJyYXlcbiAgICAgICAgICAgICAgICAvLyBpbiB3aGljaCB0byBgcHVzaGAgdGhlIHJlc3VsdHMgb2YgdGhlIGxvb3BcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0c0lkZW50aWZpZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQSBiaXQgb2YgYSBtb3V0aGZ1bGwgdG8gd3JpdGUgYDxJZGVudGlmaWVyTmFtZT4ucHVzaCg8Tm9kZUV4cHJlc3Npb24+KWBcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVtZW50ID0gdHlwZXMuRXhwcmVzc2lvblN0YXRlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVzLkNhbGxFeHByZXNzaW9uKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVzLk1lbWJlckV4cHJlc3Npb24oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdHNJZGVudGlmaWVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlcy5JZGVudGlmaWVyKCdwdXNoJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtub2RlLmV4cHJlc3Npb25dXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSW4gYWxsIG90aGVyIGNhc2VzLCB3ZSB3cmFwIHRoZSBleHByZXNzaW9uIHdpdGggYSByZXR1cm5cbiAgICAgICAgICAgICAgICAgICAgc3RhdGVtZW50ID0gdHlwZXMuUmV0dXJuU3RhdGVtZW50KG5vZGUuZXhwcmVzc2lvbik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gQW5kIG1ha2Ugc3VyZSBjb21tZW50cyBlbmQgdXAgb24gdGhlIHdyYXBwaW5nIG5vZGVcbiAgICAgICAgICAgICAgICBtb3ZlQ29tbWVudHMobm9kZSwgc3RhdGVtZW50KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGVtZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIElmIHdlIGZpbmQgYSByZXR1cm4gb3IgdGhyb3csIHdlIHNraXBcbiAgICAgICAgLy8gU2FtZSB3aXRoIGBkZWJ1Z2dlcjtgIGFuZCBgY29udGludWVgIHN0YXRlbWVudHMsXG4gICAgICAgIC8vIHdoaWNoIHNob3VsZG4ndCBiZSBzaG9ydC1jaXJjdWl0ZWQgYnkgYW4gZWFybHkgcmV0dXJuXG4gICAgICAgIGNhc2UgJ1JldHVyblN0YXRlbWVudCc6XG4gICAgICAgIGNhc2UgJ1Rocm93U3RhdGVtZW50JzpcbiAgICAgICAgY2FzZSAnRGVidWdnZXJTdGF0ZW1lbnQnOlxuICAgICAgICBjYXNlICdDb250aW51ZVN0YXRlbWVudCc6IHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBgaWZgIHN0YXRlbWVudHMgbmVlZCBib3RoIHRoZWlyIGJyYW5jaGVzIHZpc2l0ZWRcbiAgICAgICAgY2FzZSAnSWZTdGF0ZW1lbnQnOiB7XG4gICAgICAgICAgICBtYXliZUluamVjdFJldHVybihub2RlLCB7IGtleTogJ2NvbnNlcXVlbnQnLCAuLi5vcHRpb25zIH0pO1xuICAgICAgICAgICAgaWYgKG5vZGUuYWx0ZXJuYXRlKSB7XG4gICAgICAgICAgICAgICAgbWF5YmVJbmplY3RSZXR1cm4obm9kZSwgeyBrZXk6ICdhbHRlcm5hdGUnLCAuLi5vcHRpb25zIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gRWl0aGVyIHdlJ2xsIGhhdmUgaW5qZWN0ZWQgcmV0dXJucyBhcyBuZWVkZWRcbiAgICAgICAgICAgIC8vIG9yIHRoZXJlIHdpbGwgaGF2ZSBiZWVuIHNvbWUgcmV0dXJucyBhbHJlYWR5XG4gICAgICAgICAgICAvLyBzbyB3ZSBjYW4gc3RvcCB0aGVyZVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIC8vIGB3aXRoYCBibG9ja3Mgb25seSBoYXZlIG9uZSBib2R5XG4gICAgICAgIC8vIGFuZCBzbyBkbyBsYWJlbGVkc3RhdGVtZW50cyBgbGFiZWw6IGNvbnN0IGEgPSA1O2BcbiAgICAgICAgY2FzZSAnTGFiZWxlZFN0YXRlbWVudCc6XG4gICAgICAgIGNhc2UgJ1dpdGhTdGF0ZW1lbnQnOiB7XG4gICAgICAgICAgICByZXR1cm4gbWF5YmVJbmplY3RSZXR1cm4obm9kZSwgeyBrZXk6ICdib2R5JywgLi4ub3B0aW9ucyB9KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBXZSBvbmx5IHdhbnQgdG8gbWVzcyB3aXRoIHRoZSBgdHJ5YCBibG9ja1xuICAgICAgICAvLyBgY2F0Y2hgIG1pZ2h0IHlpZWxkIHVuZXhwZWN0ZWQgdmFsdWVzIGJlaW5nIHJldHVybmVkXG4gICAgICAgIC8vIHNvIGJlc3QgbGVhdmUgdG8gYW4gZXhwbGljaXQgcmV0dXJuXG4gICAgICAgIC8vIGBmaW5hbGx5YCBpcyBldmVuIHdvcnNlOiBpdCB3b3VsZCByZXR1cm4gYmVmb3JlIHRoZSBgdHJ5YFxuICAgICAgICAvLyBzbyBhIGRlZmluaXRlIG5vIGdvOlxuICAgICAgICAvLyBodHRwczovL2VzbGludC5vcmcvZG9jcy9ydWxlcy9uby11bnNhZmUtZmluYWxseVxuICAgICAgICBjYXNlICdUcnlTdGF0ZW1lbnQnOiB7XG4gICAgICAgICAgICBtYXliZUluamVjdFJldHVybihub2RlLCB7IGtleTogJ2Jsb2NrJywgLi4ub3B0aW9ucyB9KTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBCbG9ja3Mgd2lsbCBoYXZlIG11bHRpcGxlIHN0YXRlbWVudHMgaW4gdGhlaXIgYm9keSxcbiAgICAgICAgLy8gd2UnbGwgbmVlZCB0byB0cmF2ZXJzZSB0aGVtIGxhc3QgdG8gZmlyc3RcbiAgICAgICAgY2FzZSAnQmxvY2tTdGF0ZW1lbnQnOiB7XG4gICAgICAgICAgICBjb25zdCB1cGRhdGUgPSBtYXliZUluamVjdFJldHVybihub2RlLCB7IGtleTogJ2JvZHknLCAuLi5vcHRpb25zIH0pO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB1cGRhdGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIGBzd2l0Y2hgIHN0YXRlbWVudHMgbmVlZCB0aGVpciBvd24gcHJvY2Vzc2luZ1xuICAgICAgICAvLyAtIGVhY2ggY2FzZS9kZWZhdWx0IHN0YXRlbWVudCBjYW4gZWl0aGVyIGhvc3QgYSBibG9jayBvciBhbiBhcnJheSBvZiBzdGF0ZW1lbnRzXG4gICAgICAgIC8vIC0gd2Ugc2hvdWxkIG9ubHkgaW5qZWN0IHJldHVybnMgYWZ0ZXIgd2UgZm91bmQgYSBcImJyZWFrXCIgaW4gYGNhc2VgIHN0YXRlbWVudHMuXG4gICAgICAgIC8vICAgVGhlIGZvbGxvd2luZyBgY2FzZWAvYGRlZmF1bHRgIGdldHMgcnVuXG4gICAgICAgIC8vICAgaWYgdGhlcmUgaXMgbm8gYGJyZWFrYCBhbmQgYWRkaW5nIGEgcmV0dXJuIHdvdWxkIHByZXZlbnQgdGhhdC5cbiAgICAgICAgLy8gICBXaGlsZSBpdCdzIHJlY29tbWVuZGVkIG5vdCB0byBmYWxsdGhyb3VnaCAoaHR0cHM6Ly9lc2xpbnQub3JnL2RvY3MvcnVsZXMvbm8tZmFsbHRocm91Z2gpXG4gICAgICAgIC8vICAgdGhlcmUgYXJlIHNvbWUgdmFsaWQgdXNlIGNhc2VzLCBzbyB3ZSBuZWVkIHRvIGhhbmRsZSBpdFxuICAgICAgICBjYXNlICdTd2l0Y2hTdGF0ZW1lbnQnOiB7XG4gICAgICAgICAgICBub2RlLmNhc2VzLmZvckVhY2goc3dpdGNoQ2FzZSA9PiB7XG4gICAgICAgICAgICAgICAgbWF5YmVJbmplY3RSZXR1cm4oc3dpdGNoQ2FzZSwge1xuICAgICAgICAgICAgICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICAgICAgICAgICAgICBrZXk6ICdjb25zZXF1ZW50JyxcbiAgICAgICAgICAgICAgICAgICAgYWZ0ZXJCcmVhazogISFzd2l0Y2hDYXNlLnRlc3QsIC8vIE9ubHkgcmVwbGFjZSBpZiBhIGJyZWFrIGV4aXN0cyBmb3IgYGNhc2VgLCBub3QgYGRlZmF1bHRgXG4gICAgICAgICAgICAgICAgICAgIHJlcGxhY2U6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBMb29wcyBuZWVkIHRoZWlyIG93biBwcm9jZXNzaW5nIHRvby4gV2UgbmVlZCB0byBhZ2dyZWdhdGUgdGhlaXIgZGF0YVxuICAgICAgICAvLyBpbiBhbiBhcnJheSBhbmQgdGhlbiByZXR1cm4gdGhhdCBhcnJheVxuICAgICAgICBjYXNlICdGb3JTdGF0ZW1lbnQnOlxuICAgICAgICBjYXNlICdEb1doaWxlU3RhdGVtZW50JzpcbiAgICAgICAgY2FzZSAnV2hpbGVTdGF0ZW1lbnQnOlxuICAgICAgICBjYXNlICdGb3JJblN0YXRlbWVudCc6XG4gICAgICAgIGNhc2UgJ0Zvck9mU3RhdGVtZW50Jzoge1xuICAgICAgICAgICAgcmV0dXJuIHdyYXBMb29wTm9kZShub2RlLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICBjYXNlICdGdW5jdGlvbkRlY2xhcmF0aW9uJzoge1xuICAgICAgICAgICAgY29uc3QgZXhwcmVzc2lvblN0YXRlbWVudCA9IG9wdGlvbnMudHlwZXMuZnVuY3Rpb25FeHByZXNzaW9uKG5vZGUuaWQsbm9kZS5wYXJhbXMsbm9kZS5ib2R5LG5vZGUuZ2VuZXJhdG9yLG5vZGUuYXN5bmMpO1xuICAgICAgICAgICAgbW92ZUNvbW1lbnRzKG5vZGUsIGV4cHJlc3Npb25TdGF0ZW1lbnQpO1xuICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnMudHlwZXMuUmV0dXJuU3RhdGVtZW50KGV4cHJlc3Npb25TdGF0ZW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIC8vIENsYXNzIGRlY2xhcmF0aW9ucyBuZWVkIHRvIGJlIHR1cm5lZCBpbnRvIENsYXNzRXhwcmVzc2lvbnNcbiAgICAgICAgLy8gVGhhdCBjYW4gYmUgcmV0dXJuZWQgYXMgYSByZWd1bGFyIGV4cHJlc3Npb25cbiAgICAgICAgY2FzZSAnQ2xhc3NEZWNsYXJhdGlvbic6IHtcbiAgICAgICAgICAgIG5vZGUudHlwZSA9ICdDbGFzc0V4cHJlc3Npb24nO1xuICAgICAgICAgICAgLy8gV2Ugc3RpbGwgbmVlZCB0byBoYW5kbGUgaXQgbGlrZSBhIHJlZ3VsYXIgZXhwcmVzc2lvblxuICAgICAgICAgICAgLy8gYXQgdGhhdCBwb2ludCwgc28gbGV0J3MgZ28gZm9yIGFub3RoZXIgcm91bmRcbiAgICAgICAgICAgIGNvbnN0IGV4cHJlc3Npb25TdGF0ZW1lbnQgPSBvcHRpb25zLnR5cGVzLkV4cHJlc3Npb25TdGF0ZW1lbnQobm9kZSk7XG4gICAgICAgICAgICBtb3ZlQ29tbWVudHMobm9kZSwgZXhwcmVzc2lvblN0YXRlbWVudCk7XG4gICAgICAgICAgICByZXR1cm4gbWF5YmVJbmplY3RSZXR1cm4oZXhwcmVzc2lvblN0YXRlbWVudCwgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vICMjIFN1cHBvcnRpbmcgZnVuY3Rpb25zXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0fSBmcm9tTm9kZVxuICogQHBhcmFtIHtPYmplY3R9IHRvTm9kZVxuICovXG5mdW5jdGlvbiBtb3ZlQ29tbWVudHMoZnJvbU5vZGUsIHRvTm9kZSkge1xuICAgIHRvTm9kZS5sZWFkaW5nQ29tbWVudHMgPSBmcm9tTm9kZS5sZWFkaW5nQ29tbWVudHM7XG4gICAgdG9Ob2RlLnRyYWlsaW5nQ29tbWVudHMgPSBmcm9tTm9kZS50cmFpbGluZ0NvbW1lbnRzO1xuICAgIGZyb21Ob2RlLmxlYWRpbmdDb21tZW50cyA9IG51bGw7XG4gICAgZnJvbU5vZGUudHJhaWxpbmdDb21tZW50cyA9IG51bGw7XG59XG5cbi8vIFdlIG5lZWQgdG8gYWRkIGEgdmFyaWFibGUgZGVjbGFyYXRpb24gYmVmb3JlIGxvb3BzLFxuLy8gYW5kIHRoZW4gcmV0dXJuIHRoYXQgdmFyaWFibGUuIFF1aXRlIGEgYmxvY2sgdG8gaGF2ZVxuLy8gaW4gdGhlIG1haW4gdHJhdmVyc2FsLCBzbyBpdCdzIGluIGl0cyBvd24gZnVuY3Rpb24gaW5zdGVhZC5cbi8qKlxuICogQHBhcmFtIHtPYmplY3R9IG5vZGUgLSBUaGUgbG9vcCBub2RlXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMudHlwZXNcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zLnNjb3BlXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucy5yZXN1bHRzSWRlbnRpZmllclxuICovXG5mdW5jdGlvbiB3cmFwTG9vcE5vZGUobm9kZSwgb3B0aW9ucykge1xuICAgIGNvbnN0IHsgdHlwZXMsIHNjb3BlIH0gPSBvcHRpb25zO1xuICAgIC8vIEEgcGFyZW50IGxvb3AgbWlnaHQgaGF2ZSBhbHJlYWR5IGNyZWF0ZWQgYSB2YXJpYWJsZVxuICAgIC8vIHRvIHB1c2ggaW50bywgc28gd2Ugb25seSBjcmVhdGUgb24gaWYgbmVlZGVkXG4gICAgY29uc3QgaWRlbnRpZmllciA9XG4gICAgICAgIG9wdGlvbnMucmVzdWx0c0lkZW50aWZpZXIgfHwgc2NvcGUuZ2VuZXJhdGVVaWRJZGVudGlmaWVyKCdyZXN1bHQnKTtcblxuICAgIC8vIFRoZW4gd2UgY2FuIHByb2Nlc3MgdGhlIGNvbnRlbnQgb2YgdGhlIGxvb3BcbiAgICBtYXliZUluamVjdFJldHVybihub2RlLCB7XG4gICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgIGtleTogJ2JvZHknLFxuICAgICAgICByZXN1bHRzSWRlbnRpZmllcjogaWRlbnRpZmllclxuICAgIH0pO1xuXG4gICAgLy8gQW5kIGZpbmFsbHkgd3JhcCBpdCBvbmx5IGlmIHdlIGNyZWF0ZWQgdGhlIGlkZW50aWZpZXJzIGJlZm9yZWhhbmRcbiAgICBpZiAob3B0aW9ucy5yZXN1bHRzSWRlbnRpZmllcikge1xuICAgICAgICAvLyBKdXN0IGxpa2UgdGhlIG90aGVyIGJsb2Nrcywgd2UgY29uc2lkZXIgdGhhdCBlaXRoZXJcbiAgICAgICAgLy8gd2UnbGwgaGF2ZSBhZGRlZCBhIHJldHVybiwgb3IgdGhlcmUgd2FzIG9uZSAob3IgYSBgY29udGludWVgKSBhbHJlYWR5XG4gICAgICAgIC8vIHNvIHdlIHN0b3AgdHJhdmVyc2luZyBzaWJsaW5nc1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gV2UgZG9uJ3QgaGF2ZSBhY2Nlc3MgdG8gYHJlcGxhY2VXaXRoTXVsdGlwbGVgIGFzIHdlIG5lZWRcbiAgICAgICAgLy8gb3VyIG93biB0cmF2ZXJzYWwgc28gd2UgcmVwbGFjZSB0aGUgZm9yIHdpdGggb3VyIG93biBibG9ja1xuICAgICAgICAvLyBvZiBjb21tYW5kc1xuICAgICAgICByZXR1cm4gdHlwZXMuQmxvY2tTdGF0ZW1lbnQoW1xuICAgICAgICAgICAgLy8gVXNpbmcgYHZhcmAgYWxsb3dzIHRlcnNlciAobWF5YmUgb3RoZXIgbWluaWZpZXJzIHRvbykgdG8gZWxpbWluYXRlIHRoZSBibG9jayB3ZSBqdXN0IGNyZWF0ZWRcbiAgICAgICAgICAgIC8vIGlmIGl0IGlzIHVubmVjZXNzYXJ5LiBXaXRoIGBjb25zdGAgb3IgYGxldGAsIHRoZSB2YXJpYWJsZSB3b3VsZCBiZVxuICAgICAgICAgICAgLy8gc2NvcGVkIHRvIHRoZSBibG9jaywgc28gdGVyc2VyIHdvdWxkbid0IGJlIGFibGUgdG8ga25vdyBpZiBpdCdzIHNhZmVcbiAgICAgICAgICAgIC8vIHRvIGVsaW1pbmF0ZSB0aGUgYmxvY2sgb3Igbm90XG4gICAgICAgICAgICB0eXBlcy5WYXJpYWJsZURlY2xhcmF0aW9uKCd2YXInLCBbXG4gICAgICAgICAgICAgICAgdHlwZXMuVmFyaWFibGVEZWNsYXJhdG9yKGlkZW50aWZpZXIsIHR5cGVzLkFycmF5RXhwcmVzc2lvbigpKVxuICAgICAgICAgICAgXSksXG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgdHlwZXMuUmV0dXJuU3RhdGVtZW50KGlkZW50aWZpZXIpXG4gICAgICAgIF0pO1xuICAgIH1cbn1cblxuLy8gTGl0dGxlIHV0aWxpdHkgZm9yIG91dHB1dGluZyB0aGUgbmFtZSBvZiBhIG5vZGVcbi8vIGNsZWFubHkgKHRoYXQgaXMgd2l0aG91dCBkdW1waW5nIGEgd2hvbGUgb2JqZWN0XG4vLyBpbiB0aGUgY29uc29sZSlcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuZnVuY3Rpb24gbm9kZURlYnVnTmFtZShub2RlKSB7XG4gICAgaWYgKHR5cGVvZiBub2RlID09PSAndW5kZWZpbmVkJykgcmV0dXJuICd1bmRlZmluZWQnO1xuICAgIGlmIChBcnJheS5pc0FycmF5KG5vZGUpKSB7XG4gICAgICAgIHJldHVybiAnQXJyYXknO1xuICAgIH1cbiAgICByZXR1cm4gKG5vZGUgJiYgbm9kZS50eXBlKSB8fCBub2RlO1xufVxuXG5cbiJdfQ==