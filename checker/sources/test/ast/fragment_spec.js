var expect = require("chai").expect;
var utils = require("../../lib/ast/utils.js");
var astPath = utils.astPath;
var getTree = utils.getTree;
var Fragment = require("../../lib/ast/fragment.js");

describe("ast/fragment", function() {
  var fragment, content;

  context("single variant", function() {
    beforeEach(function() {
      fragment = new Fragment("40 + 2");
      content = getTree("40 + 2");
    });

    it("should compare with statement", function() {
      var statement = astPath(content, "body.0");
      expect(fragment.compare(statement)).to.be.ok;
    });

    it("should compare with expression", function() {
      var expression = astPath(content, "body.0.expression");
      expect(fragment.compare(expression)).to.be.ok;
    });
  });

  context("several variants", function() {
    beforeEach(function() {
      fragment = new Fragment("42", "38");
    });

    it("should check with 42", function() {
      var expression = astPath(
        getTree("42"),
        "body.0.expression"
      );

      expect(fragment.compare(expression)).to.be.ok;
    });

    it("should check with 38", function() {
      var expression = astPath(
        getTree("38"),
        "body.0.expression"
      );

      expect(fragment.compare(expression)).to.be.ok;
    });

    it("should differ from 72", function() {
      var expression = astPath(
        getTree("72"),
        "body.0.expression"
      );

      expect(fragment.compare(expression)).not.to.be.ok;
    });
  });
});
