var element = function(name) {

  var addTextNode = function(el, content) {
    var textNode = document.createTextNode(content);
    el.appendChild(textNode);
  };

  var addElement = function(el, value) {
    if(typeof(value) === "string") {
      addTextNode(el, value);
    } else {
      el.appendChild(value);
    }
  };

  var setAttributes = function(el, attrs) {
    Object.keys(attrs).forEach(function(key) {
      el.setAttribute(key, attrs[key]);
    })
  };

  var findContent = function(args) {
    return args.find(function(arg) {
      return typeof(arg) === "string" || Array.isArray(arg);
    });
  };

  var findObject = function(args) {
    return args.find(function(arg) {
      return arg && typeof(arg) === "object" && !Array.isArray(arg);
    }) || {};
  };

  var setContent = function(el, content) {
    if(Array.isArray(content)) {
      content.forEach(function(value) {
        addElement(el, value);
      })
    } else {
      addTextNode(el, content);
    }
  };

  var el = document.createElement(name);
  var args = [].slice.call(arguments, 1);

  setAttributes(el, findObject(args));
  setContent(el, findContent(args));

  return el;
};

var ref = function(path) {
  var parts = path.split(".");
  var value = this;
  parts.some(function(part) {
    value = value[part];
    return !value || typeof(value) !== "object";
  });
  return value;
};

var createTemplate = function(callback) {
  return function(data) {
    return callback(element, ref.bind(data));
  };
};

module.exports = createTemplate;
