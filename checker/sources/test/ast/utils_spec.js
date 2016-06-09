var expect = require("chai").expect;
var utils = require("../../lib/ast/utils.js");
var astPath = utils.astPath;
var getTree = utils.getTree;
var compare = require("../../lib/ast/compare.js");

describe("ast/utils", function() {
  describe("#getTree", function() {
    var content = {
        "type": "Program",
        "body": [
            {
                "type": "ExpressionStatement",
                "expression": {
                    "type": "Literal",
                    "value": 1,
                    "raw": "1"
                }
            }
        ],
        "sourceType": "script"
    };

    expect(compare(getTree("1"), "1")).
      to.be.truthy;
  });

  describe("#astPath", function() {
    var content = getTree("for(var i = 5;;) {}");

    it("should get for statement", function() {
      expect(astPath(content, "body.0.type")).to.eq("ForStatement");
    });

    it("should get variable name", function() {
      expect(astPath(content, "body.0.init.declarations.0.id.name")).
        to.eq("i");
    });
  });
});
