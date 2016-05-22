//
var expect = require("chai").expect;
var esprima = require("esprima");

var checks = require("../lib/checks");

describe("checks", function() {
  var check;
  var runCheck = function(code) {
    var tree = esprima.parse(code);
    return check(tree);
  };

  context("infinite for loop check", function() {
    beforeEach(function() {
      check = checks.infiniteForLoop;
    });

    it("should reject empty string", function() {
      expect(runCheck("")).not.to.be.ok;
    });

    it("should accept valid loop", function() {
      expect(runCheck("for(;;) {}")).to.be.ok;
    });

    it("should reject loop with code in initializer", function() {
      expect(runCheck("for(var i;;) {}")).not.to.be.ok;
    });

    it("should reject loop with code in test", function() {
      expect(runCheck("for(; i < 10;) {}")).not.to.be.ok;
    });

    it("should reject loop with code in update", function() {
      expect(runCheck("for(;; i++) {}")).not.to.be.ok;
    });

    it("should reject loop without block body", function() {
      expect(runCheck("for(;;);")).not.to.be.ok;
    });

    it("should reject loop with some code in body", function() {
      expect(runCheck("for(;;) { var j = 0; }")).not.to.be.ok;
    });
  });

  context("infiniteForWithInit", function() {
    beforeEach(function() {
      check = checks.infiniteForWithInit;
    });

    it("should reject empty string", function() {
      expect(runCheck("")).not.to.be.ok;
    });

    it("should accept valid loop", function() {
      expect(runCheck("for(var i = 1;;) {}")).to.be.ok;
    });

    it("should reject loop without init", function() {
      expect(runCheck("for(;;) {}")).not.to.be.ok;
    });

    it("should reject another variable name", function() {
      expect(runCheck("for(var j = 1;;) {}")).not.to.be.ok;
    });

    it("should reject another variable value", function() {
      expect(runCheck("for(var i = 2;;) {}")).not.to.be.ok;
    });

    it("should reject another type of value", function() {
      expect(runCheck("for(var i = '1';;) {}")).not.to.be.ok;
    });

    it("should reject loop with code in test", function() {
      expect(runCheck("for(var i = 1; i < 10;) {}")).not.to.be.ok;
    });

    it("should reject loop with code in update", function() {
      expect(runCheck("for(var i = 1;; i++) {}")).not.to.be.ok;
    });

    it("should reject loop without block body", function() {
      expect(runCheck("for(var i = 1;;);")).not.to.be.ok;
    });

    it("should reject loop with some code in body", function() {
      expect(runCheck("for(var i = 1;;) { var j = 0; }")).not.to.be.ok;
    });
  });

  context("infiniteForWithInitAndTest", function() {
    beforeEach(function() {
      check = checks.infiniteForWithInitAndTest;
    });

    it("should reject empty string", function() {
      expect(runCheck("")).not.to.be.ok;
    });

    it("should accept valid loop", function() {
      expect(runCheck("for(var i = 1; i < 10;) {}")).to.be.ok;
    });

    it("should reject loop without test", function() {
      expect(runCheck("for(var i = 1;;) {}")).not.to.be.ok;
    });

    it("should reject loop with code in update", function() {
      expect(runCheck("for(var i = 1; i < 10; i++) {}")).not.to.be.ok;
    });

    it("should reject loop without block body", function() {
      expect(runCheck("for(var i = 1; i < 10;);")).not.to.be.ok;
    });

    it("should reject loop with some code in body", function() {
      expect(runCheck("for(var i = 1; i < 10;) { var j = 0; }")).not.to.be.ok;
    });
   });

   context("normalForEmptyBody", function() {
     beforeEach(function() {
       check = checks.normalForEmptyBody;
     });

     it("should reject empty string", function() {
       expect(runCheck("")).not.to.be.ok;
     });

     it("should accept valid loop", function() {
       expect(runCheck("for(var i = 1; i < 10; i += 2) {}")).to.be.ok;
     });

     it("should reject loop without update", function() {
       expect(runCheck("for(var i = 1; i < 10;) {}")).not.to.be.ok;
     });

     it("should reject loop without block body", function() {
       expect(runCheck("for(var i = 1; i < 10; i += 2);")).not.to.be.ok;
     });

     it("should reject loop with some code in body", function() {
       expect(runCheck("for(var i = 1; i < 10; i += 2) { var j = 0; }")).not.to.be.ok;
     });
   });

   context("normalForWithConsole", function() {
     beforeEach(function() {
       check = checks.normalForWithConsole;
     });

     it("should reject empty string", function() {
       expect(runCheck("")).not.to.be.ok;
     });

     it("should accept valid loop", function() {
       expect(runCheck("for(var i = 1; i < 10; i += 2) { console.log(i); }")).to.be.ok;
     });

     it("should reject loop with empty body", function() {
       expect(runCheck("for(var i = 1; i < 10; i += 2) {}")).not.to.be.ok;
     });
   });
});
