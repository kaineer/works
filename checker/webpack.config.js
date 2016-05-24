//
var path = require("path");

module.exports = {
  entry: __dirname + "/sources/checker.js",

  output: {
    path: __dirname + "/build/js",
    filename: "bundle.js"
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.json$/,
        loader: "json-loader"
      }
    ]
  }
};
