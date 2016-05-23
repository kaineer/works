var Task = require("./task");

//
var Tasks = function() {
  this.tasks = [];
  this.currentTask = null;
  this.completed = true;
};

Object.assign(Tasks.prototype, {
  addTask: function(checkFunction, taskName) {
    var task = new Task();
    task.validityCheck = checkFunction;

    if(taskName) {
      task.name = taskName;
    }

    if(!this.currentTask) {
      this.currentTaskIndex = 0;
      this.currentTask = task;
      task.becomeCurrent();
      this.completed = false;
    }

    this.tasks.push(task);

    return task;
  },
  isCompleted: function() {
    return this.completed;
  },
  count: function() {
    return this.tasks.length;
  },
  check: function(code) {
    var checkResult;

    if(this.currentTask) {
      checkResult = this.currentTask.check(code);
    } else {
      return false;
    }

    if(checkResult) {
      this.currentTaskIndex += 1;
      if(this.currentTaskIndex >= this.tasks.length) {
        this.completed = true;
        this.currentTask = null;
      } else {
        this.currentTask = this.tasks[this.currentTaskIndex];
        this.currentTask.becomeCurrent();
      }
    }

    return checkResult;
  },
  toJSON: function() {
    return {
      completed: this.completed,
      tasks: this.tasks.map(function(task) {
        return task.toJSON();
      })
    };
  }
});

module.exports = Tasks;
