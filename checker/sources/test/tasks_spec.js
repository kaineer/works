//
var expect = require("chai").expect;
var Tasks = require("../lib/tasks");
var Task = require("../lib/task");

describe("Tasks", function() {
  var tasks;
  var testValue1, testValue2;

  context("simple tasks without names", function() {
    var check1 = function() { return testValue1 === 42; }
    var check2 = function() { return testValue2 === 38; }
    var task1, task2;

    beforeEach(function() {
      tasks = new Tasks();
      task1 = tasks.addTask(check1);
      task2 = tasks.addTask(check2);
    });

    it("should have two tasks", function() {
      expect(tasks.count()).to.eq(2);
    });

    it("should have first task as current", function() {
      expect(tasks.currentTask).to.eq(task1);
    });

    it("should not be completed", function() {
      expect(tasks.isCompleted()).not.to.be.ok;
    });

    context("checking and rejecting", function() {
      beforeEach(function() {
        testValue1 = 41;
        tasks.check();
      });

      it("should make current task into rejected state", function() {
        expect(tasks.currentTask.state).to.eq(Task.STATE_REJECTED);
      });

      it("should keep task1 as current task", function() {
        expect(tasks.currentTask).to.eq(task1);
      });

      it("should not be completed", function() {
        expect(tasks.isCompleted()).not.to.be.ok;
      });
    });

    context("checking and accepting", function() {
      beforeEach(function() {
        testValue1 = 42;
        tasks.check();
      });

      it("should make task1 into accepted state", function() {
        expect(task1.state).to.eq(Task.STATE_ACCEPTED);
      });

      it("should advance currentTask to task2", function() {
        expect(tasks.currentTask).to.eq(task2);
      });

      it("should not be completed", function() {
        expect(tasks.isCompleted()).not.to.be.ok;
      });
    });

    context("completing all tasks", function() {
      beforeEach(function() {
        testValue1 = 42;
        testValue2 = 38;
        tasks.check();
        tasks.check();
      });

      it("should have all tasks accepted", function() {
        expect(task1.state).to.eq(Task.STATE_ACCEPTED);
        expect(task2.state).to.eq(Task.STATE_ACCEPTED);
      });

      it("should be completed", function() {
        expect(tasks.isCompleted()).to.be.ok;
      });

      it("should have no current task", function() {
        expect(tasks.currentTask).to.eq(null);
      });
    });
  });

  context("task with name", function() {
    var task;
    var taskName = "Some task name";

    beforeEach(function() {
      tasks = new Tasks();
      task = tasks.addTask(null, taskName);
    });

    it("should set a name for a task", function() {
      expect(task.name).to.eq(taskName);
    });

    it("should have #toJSON method", function() {
      expect(typeof(tasks.toJSON)).to.eq("function");
    });

    it("should have toJSON value", function() {
      expect(tasks.toJSON()).to.eql({
        completed: false,
        tasks: [
          {
            state: Task.STATE_CURRENT,
            name: taskName
          }
        ]
      });
    })
  });
});
