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

    it("should be ok when spaces are not equal", function() {
      expect(compare("  for  (;  ;) {  }", "for(;;){}")).
        to.be.ok;
    });
  });

  // TODO: context with fragments
});
