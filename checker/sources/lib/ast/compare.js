var estraverse = require("estraverse");
var utils = require("./utils.js");
var extend = utils.extend;
var getTree = utils.getTree;

var visitorKeys = estraverse.VisitorKeys;

var additionalKeys = {
  Literal: ["value"],
  BinaryExpression: ["operator"],
  Identifier: ["name"]
};

var extractFragmentNameFromLiteral = function(patternNode) {
  if(patternNode.type === "Literal" &&
    typeof(patternNode.value) === "string" &&
    patternNode.value.indexOf('#') === 0
  ) {
    return patternNode.value.substr(1);
  } else {
    return undefined;
  }
}

var extractFragmentName = function(patternNode) {
  var fragmentName = extractFragmentNameFromLiteral(patternNode);

  if(!fragmentName &&
    patternNode.type == "ExpressionStatement") {
    fragmentName = extractFragmentNameFromLiteral(patternNode.expression);
  }

  return fragmentName;
};


var compareListOrNodes = function(sourceLN, patternLN, fragments) {
  var i;

  if(!sourceLN && !patternLN) {
    return true;
  }

  if(Array.isArray(sourceLN)) {
    for(i = 0; i < sourceLN.length; ++i) {
      if(!compareNodes(sourceLN[i], patternLN[i], fragments)) {
        return false;
      }
    }
    return true;
  } else if(sourceLN.type) {
    return compareNodes(sourceLN, patternLN, fragments);
  } else {
    if(sourceLN === patternLN) {
      return true;
    } else {
      // console.log("Content: " + sourceLN + " != " + patternLN);
      return false;
    }
  }
};

var compareNodes = function(sourceNode, patternNode, fragments) {
  var sourceType = sourceNode.type;
  var patternType = patternNode.type;
  var nodeKeys, key, i;
  var fragmentName, fragment;

  if(fragments) {
    fragmentName = extractFragmentName(patternNode);
    fragment = fragments.get(fragmentName);
  }

  if(fragment) {
    return fragment.compare(sourceNode, fragments);
  } else if(sourceType === patternType) {
    nodeKeys = visitorKeys[sourceType].concat(
      additionalKeys[sourceType] || []
    );

    for(i = 0; i < nodeKeys.length; ++i) {
      key = nodeKeys[i];

      if(!compareListOrNodes(sourceNode[key], patternNode[key], fragments)) {
        return false;
      }
    }

    return true;
  } else {
    // console.log('Type: ' + sourceType + " != " + patternType);
    return false;
  }
};

var compare = function(source, pattern, fragments) {
  if(source === null && pattern === null) {
    return true;
  }

  var sourceTree = getTree(source);
  var patternTree = getTree(pattern);

  var result = compareListOrNodes(sourceTree, patternTree, fragments);

  return result;
};

module.exports = compare;
