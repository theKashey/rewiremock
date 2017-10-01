var webpack = require("webpack");
var mockPlugin = require("./webpack/plugin");
var path = require('path');

module.exports = function (config) {
  config.set({

    files: [
      './node_modules/phantomjs-polyfill-object-assign/object-assign-polyfill.js',
      '_tests/karma.js'
    ],

    // frameworks to use
    frameworks: ['mocha'],

    preprocessors: {
      // only specify one entry point
      // and require all tests in there
      '_tests/karma.js': ['webpack']
    },

    webpack: {
      // webpack configuration
      plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new mockPlugin()
      ]
    },

    webpackMiddleware: {
      // webpack-dev-middleware configuration
      noInfo: true
    },

    plugins: [
      require("karma-webpack"),
      require("karma-mocha"),
      require("karma-phantomjs-launcher"),
      require("karma-chrome-launcher")
    ],

    //browsers: []
    browsers: ['PhantomJS', 'Chrome']
  });
};