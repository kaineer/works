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

var getVariants = function(sources) {
  var variants = [];

  for(var i = 0; i < sources.length; i++) {
    variants.push(getTree(sources[i]));
  }

  return variants;
};

var Fragment = function() {
  this.variants = getVariants(arguments);
};

Fragment.create = function(variants) {
  var fragment = new Fragment();
  fragment.variants = getVariants(variants);
  return fragment;
};

extend(Fragment.prototype, {
  _compareVariant: function(node, variant, fragments) {
    var patternNode = variant;
    var isStatement = is.statement(node);
    var isExpression = is.expression(node);

    if(isStatement) {
      patternNode = getStatement(patternNode);
    } else if(isExpression) {
      patternNode = getExpression(patternNode);
    }

    return compare(node, patternNode, fragments);
  },
  compare: function(node, fragments) {
    var variants = this.variants;

    for(var i = 0; i < variants.length; i++) {
      if(this._compareVariant(node, variants[i], fragments)) {
        return true;
      }
    }

    return false;
  }
});

module.exports = Fragment;
