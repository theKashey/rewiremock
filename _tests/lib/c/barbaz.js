var bar = require('./bar');
var baz = require('./baz');

module.exports = function () {
  return ">"+bar()+baz();
};