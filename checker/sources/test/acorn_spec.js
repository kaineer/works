var expect = require("chai").expect;

describe("acorn", function() {
  var acorn = require("acorn");

  describe("empty for loop", function() {
    var code = "/* some comment here */\nfor(;;) { }";
    var tree = acorn.parse(code);

    it("should parse a program", function() {
      expect(tree.type).to.eq("Program");
    });

    it("should contain body key", function() {
      expect(tree.body).to.be.ok;
    });

    it("should have `for` loop in first body element", function() {
      var forLoop = tree.body[0];
      expect(forLoop.type).to.eq("ForStatement");
      expect(forLoop.init).not.to.be.ok;
      expect(forLoop.test).not.to.be.ok;
      expect(forLoop.update).not.to.be.ok;
    });
  });
});
