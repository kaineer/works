//
var esprima = require("esprima");
var estraverse = require("estraverse");
var escodegen = require("escodegen");

var gen = require("./gen-utils");

var defaultOpts = {
  timeout: 300, // 300ms
  loopTimes: 100
};

var CheckpointChecker = function(opts) {
  this.opts = Object.assign({}, defaultOpts, opts);
};

var cpProto = CheckpointChecker.prototype;

cpProto.start = function() {
  this.startTime = Date.now();
};

cpProto.checkpoint = function(id) {
  var now = Date.now();

  if(now - this.startTime > this.opts.timeout) {
    throw new Error("Timeout reached");
  }

  if(this.opts.loopTimes > 0) {
    this.checkpoints || (this.checkpoints = {});
    this.checkpoints[id] || (this.checkpoints[id] = 0);
    this.checkpoints[id] += 1;

    if(this.checkpoints[id] > this.opts.loopTimes) {
      throw new Error("Too many repetitions");
    }
  }
};

var loopNodes = [
  "ForStatement",
  "ForInStatement",
  "WhileStatement",
  "DoWhileStatement"
];

var genCheckpoint = function(name, id) {
  return gen.expression_statement(
    gen.call_expression(
      name, "checkpoint", [gen.literal(id)]
    )
  );
};

var getSafeCode = function(code) {
  var tree = esprima.parse(code); // @raise Error when code is invalid
  var loopId = 0;
  var name = "cp";

  estraverse.traverse(tree, {
    enter: function(node) {
      if(loopNodes.indexOf(node.type) > -1) { // we got a loop node
        if(node.body.type == "EmptyStatement") {
          node.body.type = "BlockStatement";
          node.body.body = [];
        }

        node.body.body.unshift(genCheckpoint(name, loopId));

        loopId += 1;
      }
    }
  });

  return escodegen.generate(tree);
};

var sandboxEval = function(code, opts) {
  var safeCode = getSafeCode(code);
  var cp = new CheckpointChecker(opts);

  cp.start();

  return eval(safeCode);
}

module.exports = sandboxEval;
