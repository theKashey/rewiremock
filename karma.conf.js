var webpack = require("webpack");
module.exports = function(config) {
  config.set({

    files: [
      // all files ending in "test"
      //'./node_modules/phantomjs-polyfill/bind-polyfill.js',
      './node_modules/phantomjs-polyfill-object-assign/object-assign-polyfill.js',
      '_tests/karma.js'
      // each file acts as entry point for the webpack configuration
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
        new webpack.HotModuleReplacementPlugin()
      ]
    },

    webpackMiddleware: {
      // webpack-dev-middleware configuration
      noInfo: true
    },

    plugins: [
      require("karma-webpack"),
      require("karma-mocha"),
      require("karma-phantomjs-launcher")
      //require("karma-chrome-launcher")
    ],

    browsers: ['PhantomJS']
    //browsers: ['Chrome']
  });
};