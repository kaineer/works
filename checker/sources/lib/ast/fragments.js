var compare = require("./compare.js");
var getTree = require("./utils.js").getTree;
var extend = require("./utils.js").extend;
var is = require("./utils.js").is;
var Fragment = require("./fragment.js");

var slice = Array.prototype.slice;

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
  add: function(name) {
    var variants = slice.call(arguments, 1);
    this.fragments[name] = Fragment.create(variants);
  },
  compare: function(name, source) {
    var fragment = this.fragments[name];
    return fragment.compare(source);
  }
});

module.exports = Fragments;
