"use strict";var _interopRequireDefault3 = require("@babel/runtime/helpers/interopRequireDefault");var _interopRequireDefault2 = _interopRequireDefault3(require("@babel/runtime/helpers/interopRequireDefault"));Object.defineProperty(exports, "__esModule", { value: true });var _defineProperty2 = require("@babel/runtime/helpers/defineProperty");var _defineProperty = (0, _interopRequireDefault2["default"])(_defineProperty2)["default"];var _objectWithoutProperties2 = require("@babel/runtime/helpers/objectWithoutProperties");var _objectWithoutProperties = (0, _interopRequireDefault2["default"])(_objectWithoutProperties2)["default"];exports["default"] =










function (babel) {
  var types = babel.types;
  return {
    visitor: {
      Program: function Program(path, _ref) {var opts = _ref.opts;
        if (opts.topLevel) {
          maybeInjectReturn(path.node.body, { types: types, scope: path.scope });
        }
      },

      // Named functions (sync or async): `function template() {}`
      FunctionDeclaration: function FunctionDeclaration(path) {
        maybeInjectReturn(path.node.body, { types: types, scope: path.scope });
      },
      // Anonymous functions: `const a = function() {}`
      FunctionExpression: function FunctionExpression(path) {
        maybeInjectReturn(path.node.body, { types: types, scope: path.scope });
      },
      // Arrow functions: `() => {}`
      ArrowFunctionExpression: function ArrowFunctionExpression(path) {
        maybeInjectReturn(path.node.body, { types: types, scope: path.scope });
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
      ClassMethod: function ClassMethod(path) {
        // Ignore constructors as there's no point injecting anything there
        // given their return value isn't actually returned to caller
        if (path.node.key.name !== 'constructor') {
          maybeInjectReturn(path.node.body, { types: types, scope: path.scope });
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
      ObjectMethod: function ObjectMethod(path) {
        maybeInjectReturn(path.node.body, { types: types, scope: path.scope });
      } } };




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
function maybeInjectReturn(node) {var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},key = _ref2.key,options = _objectWithoutProperties(_ref2, ["key"]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yZXR1cm4tbGFzdC1iYWJlbC1wbHVnaW4uanMiXSwibmFtZXMiOlsiYmFiZWwiLCJ0eXBlcyIsInZpc2l0b3IiLCJQcm9ncmFtIiwicGF0aCIsIm9wdHMiLCJ0b3BMZXZlbCIsIm1heWJlSW5qZWN0UmV0dXJuIiwibm9kZSIsImJvZHkiLCJzY29wZSIsIkZ1bmN0aW9uRGVjbGFyYXRpb24iLCJGdW5jdGlvbkV4cHJlc3Npb24iLCJBcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbiIsIkNsYXNzTWV0aG9kIiwia2V5IiwibmFtZSIsIk9iamVjdE1ldGhvZCIsIm9wdGlvbnMiLCJyZXBsYWNlIiwidXBkYXRlZE5vZGUiLCJBcnJheSIsImlzQXJyYXkiLCJhZnRlckJyZWFrIiwiaSIsImxlbmd0aCIsInR5cGUiLCJyZXN1bHRzSWRlbnRpZmllciIsInN0YXRlbWVudCIsIkV4cHJlc3Npb25TdGF0ZW1lbnQiLCJDYWxsRXhwcmVzc2lvbiIsIk1lbWJlckV4cHJlc3Npb24iLCJJZGVudGlmaWVyIiwiZXhwcmVzc2lvbiIsIlJldHVyblN0YXRlbWVudCIsIm1vdmVDb21tZW50cyIsImFsdGVybmF0ZSIsInVwZGF0ZSIsImNhc2VzIiwiZm9yRWFjaCIsInN3aXRjaENhc2UiLCJ0ZXN0Iiwid3JhcExvb3BOb2RlIiwiZXhwcmVzc2lvblN0YXRlbWVudCIsImZ1bmN0aW9uRXhwcmVzc2lvbiIsImlkIiwicGFyYW1zIiwiZ2VuZXJhdG9yIiwiYXN5bmMiLCJmcm9tTm9kZSIsInRvTm9kZSIsImxlYWRpbmdDb21tZW50cyIsInRyYWlsaW5nQ29tbWVudHMiLCJpZGVudGlmaWVyIiwiZ2VuZXJhdGVVaWRJZGVudGlmaWVyIiwiQmxvY2tTdGF0ZW1lbnQiLCJWYXJpYWJsZURlY2xhcmF0aW9uIiwiVmFyaWFibGVEZWNsYXJhdG9yIiwiQXJyYXlFeHByZXNzaW9uIiwibm9kZURlYnVnTmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFXZSxVQUFTQSxLQUFULEVB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SCIsInNvdXJjZXNDb250ZW50IjpbIi8vICMgYmFiZWwtcGx1Z2luLXRyYW5zZm9ybS1sYXN0LXN0YXRlbWVudFxuXG4vLyAjIyBUaGUgcGx1Z2luIGl0c2VsZlxuLyoqXG4gKiBDcmVhdGVzIHRoZSBwbHVnaW4gaXRzZWxmLCBncmFiYmluZyB3aGF0J3MgbmVlZGVkIGZyb21cbiAqIHRoZSBiYWJlbCBvYmplY3Qgc2V0IGJ5IEJhYmVsIGFuZCB0aGUgb3B0aW9ucyBwYXNzZWQgYnkgdGhlIGNvbmZpZ3VyYXRpb25cbiAqIEBwYXJhbSB7T2JqZWN0fSBiYWJlbFxuICogQHBhcmFtIHtPYmplY3R9IGJhYmVsLnR5cGVzIC0gVGhlIHR5cGVzXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy50b3BMZXZlbD1mYWxzZV0gLSBXaGV0aGVyIHRvIHByb2Nlc3MgdGhlIGxhc3Qgc3RhdGVtZW50IG9mIHRoZSBwcm9ncmFtXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGJhYmVsKSB7XG4gICAgY29uc3QgdHlwZXMgPSBiYWJlbC50eXBlcztcbiAgICByZXR1cm4ge1xuICAgICAgICB2aXNpdG9yOiB7XG4gICAgICAgICAgICBQcm9ncmFtKHBhdGgse29wdHN9KSB7XG4gICAgICAgICAgICAgICAgaWYob3B0cy50b3BMZXZlbCkge1xuICAgICAgICAgICAgICAgICAgICBtYXliZUluamVjdFJldHVybiAocGF0aC5ub2RlLmJvZHksIHt0eXBlcywgc2NvcGU6IHBhdGguc2NvcGV9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyBOYW1lZCBmdW5jdGlvbnMgKHN5bmMgb3IgYXN5bmMpOiBgZnVuY3Rpb24gdGVtcGxhdGUoKSB7fWBcbiAgICAgICAgICAgIEZ1bmN0aW9uRGVjbGFyYXRpb24ocGF0aCkge1xuICAgICAgICAgICAgICAgIG1heWJlSW5qZWN0UmV0dXJuKHBhdGgubm9kZS5ib2R5LCB7IHR5cGVzLCBzY29wZTogcGF0aC5zY29wZSB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvLyBBbm9ueW1vdXMgZnVuY3Rpb25zOiBgY29uc3QgYSA9IGZ1bmN0aW9uKCkge31gXG4gICAgICAgICAgICBGdW5jdGlvbkV4cHJlc3Npb24ocGF0aCkge1xuICAgICAgICAgICAgICAgIG1heWJlSW5qZWN0UmV0dXJuKHBhdGgubm9kZS5ib2R5LCB7IHR5cGVzLCBzY29wZTogcGF0aC5zY29wZSB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvLyBBcnJvdyBmdW5jdGlvbnM6IGAoKSA9PiB7fWBcbiAgICAgICAgICAgIEFycm93RnVuY3Rpb25FeHByZXNzaW9uKHBhdGgpIHtcbiAgICAgICAgICAgICAgICBtYXliZUluamVjdFJldHVybihwYXRoLm5vZGUuYm9keSwgeyB0eXBlcywgc2NvcGU6IHBhdGguc2NvcGUgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLy8gQ2xhc3MgbWV0aG9kc1xuICAgICAgICAgICAgLy8gYGBganNcbiAgICAgICAgICAgIC8vIGNsYXNzIGFDbGFzcygpIHtcbiAgICAgICAgICAgIC8vICAgZ2V0IHByb3BlcnR5KCkge31cbiAgICAgICAgICAgIC8vICAgc2V0IHByb3BlcnR5KHZhbHVlKSB7fVxuICAgICAgICAgICAgLy8gICBtZXRob2QoKSB7fVxuICAgICAgICAgICAgLy8gICBzdGF0aWMgc3RhdGljTWV0aG9kKCkge31cbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIC8vIGBgYFxuICAgICAgICAgICAgQ2xhc3NNZXRob2QocGF0aCkge1xuICAgICAgICAgICAgICAgIC8vIElnbm9yZSBjb25zdHJ1Y3RvcnMgYXMgdGhlcmUncyBubyBwb2ludCBpbmplY3RpbmcgYW55dGhpbmcgdGhlcmVcbiAgICAgICAgICAgICAgICAvLyBnaXZlbiB0aGVpciByZXR1cm4gdmFsdWUgaXNuJ3QgYWN0dWFsbHkgcmV0dXJuZWQgdG8gY2FsbGVyXG4gICAgICAgICAgICAgICAgaWYgKHBhdGgubm9kZS5rZXkubmFtZSAhPT0gJ2NvbnN0cnVjdG9yJykge1xuICAgICAgICAgICAgICAgICAgICBtYXliZUluamVjdFJldHVybihwYXRoLm5vZGUuYm9keSwgeyB0eXBlcywgc2NvcGU6IHBhdGguc2NvcGUgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8vIE9iamVjdCBtZXRob2RzXG4gICAgICAgICAgICAvLyBgYGBqc1xuICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgLy8gICBnZXQgcHJvcGVydHkoKSB7fVxuICAgICAgICAgICAgLy8gICBzZXQgcHJvcGVydHkodmFsdWUpIHt9XG4gICAgICAgICAgICAvLyAgIG1ldGhvZCgpIHt9XG4gICAgICAgICAgICAvLyAgIC8vIGtleTogZnVuY3Rpb24oKSB7fVxuICAgICAgICAgICAgLy8gICAvLyBpcyBhIEZ1bmN0aW9uRXhwcmVzc2lvblxuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgLy8gYGBgXG4gICAgICAgICAgICBPYmplY3RNZXRob2QocGF0aCkge1xuICAgICAgICAgICAgICAgIG1heWJlSW5qZWN0UmV0dXJuKHBhdGgubm9kZS5ib2R5LCB7IHR5cGVzLCBzY29wZTogcGF0aC5zY29wZSB9KTtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgIH1cbiAgICB9O1xufTtcblxuLy8gIyMgQVNUIFRyYXZlcnNhbFxuLy8gQmVjYXVzZSB3ZSBuZWVkIHRvIHRyYXZlcnNlIHRoZSBzdGF0ZW1lbnRzIGxhc3QgdG8gZmlyc3Rcbi8vIHdlIG5lZWQgYSBjdXN0b20gdHJhdmVyc2FsLlxuLyoqXG4gKiBUcmF2ZXJzZSB0aGUgZ2l2ZW4gbm9kZSBvciBhcnJheSBvZiBub2RlcyByZWN1cnNpdmVseSB0byBsb29rIGZvclxuICogbGFzdCBzdGF0ZW1lbnRzIHRvIHByb2Nlc3MuXG4gKiBAcGFyYW0ge09iamVjdHxBcnJheX0gbm9kZSAtIFRoZSBub2RlIG9yIGFycmF5IG9mIG5vZGVzIHRvIHRyYXZlcnNlXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtPYmplY3R9IHNjb3BlIC0gVGhlIEJhYmVsIGBzY29wZWAsIHVzZWQgZm9yIGdlbmVyYXRpbmcgbmV3IGlkZW50aWZpZXJzXG4gKiBAcGFyYW0ge09iamVjdH0gdHlwZXMgLSBUaGUgQmFiZWwgYHR5cGVzYCwgdXNlZCBmb3IgY3JlYXRpbmcgbmV3IG5vZGVzXG4gKiBAcGFyYW0ge1N0cmluZ3xudW1iZXJ9IFtrZXldIC0gQW4gb3B0aW9uYWwga2V5IHRvIGxvb2sgaW50byBvbiB0aGUgZ2l2ZW4gbm9kZSAoY2FuIGFsc28gYmUgYW4gYXJyYXkgaW5kZXgpXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtyZXBsYWNlPXRydWVdIC0gV2hldGhlciB0byBkbyB0aGUgcmVwbGFjZW1lbnQgb3Igbm90IChzbyBmYWxsdGhyb3VnaCBgY2FzZWBzIGNhbiBiZSBzdXBwb3J0ZWQpXG4gKiBAcGFyYW0ge09iamVjdH0gW3Jlc3VsdHNJZGVudGlmaWVyXSAtIEFuIElkZW50aWZpZXIgbm9kZSBpbnRvIHdoaWNoIHRvIGBwdXNoYCB0aGUgbGFzdCBzdGF0ZW1lbnRzIG9mIGxvb3BzIGluc3RlYWQgb2YgcmV0dXJuaW5nIHRoZW1cbiAqIEByZXR1cm5zIHtCb29sZWFufE9iamVjdHx1bmRlZmluZWR9IC0gUmV0dXJuIGEgbm9kZSB0byByZXBsYWNlIHRoZSBjdXJyZW50bHkgcHJvY2Vzc2VkIHZhbHVlIHdpdGgsIG9yIGBmYWxzZWAgdG8gc3RvcCBwcm9jZXNzaW5nIG90aGVyIG5vZGVzIGluIGFuIGFycmF5XG4gKi9cbmZ1bmN0aW9uIG1heWJlSW5qZWN0UmV0dXJuKG5vZGUsIHsga2V5LCAuLi5vcHRpb25zIH0gPSB7fSkge1xuICAgIC8vIEJ5IGRlZmF1bHQgd2Ugd2FudCByZXBsYWNlbWVudHMgdG8gaGFwcGVuXG4gICAgLy8gdW5sZXNzIGEgU3dpdGNoQ2FzZSB0dXJucyB0aGF0IG9mZlxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5yZXBsYWNlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBvcHRpb25zLnJlcGxhY2UgPSB0cnVlO1xuICAgIH1cbiAgICAvLyBJZiBwcm92aWRlZCBhIGtleSwgd2UncmUgbG9va2luZyB0byBpbmplY3QgcmV0dXJuIGZvclxuICAgIC8vIGEgc3BlY2lmaWMga2V5IG9mIHRoZSBub2RlXG4gICAgaWYgKHR5cGVvZiBrZXkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGNvbnN0IHVwZGF0ZWROb2RlID0gbWF5YmVJbmplY3RSZXR1cm4obm9kZVtrZXldLCBvcHRpb25zKTtcbiAgICAgICAgLy8gUmVwbGFjZSB0aGUgbm9kZSBpZiB0aGUgbm9kZSB3YXMgdHJhbnNmb3JtZWRcbiAgICAgICAgaWYgKHVwZGF0ZWROb2RlKSB7XG4gICAgICAgICAgICBub2RlW2tleV0gPSB1cGRhdGVkTm9kZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBBbmQgaGFsdCB0aGUgcHJvY2Vzc2luZyBvZiBjdXJyZW50IGFycmF5XG4gICAgICAgIGlmICh0eXBlb2YgdXBkYXRlZE5vZGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIElmIHByb3ZpZGVkIGFuIEFycmF5LCB3ZSdyZSBsb29raW5nIHRvIGl0ZXJhdGUgb3ZlciB0aGUgbm9kZXMsXG4gICAgLy8gbGFzdCB0byBmaXJzdC5cbiAgICAvLyBJTVBPUlRBTlQ6IFRoaXMgbmVlZHMgdG8gYmUgYWZ0ZXIgdGhlIGNoZWNrIGZvciB0aGUga2V5XG4gICAgLy8gdG8gYXZvaWQgaW5maW5pdGUgbG9vcCB3aGVuIGNhbGxpbmdcbiAgICBpZiAoQXJyYXkuaXNBcnJheShub2RlKSkge1xuICAgICAgICAvLyBGb3Igc3dpdGNoZXMgd2Ugd2FudCB0byBvbmx5IHJlcGxhY2UgYWZ0ZXIgd2UgZm91bmQgYSBCcmVha1N0YXRlbWVudFxuICAgICAgICAvLyBXZSBjYXJyeSBvbiB0aGUgdmFsdWUgZm9yIHJlcGxhY2VtZW50XG4gICAgICAgIGxldCByZXBsYWNlID0gb3B0aW9ucy5hZnRlckJyZWFrID8gb3B0aW9ucy5yZXBsYWNlIDogdHJ1ZTtcbiAgICAgICAgZm9yICh2YXIgaSA9IG5vZGUubGVuZ3RoOyBpLS07IGkpIHtcbiAgICAgICAgICAgIC8vIEFuZCBpbmplY3Qgd2hpY2hldmVyIHZhbHVlIHdlIGZvdW5kIGZvciBvdXIgcmVwbGFjZW1lbnRcbiAgICAgICAgICAgIGNvbnN0IHVwZGF0ZWROb2RlID0gbWF5YmVJbmplY3RSZXR1cm4obm9kZSwge1xuICAgICAgICAgICAgICAgIGtleTogaSxcbiAgICAgICAgICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICAgICAgICAgIHJlcGxhY2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gT25jZSB3ZSBmb3VuZCBhICdCcmVha1N0YXRlbWVudCcgd2UgY2FuIHN0YXJ0IHJlcGxhY2luZ1xuICAgICAgICAgICAgaWYgKG5vZGVbaV0udHlwZSA9PT0gJ0JyZWFrU3RhdGVtZW50Jykge1xuICAgICAgICAgICAgICAgIHJlcGxhY2UgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gU3RvcCBpdGVyYWN0aW5nIGFzIHNvb24gYXMgd2UgZ290IHNvbWV0aGluZyByZXR1cm5lZFxuICAgICAgICAgICAgaWYgKHR5cGVvZiB1cGRhdGVkTm9kZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuICAgIC8vICMjIyBUcmF2ZXJzYWwgb2YgaW5kaXZpZHVhbCBzdGF0ZW1lbnRzXG4gICAgc3dpdGNoIChub2RlLnR5cGUpIHtcbiAgICAgICAgLy8gTWFpbiBnb2FsIGlzIHRvIHByb2Nlc3MgZXhwcmVzc2lvbnMgdG8gcmV0dXJuIHRoZW1cbiAgICAgICAgY2FzZSAnRXhwcmVzc2lvblN0YXRlbWVudCc6IHtcbiAgICAgICAgICAgIGNvbnN0IHsgdHlwZXMsIHJlcGxhY2UsIHJlc3VsdHNJZGVudGlmaWVyIH0gPSBvcHRpb25zO1xuXG4gICAgICAgICAgICAvLyBGaXJzdCB3ZSBuZWVkIHRvIGNoZWNrIGlmIHdlJ3JlIGFjdHVhbGx5IGFsbG93ZWRcbiAgICAgICAgICAgIC8vIHRvIHJlcGxhY2UsIGluIGNhc2Ugd2UncmUgaW4gYSBgc3dpdGNoYC5cbiAgICAgICAgICAgIC8vIE5vdGUgdGhhdCB0aGUgYWN0dWFsbCBleHByZXNzaW9uIHRvIHJldHVybiBpc1xuICAgICAgICAgICAgLy8gdGhlIGBub2RlLmV4cHJlc3Npb25gLCBub3QgdGhlIGBFeHByZXNzaW9uU3RhdGVtZW50YCBpdHNlbGZcbiAgICAgICAgICAgIGlmIChyZXBsYWNlKSB7XG4gICAgICAgICAgICAgICAgbGV0IHN0YXRlbWVudDtcbiAgICAgICAgICAgICAgICAvLyBOb3cgd2UgbmVlZCB0byBwcm9jZXNzIHRoaW5ncyBzbGlnaHRseSBkaWZmZXJlbnRseVxuICAgICAgICAgICAgICAgIC8vIHdoZXRoZXIgd2UncmUgaW5zaWRlIGEgbG9vcCBvciBub3QsIG1hcmtlZCBieSB0aGVcbiAgICAgICAgICAgICAgICAvLyBwcmVzZW5jZSBvZiBhIGByZXN1bHRzSWRlbnRpZmllcmAgZm9yIHRoZSBBcnJheVxuICAgICAgICAgICAgICAgIC8vIGluIHdoaWNoIHRvIGBwdXNoYCB0aGUgcmVzdWx0cyBvZiB0aGUgbG9vcFxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHRzSWRlbnRpZmllcikge1xuICAgICAgICAgICAgICAgICAgICAvLyBBIGJpdCBvZiBhIG1vdXRoZnVsbCB0byB3cml0ZSBgPElkZW50aWZpZXJOYW1lPi5wdXNoKDxOb2RlRXhwcmVzc2lvbj4pYFxuICAgICAgICAgICAgICAgICAgICBzdGF0ZW1lbnQgPSB0eXBlcy5FeHByZXNzaW9uU3RhdGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZXMuQ2FsbEV4cHJlc3Npb24oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZXMuTWVtYmVyRXhwcmVzc2lvbihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0c0lkZW50aWZpZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVzLklkZW50aWZpZXIoJ3B1c2gnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW25vZGUuZXhwcmVzc2lvbl1cbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBJbiBhbGwgb3RoZXIgY2FzZXMsIHdlIHdyYXAgdGhlIGV4cHJlc3Npb24gd2l0aCBhIHJldHVyblxuICAgICAgICAgICAgICAgICAgICBzdGF0ZW1lbnQgPSB0eXBlcy5SZXR1cm5TdGF0ZW1lbnQobm9kZS5leHByZXNzaW9uKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBBbmQgbWFrZSBzdXJlIGNvbW1lbnRzIGVuZCB1cCBvbiB0aGUgd3JhcHBpbmcgbm9kZVxuICAgICAgICAgICAgICAgIG1vdmVDb21tZW50cyhub2RlLCBzdGF0ZW1lbnQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZW1lbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gSWYgd2UgZmluZCBhIHJldHVybiBvciB0aHJvdywgd2Ugc2tpcFxuICAgICAgICAvLyBTYW1lIHdpdGggYGRlYnVnZ2VyO2AgYW5kIGBjb250aW51ZWAgc3RhdGVtZW50cyxcbiAgICAgICAgLy8gd2hpY2ggc2hvdWxkbid0IGJlIHNob3J0LWNpcmN1aXRlZCBieSBhbiBlYXJseSByZXR1cm5cbiAgICAgICAgY2FzZSAnUmV0dXJuU3RhdGVtZW50JzpcbiAgICAgICAgY2FzZSAnVGhyb3dTdGF0ZW1lbnQnOlxuICAgICAgICBjYXNlICdEZWJ1Z2dlclN0YXRlbWVudCc6XG4gICAgICAgIGNhc2UgJ0NvbnRpbnVlU3RhdGVtZW50Jzoge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIC8vIGBpZmAgc3RhdGVtZW50cyBuZWVkIGJvdGggdGhlaXIgYnJhbmNoZXMgdmlzaXRlZFxuICAgICAgICBjYXNlICdJZlN0YXRlbWVudCc6IHtcbiAgICAgICAgICAgIG1heWJlSW5qZWN0UmV0dXJuKG5vZGUsIHsga2V5OiAnY29uc2VxdWVudCcsIC4uLm9wdGlvbnMgfSk7XG4gICAgICAgICAgICBpZiAobm9kZS5hbHRlcm5hdGUpIHtcbiAgICAgICAgICAgICAgICBtYXliZUluamVjdFJldHVybihub2RlLCB7IGtleTogJ2FsdGVybmF0ZScsIC4uLm9wdGlvbnMgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBFaXRoZXIgd2UnbGwgaGF2ZSBpbmplY3RlZCByZXR1cm5zIGFzIG5lZWRlZFxuICAgICAgICAgICAgLy8gb3IgdGhlcmUgd2lsbCBoYXZlIGJlZW4gc29tZSByZXR1cm5zIGFscmVhZHlcbiAgICAgICAgICAgIC8vIHNvIHdlIGNhbiBzdG9wIHRoZXJlXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgLy8gYHdpdGhgIGJsb2NrcyBvbmx5IGhhdmUgb25lIGJvZHlcbiAgICAgICAgLy8gYW5kIHNvIGRvIGxhYmVsZWRzdGF0ZW1lbnRzIGBsYWJlbDogY29uc3QgYSA9IDU7YFxuICAgICAgICBjYXNlICdMYWJlbGVkU3RhdGVtZW50JzpcbiAgICAgICAgY2FzZSAnV2l0aFN0YXRlbWVudCc6IHtcbiAgICAgICAgICAgIHJldHVybiBtYXliZUluamVjdFJldHVybihub2RlLCB7IGtleTogJ2JvZHknLCAuLi5vcHRpb25zIH0pO1xuICAgICAgICB9XG4gICAgICAgIC8vIFdlIG9ubHkgd2FudCB0byBtZXNzIHdpdGggdGhlIGB0cnlgIGJsb2NrXG4gICAgICAgIC8vIGBjYXRjaGAgbWlnaHQgeWllbGQgdW5leHBlY3RlZCB2YWx1ZXMgYmVpbmcgcmV0dXJuZWRcbiAgICAgICAgLy8gc28gYmVzdCBsZWF2ZSB0byBhbiBleHBsaWNpdCByZXR1cm5cbiAgICAgICAgLy8gYGZpbmFsbHlgIGlzIGV2ZW4gd29yc2U6IGl0IHdvdWxkIHJldHVybiBiZWZvcmUgdGhlIGB0cnlgXG4gICAgICAgIC8vIHNvIGEgZGVmaW5pdGUgbm8gZ286XG4gICAgICAgIC8vIGh0dHBzOi8vZXNsaW50Lm9yZy9kb2NzL3J1bGVzL25vLXVuc2FmZS1maW5hbGx5XG4gICAgICAgIGNhc2UgJ1RyeVN0YXRlbWVudCc6IHtcbiAgICAgICAgICAgIG1heWJlSW5qZWN0UmV0dXJuKG5vZGUsIHsga2V5OiAnYmxvY2snLCAuLi5vcHRpb25zIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIC8vIEJsb2NrcyB3aWxsIGhhdmUgbXVsdGlwbGUgc3RhdGVtZW50cyBpbiB0aGVpciBib2R5LFxuICAgICAgICAvLyB3ZSdsbCBuZWVkIHRvIHRyYXZlcnNlIHRoZW0gbGFzdCB0byBmaXJzdFxuICAgICAgICBjYXNlICdCbG9ja1N0YXRlbWVudCc6IHtcbiAgICAgICAgICAgIGNvbnN0IHVwZGF0ZSA9IG1heWJlSW5qZWN0UmV0dXJuKG5vZGUsIHsga2V5OiAnYm9keScsIC4uLm9wdGlvbnMgfSk7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHVwZGF0ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gYHN3aXRjaGAgc3RhdGVtZW50cyBuZWVkIHRoZWlyIG93biBwcm9jZXNzaW5nXG4gICAgICAgIC8vIC0gZWFjaCBjYXNlL2RlZmF1bHQgc3RhdGVtZW50IGNhbiBlaXRoZXIgaG9zdCBhIGJsb2NrIG9yIGFuIGFycmF5IG9mIHN0YXRlbWVudHNcbiAgICAgICAgLy8gLSB3ZSBzaG91bGQgb25seSBpbmplY3QgcmV0dXJucyBhZnRlciB3ZSBmb3VuZCBhIFwiYnJlYWtcIiBpbiBgY2FzZWAgc3RhdGVtZW50cy5cbiAgICAgICAgLy8gICBUaGUgZm9sbG93aW5nIGBjYXNlYC9gZGVmYXVsdGAgZ2V0cyBydW5cbiAgICAgICAgLy8gICBpZiB0aGVyZSBpcyBubyBgYnJlYWtgIGFuZCBhZGRpbmcgYSByZXR1cm4gd291bGQgcHJldmVudCB0aGF0LlxuICAgICAgICAvLyAgIFdoaWxlIGl0J3MgcmVjb21tZW5kZWQgbm90IHRvIGZhbGx0aHJvdWdoIChodHRwczovL2VzbGludC5vcmcvZG9jcy9ydWxlcy9uby1mYWxsdGhyb3VnaClcbiAgICAgICAgLy8gICB0aGVyZSBhcmUgc29tZSB2YWxpZCB1c2UgY2FzZXMsIHNvIHdlIG5lZWQgdG8gaGFuZGxlIGl0XG4gICAgICAgIGNhc2UgJ1N3aXRjaFN0YXRlbWVudCc6IHtcbiAgICAgICAgICAgIG5vZGUuY2FzZXMuZm9yRWFjaChzd2l0Y2hDYXNlID0+IHtcbiAgICAgICAgICAgICAgICBtYXliZUluamVjdFJldHVybihzd2l0Y2hDYXNlLCB7XG4gICAgICAgICAgICAgICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgICAgICAgICAgICAgIGtleTogJ2NvbnNlcXVlbnQnLFxuICAgICAgICAgICAgICAgICAgICBhZnRlckJyZWFrOiAhIXN3aXRjaENhc2UudGVzdCwgLy8gT25seSByZXBsYWNlIGlmIGEgYnJlYWsgZXhpc3RzIGZvciBgY2FzZWAsIG5vdCBgZGVmYXVsdGBcbiAgICAgICAgICAgICAgICAgICAgcmVwbGFjZTogZmFsc2VcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIC8vIExvb3BzIG5lZWQgdGhlaXIgb3duIHByb2Nlc3NpbmcgdG9vLiBXZSBuZWVkIHRvIGFnZ3JlZ2F0ZSB0aGVpciBkYXRhXG4gICAgICAgIC8vIGluIGFuIGFycmF5IGFuZCB0aGVuIHJldHVybiB0aGF0IGFycmF5XG4gICAgICAgIGNhc2UgJ0ZvclN0YXRlbWVudCc6XG4gICAgICAgIGNhc2UgJ0RvV2hpbGVTdGF0ZW1lbnQnOlxuICAgICAgICBjYXNlICdXaGlsZVN0YXRlbWVudCc6XG4gICAgICAgIGNhc2UgJ0ZvckluU3RhdGVtZW50JzpcbiAgICAgICAgY2FzZSAnRm9yT2ZTdGF0ZW1lbnQnOiB7XG4gICAgICAgICAgICByZXR1cm4gd3JhcExvb3BOb2RlKG5vZGUsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgJ0Z1bmN0aW9uRGVjbGFyYXRpb24nOiB7XG4gICAgICAgICAgICBjb25zdCBleHByZXNzaW9uU3RhdGVtZW50ID0gb3B0aW9ucy50eXBlcy5mdW5jdGlvbkV4cHJlc3Npb24obm9kZS5pZCxub2RlLnBhcmFtcyxub2RlLmJvZHksbm9kZS5nZW5lcmF0b3Isbm9kZS5hc3luYyk7XG4gICAgICAgICAgICBtb3ZlQ29tbWVudHMobm9kZSwgZXhwcmVzc2lvblN0YXRlbWVudCk7XG4gICAgICAgICAgICByZXR1cm4gb3B0aW9ucy50eXBlcy5SZXR1cm5TdGF0ZW1lbnQoZXhwcmVzc2lvblN0YXRlbWVudCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ2xhc3MgZGVjbGFyYXRpb25zIG5lZWQgdG8gYmUgdHVybmVkIGludG8gQ2xhc3NFeHByZXNzaW9uc1xuICAgICAgICAvLyBUaGF0IGNhbiBiZSByZXR1cm5lZCBhcyBhIHJlZ3VsYXIgZXhwcmVzc2lvblxuICAgICAgICBjYXNlICdDbGFzc0RlY2xhcmF0aW9uJzoge1xuICAgICAgICAgICAgbm9kZS50eXBlID0gJ0NsYXNzRXhwcmVzc2lvbic7XG4gICAgICAgICAgICAvLyBXZSBzdGlsbCBuZWVkIHRvIGhhbmRsZSBpdCBsaWtlIGEgcmVndWxhciBleHByZXNzaW9uXG4gICAgICAgICAgICAvLyBhdCB0aGF0IHBvaW50LCBzbyBsZXQncyBnbyBmb3IgYW5vdGhlciByb3VuZFxuICAgICAgICAgICAgY29uc3QgZXhwcmVzc2lvblN0YXRlbWVudCA9IG9wdGlvbnMudHlwZXMuRXhwcmVzc2lvblN0YXRlbWVudChub2RlKTtcbiAgICAgICAgICAgIG1vdmVDb21tZW50cyhub2RlLCBleHByZXNzaW9uU3RhdGVtZW50KTtcbiAgICAgICAgICAgIHJldHVybiBtYXliZUluamVjdFJldHVybihleHByZXNzaW9uU3RhdGVtZW50LCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy8gIyMgU3VwcG9ydGluZyBmdW5jdGlvbnNcbi8qKlxuICogQHBhcmFtIHtPYmplY3R9IGZyb21Ob2RlXG4gKiBAcGFyYW0ge09iamVjdH0gdG9Ob2RlXG4gKi9cbmZ1bmN0aW9uIG1vdmVDb21tZW50cyhmcm9tTm9kZSwgdG9Ob2RlKSB7XG4gICAgdG9Ob2RlLmxlYWRpbmdDb21tZW50cyA9IGZyb21Ob2RlLmxlYWRpbmdDb21tZW50cztcbiAgICB0b05vZGUudHJhaWxpbmdDb21tZW50cyA9IGZyb21Ob2RlLnRyYWlsaW5nQ29tbWVudHM7XG4gICAgZnJvbU5vZGUubGVhZGluZ0NvbW1lbnRzID0gbnVsbDtcbiAgICBmcm9tTm9kZS50cmFpbGluZ0NvbW1lbnRzID0gbnVsbDtcbn1cblxuLy8gV2UgbmVlZCB0byBhZGQgYSB2YXJpYWJsZSBkZWNsYXJhdGlvbiBiZWZvcmUgbG9vcHMsXG4vLyBhbmQgdGhlbiByZXR1cm4gdGhhdCB2YXJpYWJsZS4gUXVpdGUgYSBibG9jayB0byBoYXZlXG4vLyBpbiB0aGUgbWFpbiB0cmF2ZXJzYWwsIHNvIGl0J3MgaW4gaXRzIG93biBmdW5jdGlvbiBpbnN0ZWFkLlxuLyoqXG4gKiBAcGFyYW0ge09iamVjdH0gbm9kZSAtIFRoZSBsb29wIG5vZGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucy50eXBlc1xuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMuc2NvcGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zLnJlc3VsdHNJZGVudGlmaWVyXG4gKi9cbmZ1bmN0aW9uIHdyYXBMb29wTm9kZShub2RlLCBvcHRpb25zKSB7XG4gICAgY29uc3QgeyB0eXBlcywgc2NvcGUgfSA9IG9wdGlvbnM7XG4gICAgLy8gQSBwYXJlbnQgbG9vcCBtaWdodCBoYXZlIGFscmVhZHkgY3JlYXRlZCBhIHZhcmlhYmxlXG4gICAgLy8gdG8gcHVzaCBpbnRvLCBzbyB3ZSBvbmx5IGNyZWF0ZSBvbiBpZiBuZWVkZWRcbiAgICBjb25zdCBpZGVudGlmaWVyID1cbiAgICAgICAgb3B0aW9ucy5yZXN1bHRzSWRlbnRpZmllciB8fCBzY29wZS5nZW5lcmF0ZVVpZElkZW50aWZpZXIoJ3Jlc3VsdCcpO1xuXG4gICAgLy8gVGhlbiB3ZSBjYW4gcHJvY2VzcyB0aGUgY29udGVudCBvZiB0aGUgbG9vcFxuICAgIG1heWJlSW5qZWN0UmV0dXJuKG5vZGUsIHtcbiAgICAgICAgLi4ub3B0aW9ucyxcbiAgICAgICAga2V5OiAnYm9keScsXG4gICAgICAgIHJlc3VsdHNJZGVudGlmaWVyOiBpZGVudGlmaWVyXG4gICAgfSk7XG5cbiAgICAvLyBBbmQgZmluYWxseSB3cmFwIGl0IG9ubHkgaWYgd2UgY3JlYXRlZCB0aGUgaWRlbnRpZmllcnMgYmVmb3JlaGFuZFxuICAgIGlmIChvcHRpb25zLnJlc3VsdHNJZGVudGlmaWVyKSB7XG4gICAgICAgIC8vIEp1c3QgbGlrZSB0aGUgb3RoZXIgYmxvY2tzLCB3ZSBjb25zaWRlciB0aGF0IGVpdGhlclxuICAgICAgICAvLyB3ZSdsbCBoYXZlIGFkZGVkIGEgcmV0dXJuLCBvciB0aGVyZSB3YXMgb25lIChvciBhIGBjb250aW51ZWApIGFscmVhZHlcbiAgICAgICAgLy8gc28gd2Ugc3RvcCB0cmF2ZXJzaW5nIHNpYmxpbmdzXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBXZSBkb24ndCBoYXZlIGFjY2VzcyB0byBgcmVwbGFjZVdpdGhNdWx0aXBsZWAgYXMgd2UgbmVlZFxuICAgICAgICAvLyBvdXIgb3duIHRyYXZlcnNhbCBzbyB3ZSByZXBsYWNlIHRoZSBmb3Igd2l0aCBvdXIgb3duIGJsb2NrXG4gICAgICAgIC8vIG9mIGNvbW1hbmRzXG4gICAgICAgIHJldHVybiB0eXBlcy5CbG9ja1N0YXRlbWVudChbXG4gICAgICAgICAgICAvLyBVc2luZyBgdmFyYCBhbGxvd3MgdGVyc2VyIChtYXliZSBvdGhlciBtaW5pZmllcnMgdG9vKSB0byBlbGltaW5hdGUgdGhlIGJsb2NrIHdlIGp1c3QgY3JlYXRlZFxuICAgICAgICAgICAgLy8gaWYgaXQgaXMgdW5uZWNlc3NhcnkuIFdpdGggYGNvbnN0YCBvciBgbGV0YCwgdGhlIHZhcmlhYmxlIHdvdWxkIGJlXG4gICAgICAgICAgICAvLyBzY29wZWQgdG8gdGhlIGJsb2NrLCBzbyB0ZXJzZXIgd291bGRuJ3QgYmUgYWJsZSB0byBrbm93IGlmIGl0J3Mgc2FmZVxuICAgICAgICAgICAgLy8gdG8gZWxpbWluYXRlIHRoZSBibG9jayBvciBub3RcbiAgICAgICAgICAgIHR5cGVzLlZhcmlhYmxlRGVjbGFyYXRpb24oJ3ZhcicsIFtcbiAgICAgICAgICAgICAgICB0eXBlcy5WYXJpYWJsZURlY2xhcmF0b3IoaWRlbnRpZmllciwgdHlwZXMuQXJyYXlFeHByZXNzaW9uKCkpXG4gICAgICAgICAgICBdKSxcbiAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICB0eXBlcy5SZXR1cm5TdGF0ZW1lbnQoaWRlbnRpZmllcilcbiAgICAgICAgXSk7XG4gICAgfVxufVxuXG4vLyBMaXR0bGUgdXRpbGl0eSBmb3Igb3V0cHV0aW5nIHRoZSBuYW1lIG9mIGEgbm9kZVxuLy8gY2xlYW5seSAodGhhdCBpcyB3aXRob3V0IGR1bXBpbmcgYSB3aG9sZSBvYmplY3Rcbi8vIGluIHRoZSBjb25zb2xlKVxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG5mdW5jdGlvbiBub2RlRGVidWdOYW1lKG5vZGUpIHtcbiAgICBpZiAodHlwZW9mIG5vZGUgPT09ICd1bmRlZmluZWQnKSByZXR1cm4gJ3VuZGVmaW5lZCc7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkobm9kZSkpIHtcbiAgICAgICAgcmV0dXJuICdBcnJheSc7XG4gICAgfVxuICAgIHJldHVybiAobm9kZSAmJiBub2RlLnR5cGUpIHx8IG5vZGU7XG59XG4iXX0=