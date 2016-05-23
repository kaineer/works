var gen = {
  //
  literal: function(value) {
    return {
      type: "Literal",
      value: value
    };
  },
  //
  identifier: function(name) {
    return {
      type: "Identifier",
      name: name
    };
  },
  //
  op: function(operator, left, right) {
    var isBinary = arguments.length > 1;
    var hash = {
      type: (isBinary ? "BinaryExpression" : "UnaryExpression"),
      operator: operator,
      left: left
    };

    if(isBinary) {
      hash.right = right;
    }

    return hash;
  },
  //
  expression_statement: function(expression) {
    return {
      type: "ExpressionStatement",
      expression: expression
    };
  },
  //
  call_expression: function(objectName, methodName, args) {
    return {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        computed: false,
        object: gen.identifier(objectName),
        property: gen.identifier(methodName),
      },
      arguments: args
    };
  },
  //
  assignment: function(operator, left, right) {
    return {
      type: "AssignmentExpression",
      operator: operator,
      left: left,
      right: right
    };
  }
};

module.exports = gen;
