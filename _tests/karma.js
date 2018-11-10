require('babel-polyfill');
require.context(".", true, /.js$/);
require('../webpack/interceptor')

var testsContext = require.context(".", false, /.spec.js$/);
testsContext.keys().forEach(testsContext);

var testsContext = require.context("./plugins/", false, /.spec.js$/);
testsContext.keys().forEach(testsContext);

var testsContext = require.context("./defaultConfig/", false, /.spec.js$/);
testsContext.keys().forEach(testsContext);