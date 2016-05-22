//
var esprima = require("esprima");

var Task = function() {
  this.state = Task.STATE_CREATED;
};

Object.assign(Task, {
  STATE_CREATED: "created",
  STATE_CURRENT: "current",
  STATE_REJECTED: "rejected",
  STATE_ACCEPTED: "accepted"
});

Object.assign(Task.prototype, {
  becomeCurrent: function() {
    this.state = Task.STATE_CURRENT;
  },
  check: function(code) {
    var tree, checkResult = false;

    if(arguments.length > 0) {
      try {
        tree = esprima.parse(code);
      } catch(err) {
        return false;
      }
    }

    if(typeof(this.validityCheck) === "function") {
      checkResult = this.validityCheck(tree);
    }

    if(checkResult) {
      this.state = Task.STATE_ACCEPTED;
    } else {
      this.state = Task.STATE_REJECTED;
    }

    return checkResult;
  },
  toJSON: function() {
    var hash = {
      state: this.state
    };

    if(this.name) {
      hash.name = this.name;
    }

    return hash;
  }
});

module.exports = Task;
