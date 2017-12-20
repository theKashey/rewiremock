require.context(".", true, /.js$/);
require('../webpack/interceptor')

var testsContext = require.context(".", true, /.spec.js$/);
testsContext.keys().forEach(testsContext);