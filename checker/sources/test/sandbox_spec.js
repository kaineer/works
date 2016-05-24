//
var expect = require("chai").expect;
var sandboxEval = require("../lib/sandbox");

describe("sandboxEval()", function() {
  var timedOutCode = function(timeout) {
    return "var d = Date.now(); for(; (Date.now() - d) < " +
      timeout + ";) {}";
  };

  var loopRepetitions = function(times) {
    return "for(var i = 0; i < " + times + "; ++i) {}";
  };

  it("should eval code", function() {
    expect(sandboxEval("2 + 2")).to.eq(4);
  });

  it("should throw error when code is too slow", function() {
    var code = timedOutCode(2000);
    expect(
      function() { sandboxEval(code); }
    ).to.throw(Error);
  });

  it("should not throw error, when opts.timeout is > fn.timeout", function() {
    var code = timedOutCode(400);
    expect(
      function() { sandboxEval(code, {timeout: 500, loopTimes: 0}); }
    ).not.to.throw(Error);
  });

  it("should throw error, when loop has too many repetitions", function() {
    var code = loopRepetitions(100);
    expect(
      function() { sandboxEval(code, {loopTimes: 50}); }
    ).to.throw(Error, "Too many");
  });

  it("should not throw error, when loop repetions < opts.loopTimes", function() {
    var code = loopRepetitions(100);
    expect(
      function() { sandboxEval(code, {loopTimes: 101}); }
    ).not.to.throw(Error);
  });
});
