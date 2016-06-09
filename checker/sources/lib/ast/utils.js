var acorn = require("acorn");

exports.getTree = function(sourceOrTree) {
  if(typeof(sourceOrTree) === "string") {
    return acorn.parse(sourceOrTree);
  } else {
    return sourceOrTree;
  }
};

exports.astPath = function(node, path) {
  var parts = path.split(".");
  var value = node;

  parts.forEach(function(part) {
    if(value) {
      value = value[part];
    }
  });

  return value;
};

exports.extend = Object.assign; // TODO: polyfill

var is = {
  statement: function(node) {
    var nodeType = node.type;
    return nodeType && nodeType.indexOf("Statement") > -1;
  },
  expression: function(node) {
    var nodeType = node.type;
    return nodeType && !is.statement(node) &&
      nodeType.indexOf("Expression") > -1;
  }
};

exports.is = is;
