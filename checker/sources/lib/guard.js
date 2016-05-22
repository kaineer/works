var esprima = require("esprima");

var guard = function(tree) {
  if(infiniteForFound(tree)) {
    return {
      message: guard.INFINITE_FOR_FOUND
    }
  }
};

guard.checkCode = function(code) {
  var tree;

  try {
    tree = esprima.parse(code);
  } catch(err) {
    // console.log(err);
    return {message: err.message};
  }

  return guard(tree);
}

var infiniteForFound = function(node) {
  if(!node) {
    return false;
  }

  if(node.type === "ForStatement" && (isAlwaysTrue(node.test) || !node.update)) {
    return true;
  } else if(node.body && Array.isArray(node.body)) {
    return node.body.some(function(subnode) {
      return infiniteForFound(subnode);
    });
  } else {
    return infiniteForFound(node.body);
  }
};

var isAlwaysTrue = function(node) {
  return node === null;
};

Object.assign(guard, {
  // @const Результаты проверки
  INFINITE_FOR_FOUND: "Код, возможно, содержит бесконечный цикл for"
})

module.exports = guard;
