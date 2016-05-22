//
/*
1. Объявить пустой цикл for
2. Затем внутри for задать исходную
  переменную-счётчик i со значением 1,
3. затем условие выхода из цикла i < 10 и
4. операцию обновлнения состояния,
  в которой i будет увеличиваться на 2 в каждой итерации.
5. После этого внутри тела цикла выведите переменную i в консоль:
  console.log(i);
*/

var ref = function(data, path) {
  var parts = path.split(".");
  var result = data;
  parts.forEach(function(part) {
    if(result) {
      result = result[part];
    }
  });
  return result;
}

var singleForNode = function(tree) {
  var node;
  var forNode = null;

  if(tree.body.length === 1) {
    node = tree.body[0];
    if(node.type === "ForStatement") {
      forNode = node;
    }
  }

  return forNode;
};

var singleVariableDeclaration = function(node, name, value) {
  var declaration;

  if(!node) {
    return false;
  }

  if(node.type !== "VariableDeclaration") {
    return false;
  }

  if(!Array.isArray(node.declarations) || node.declarations.length !== 1) {
    return false;
  }

  declaration = node.declarations[0];

  if(declaration.type !== "VariableDeclarator" ||
    ref(declaration, "id.name") !== name
  ) {
    return false;
  }

  if(typeof(value) !== "undefined" &&
    ref(declaration, "init.value") !== value
  ) {
    return false;
  }

  return true;
};

// "type": "BinaryExpression",
//                 "operator": "<",
//                 "left": {
//                     "type": "Identifier",
//                     "name": "i"
//                 },
//                 "right": {
//                     "type": "Literal",
//                     "value": 10,
//                     "raw": "10"
//                 }

var identifier = function(node, name) {
  if(!node) {
    return false;
  }

  if(node.type !== "Identifier") {
    return false;
  }

  if(node.name !== name) {
    return false;
  }

  return true;
};

var literal = function(node, value) {
  if(!node) {
    return false;
  }

  if(node.type !== "Literal") {
    return false;
  }

  if(node.value !== value) {
    return false;
  }

  return true;
}

var binaryExpression = function(node, leftVar, op, rightCheck) {
  if(!node) {
    return false;
  }

  if(node.type !== "BinaryExpression") {
    return false;
  }

  if(node.operator !== op) {
    return false;
  }

  if(!identifier(node.left, leftVar)) {
    return false;
  }

  if(!rightCheck(node.right)) {
    return false;
  }

  return true;
};

// "type": "ExpressionStatement",
// "node": {
//     "type": "AssignmentExpression",
//     "operator": "+=",
//     "left": {
//         "type": "Identifier",
//         "name": "i"
//     },
//     "right": {
//         "type": "Literal",
//         "value": 2,
//         "raw": "2"
//     }
// }

var assignmentExpression = function(node, varName, op, rightCheck) {
  var node;

  if(!node) {
    return false;
  }

  if(node.type !== "AssignmentExpression") {
    return false;
  }

  if(node.operator !== op) {
    return false;
  }

  if(!identifier(node.left, varName)) {
    return false;
  }

  if(!rightCheck(node.right)) {
    return false;
  }

  return true;
};

// "type": "ExpressionStatement",
// "expression": {
//     "type": "CallExpression",
//     "callee": {
//         "type": "MemberExpression",
//         "computed": false,
//         "object": {
//             "type": "Identifier",
//             "name": "console"
//         },
//         "property": {
//             "type": "Identifier",
//             "name": "log"
//         }
//     },
//     "arguments": [
//         {
//             "type": "Identifier",
//             "name": "i"
//         }
//     ]
// }

var methodCall = function(node, varName, method) {
  var expression, argv, argCheckResult = true;

  if(!node) {
    return false;
  }

  if(node.type !== "ExpressionStatement") {
    return false;
  } else {
    expression = node.expression;
  }

  if(expression.type !== "CallExpression") {
    return false;
  }

  if(!identifier(ref(expression, "callee.object"), varName)) {
    return false;
  }

  if(!identifier(ref(expression, "callee.property"), method)) {
    return false;
  }

  argv = Array.prototype.slice.call(arguments, 3);

  argv.forEach(function(arg, i) {
    if(!arg(expression.arguments[i])) {
      argCheckResult = false;
    }
  });

  return argCheckResult;
};

var emptyBlockBody = function(node) {
  if(node.body.type !== "BlockStatement" || node.body.body.length > 0) {
    return false;
  }

  return true;
}

Object.assign(exports, {
  // Пустой цикл for
  infiniteForLoop: function(tree) {
    var node;

    // for(...)
    node = singleForNode(tree);
    if(!node) {
      return false;
    }

    // for(;;)
    if(node.init || node.test || node.update) {
      return false;
    }

    // for(;;) {}
    if(!emptyBlockBody(node)) {
      return false;
    }

    return true;
  },
  // Затем внутри for задать исходную
  //   переменную-счётчик i со значением 1
  infiniteForWithInit: function(tree) {
    var node;

    // for(...)
    node = singleForNode(tree);
    if(!node) {
      return false;
    }

    // for(var i = 1;...)
    if(!singleVariableDeclaration(node.init, "i", 1)) {
      return false;
    }

    //
    if(node.test || node.update) {
      return false;
    }

    // for(...) {}
    if(!emptyBlockBody(node)) {
      return false;
    }

    return true;
  },

  infiniteForWithInitAndTest: function(tree) {
    var node;

    // for(...)
    node = singleForNode(tree);
    if(!node) {
      return false;
    }

    // for(var i = 1;...)
    if(!singleVariableDeclaration(node.init, "i", 1)) {
      return false;
    }

    // for(...; i < 10;)
    if(!binaryExpression(node.test, "i", "<", function(right) {
      return literal(right, 10);
    })) {
      return false;
    }

    //
    if(node.update) {
      return false;
    }

    // for(...) {}
    if(!emptyBlockBody(node)) {
      return false;
    }

    return true;
  },

  normalForEmptyBody: function(tree) {
    var node;

    // for(...)
    node = singleForNode(tree);
    if(!node) {
      return false;
    }

    // for(var i = 1;...)
    if(!singleVariableDeclaration(node.init, "i", 1)) {
      return false;
    }

    // for(...; i < 10;)
    if(!binaryExpression(node.test, "i", "<", function(right) {
      return literal(right, 10);
    })) {
      return false;
    }

    // for(...;...; i += 2)
    if(!assignmentExpression(node.update, "i", "+=", function(right) {
      return literal(right, 2);
    })) {
      return false;
    }

    // for(...) {}
    if(!emptyBlockBody(node)) {
      return false;
    }

    return true;
  },

  normalForWithConsole: function(tree) {
    var node;

    // for(...)
    node = singleForNode(tree);
    if(!node) {
      return false;
    }

    // for(var i = 1;...)
    if(!singleVariableDeclaration(node.init, "i", 1)) {
      return false;
    }

    // for(...; i < 10;)
    if(!binaryExpression(node.test, "i", "<", function(right) {
      return literal(right, 10);
    })) {
      return false;
    }

    // for(...;...; i += 2)
    if(!assignmentExpression(node.update, "i", "+=", function(right) {
      return literal(right, 2);
    })) {
      return false;
    }

    // for(...) { console.log(i); }
    if(!methodCall(node.body.body[0], "console", "log",
      function(node) { return identifier(node, "i"); }
    )) {
      return false;
    }

    return true;
  }
});
