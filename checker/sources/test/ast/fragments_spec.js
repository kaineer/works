var expect = require("chai").expect;

describe("ast/fragments", function() {
  var compare = require("../../lib/ast/compare.js");
  var Fragments = require("../../lib/ast/fragments.js");
  var fragments;

  beforeEach(function() {
    fragments = new Fragments();
  });

  context("empty fragments container", function() {
    it("should return null when getting fragment", function() {
      expect(fragments.get("fragment.name")).to.be.undefined;
    });

    it("should return false for any fragment name", function() {
      expect(fragments.has("fragment.name")).to.be.false;
    });
  });

  context("container with some fragments", function() {
    beforeEach(function() {
      fragments.add("hello.fragment", "42");
    });

    it("should be equal to same literal", function() {
      expect(
        fragments.compare("hello.fragment", "42")
      ).to.be.truthy;
    });

    it("should not be equal to different literal", function() {
      expect(
        fragments.compare("hello.fragment", "38")
      ).to.be.falsey;
    });

    it("should not be equal to different type", function() {
      expect(
        fragments.compare("hello.fragment", "40 + 2")
      ).to.be.falsey;
    });

  });
});
