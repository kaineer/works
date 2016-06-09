var estraverse = require("estraverse");
var utils = require("./utils.js");
var extend = utils.extend;
var getTree = utils.getTree;

var visitorKeys = extend({}, estraverse.VisitorKeys, {
  Literal: ["value"]
});

var compareListOrNodes = function(sourceLN, patternLN) {
  var i;

  if(!sourceLN && !patternLN) {
    return true;
  }

  if(Array.isArray(sourceLN)) {
    for(i = 0; i < sourceLN.length; ++i) {
      if(!compareNodes(sourceLN[i], patternLN[i])) {
        return false;
      }
    }
    return true;
  } else if(sourceLN.type) {
    return compareNodes(sourceLN, patternLN);
  } else {
    if(sourceLN === patternLN) {
      return true;
    } else {
      // console.log(sourceLN + " != " + patternLN);
      return false;
    }
  }
};

var compareNodes = function(sourceNode, patternNode) {
  // console.log("SRC: ", sourceNode);
  // console.log("PTR: ", patternNode);

  var sourceType = sourceNode.type;
  var patternType = patternNode.type;
  var nodeKeys, key, i;

  if(sourceType === patternType) {
    nodeKeys = visitorKeys[sourceType];

    for(i = 0; i < nodeKeys.length; ++i) {
      key = nodeKeys[i];

      if(!compareListOrNodes(sourceNode[key], patternNode[key])) {
        return false;
      }
    }

    return true;
  } else {
    // console.log(sourceType + " != " + patternType);
    return false;
  }
};

var compare = function(source, pattern) {
  if(source === null && pattern === null) {
    return true;
  }

  var sourceTree = getTree(source);
  var patternTree = getTree(pattern);

  return compareListOrNodes(sourceTree, patternTree);
};

module.exports = compare;
