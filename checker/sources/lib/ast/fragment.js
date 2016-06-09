var utils = require("./utils.js");
var getTree = utils.getTree;
var extend = utils.extend;
var is = utils.is;
var compare = require("./compare.js");

var getStatement = function(node) {
  while(node && !is.statement(node)) {
    if(node.body) {
      if(Array.isArray(node.body)) {
        node = node.body[0];
      } else {
        node = node.body;
      }
    } else {
      node = undefined;
    }
  }

  return node;
};

var getExpression = function(node) {
  while(node && !is.expression(node)) {
    if(node.expression) {
      node = node.expression;
    } else if(node.body) {
      if(Array.isArray(node.body)) {
        node = node.body[0];
      } else {
        node = node.body;
      }
    } else {
      node = undefined;
    }
  }

  return node;
}

var Fragment = function(sourceOrTree) {
  this.tree = getTree(sourceOrTree);
};

extend(Fragment.prototype, {
  compare: function(node) {
    var patternNode = this.tree;
    var isStatement = is.statement(node);
    var isExpression = is.expression(node);

    if(isStatement) {
      patternNode = getStatement(this.tree);
    } else if(isExpression) {
      patternNode = getExpression(this.tree);
    }

    return compare(node, patternNode);
  }
});

module.exports = Fragment;
