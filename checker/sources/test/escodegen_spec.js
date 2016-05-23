var escodegen = require("escodegen");
var esprima = require("esprima");
var estraverse = require("estraverse");

var expect = require("chai").expect;

var gen = require("../lib/gen-utils");

describe("escodegen", function() {

  context("simple ariphmetics", function() {
    it("should generate 40 + 2", function() {
      expect(escodegen.generate(
        gen.op("+", gen.literal(40), gen.literal(2))
      )).to.eq("40 + 2");
    });
  });

  context("Method call", function() {
    it("should generate method call", function() {
      expect(escodegen.generate(
        gen.expression_statement(
          gen.call_expression(
            "CB", "checkpoint", [gen.literal(42)]
          )
        )
      )).to.eq("CB.checkpoint(42);");
    });
  });

  context("increment by 2", function() {
    context("assigment with +=", function() {
      it("should generate i += 2", function() {
        var tree = gen.expression_statement(
          gen.assignment(
            "+=", gen.identifier("i"), gen.literal(2)
          )
        );

        expect(escodegen.generate(
          tree
        )).to.eq("i += 2;");
      });
    });

    context("assignment with binary operator in rhv", function() {
      it("should generate i = i + 2", function() {
        var tree = gen.expression_statement(
          gen.assignment(
            "=",
            gen.identifier("i"),
            gen.op("+", gen.identifier("i"), gen.literal(2))
          )
        );

        expect(escodegen.generate(tree)).to.eq("i = i + 2;");
      });
    });

    context("unshift CB.checkpoint() into each cycle", function() {
      var code;
      var unshiftCheckpoint = function(node) {
        var cp = gen.expression_statement(
          gen.call_expression(
            "CB", "checkpoint", [gen.literal(42)]
          )
        );

        if(node.body.type === "BlockStatement") {
          node.body.body.unshift(cp);
        } else if(node.body.type === "EmptyStatement") {
          node.body.type = "BlockStatement";
          node.body.body = [cp];
        }
      };

      it("should unshift checkpoint into cycle", function() {
        var tree = esprima.parse("for(;;) {}");
        estraverse.traverse(tree, {
          enter: function(node) {
            if(node.type === "ForStatement") {
              unshiftCheckpoint(node);
            }
          }
        });
        var newCode = escodegen.generate(tree);
        expect(newCode).to.include("CB.checkpoint(42);");
        // => for(;;) { CB.checkpoint(42); }
      });
    });
  });
});
