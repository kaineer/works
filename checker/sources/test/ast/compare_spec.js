var expect = require("chai").expect;

describe("ast/compare", function() {
  var compare = require("../../lib/ast/compare.js");

  context("without fragments", function() {
    it("should be ok when taking two nulls", function() {
      expect(compare(null, null)).to.be.ok;
    });

    it("should not be ok for two different literals", function() {
      expect(compare("1", "2")).not.to.be.ok;
    });

    it("should be ok for two equal literals", function() {
      expect(compare("1", "1")).to.be.ok;
    });

    it("should not be ok for different identifiers", function() {
      expect(compare("i", "j")).not.to.be.ok;
    });

    it("should be ok when spaces are not equal", function() {
      expect(compare("  for  (;  ;) {  }", "for(;;){}")).
        to.be.ok;
    });
  });

  context("with fragments", function() {
    var Fragments = require("../../lib/ast/fragments.js");
    var fragments;

    beforeEach(function() {
      fragments = new Fragments();
      fragments.add("the.answer", "42");
    });

    it("should compare using context", function() {
      expect(compare(
        "answer == 42",
        "answer == '#the.answer'",
        fragments
      )).to.be.ok;
    });

    it("should not make equal what is not equal", function() {
      expect(compare(
        "answer != 42",
        "answer == '#the.answer'",
        fragments
      )).to.not.be.ok;
    });
  });

  context("with nested fragments", function() {
    var Fragments = require("../../lib/ast/fragments.js");
    var fragments;

    beforeEach(function() {
      fragments = new Fragments();
      fragments.add("the.answer", "42");
      fragments.add("the.expression",
        "answer == '#the.answer'",
        "'#the.answer' == answer");

      fragments.add("inc.by.two",
        "i = i + 2",
        "i = 2 + i",
        "i += 2"
      );
    });

    it("should be ok when comparing with first variant", function() {
      expect(
        compare(
          "if(42 == answer) {}",
          "if('#the.expression') {}",
          fragments
        )
      ).to.be.ok;
    });

    it("should be ok when comparing with second variant", function() {
      expect(
        compare(
          "if(answer == 42) {}",
          "if('#the.expression') {}",
          fragments
        )
      ).to.be.ok;
    });

    it("should work with for loop example", function() {
      expect(
        compare(
          "for(;; i += 2) {}",
          "for(;; '#inc.by.two') {}",
          fragments
        )
      ).to.be.ok;

      expect(
        compare(
          "for(;; i = i + 2) {}",
          "for(;; '#inc.by.two') {}",
          fragments
        )
      ).to.be.ok;

      expect(
        compare(
          "for(;; i = 2 + i) {}",
          "for(;; '#inc.by.two') {}",
          fragments
        )
      ).to.be.ok;
    });
  });


});
