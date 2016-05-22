var expect = require("chai").expect;
var Task = require("../lib/task");

describe("Task", function() {
  var task;

  /*
    Task synopsys:

    var task = new Task();

    task.check = someFunctionToCheckTree
    task.state === Task.STATE_CREATED;

    task.becomeCurrent();
    task.state === Task.STATE_CURRENT;

    task.check(); // when functionToCheck returns false
    task.state === Task.STATE_REJECTED

    task.check(); // when functionToCheck returns true
    task.state === Task.STATE_ACCEPTED
   */

  beforeEach(function() {
    task = new Task();
  });

  context("just created", function() {
    it("should have CREATED state", function() {
      expect(task.state).to.eq(Task.STATE_CREATED);
    });

    it("should have toJSON", function() {
      expect(task.toJSON()).to.eql({
        state: Task.STATE_CREATED
      });
    });
  });

  context("when becoming current", function() {
    beforeEach(function() {
      task.becomeCurrent();
    });

    it("should have CURRENT state", function() {
      expect(task.state).to.eq(Task.STATE_CURRENT);
    });
  });

  context("checking with false result", function() {
    beforeEach(function() {
      task.validityCheck = function() { return false; }
    });

    it("check should return false", function() {
      expect(task.check()).not.to.be.ok;
    });

    it("should have REJECTED state", function() {
      task.check();
      expect(task.state).to.eq(Task.STATE_REJECTED);
    });
  });

  context("checking with true result", function() {
    beforeEach(function() {
      task.validityCheck = function() { return true; }
    });

    it("check should return true", function() {
      expect(task.check()).to.be.ok;
    });

    it("should have ACCEPTED state", function() {
      task.check();
      expect(task.state).to.eq(Task.STATE_ACCEPTED);
    });
  });
});
