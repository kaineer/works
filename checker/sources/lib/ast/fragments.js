var compare = require("./compare.js");
var getTree = require("./utils.js").getTree;
var extend = require("./utils.js").extend;
var is = require("./utils.js").is;
var Fragment = require("./fragment.js");

var Fragments = function() {
  this.fragments = {};
};

extend(Fragments.prototype, {
  get: function(name) {
    return this.fragments[name];
  },
  has: function(name) {
    return !!this.get(name);
  },
  add: function(name, pattern) {
    this.fragments[name] = new Fragment(pattern);
  },
  compare: function(name, source) {
    var fragment = this.fragments[name];
    return fragment.compare(source);
  }
});

module.exports = Fragments;
