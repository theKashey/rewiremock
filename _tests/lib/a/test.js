var test1 = require('./foo');
var test2 = require('../b/bar');
var test3 = require('../b/baz');

module.exports = function () {
    return test1() + test2() + test3();
};