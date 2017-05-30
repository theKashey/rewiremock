var test1 = require('./foo');
var test2 = require('./sub/test');

module.exports = function () {
    return test1() + test2();
};