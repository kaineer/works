//
var expect = require("chai").expect;
var esprima = require("esprima");
var guard = require("../lib/guard");

describe("guard()", function() {
  var tree;
  var result;

  var performGuardCheck = function(code) {
    tree = esprima.parse(code);
    result = guard(tree);
  };

  context("empty code", function() {
    beforeEach(function() {
      performGuardCheck("");
    });

    it("should return falsey value", function() {
      expect(result).not.to.be.ok;
    });
  });

  context("infinite for", function() {
    beforeEach(function() {
      performGuardCheck("for(;;) {}");
    });

    it("should return not null value", function() {
      expect(result).to.be.ok;
    });

    it("should return object", function() {
      expect(typeof(result)).to.eq("object");
    });

    it("should have a message", function() {
      expect(result.message).to.eq(guard.INFINITE_FOR_FOUND);
    });
  });
});
