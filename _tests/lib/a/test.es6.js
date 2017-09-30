var test1 = require('./foo');
var test2 = require('../b/bar');
var test3 = require('../b/baz');

export default function () {
    return test1() + test2() + test3();
};