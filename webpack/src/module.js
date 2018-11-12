var path = require('path');
var dirname = path.dirname;
var resolve = path.resolve;
var interceptor = require('./interceptor').default;

var Module = {
  _load: interceptor.load,
  _resolveFilename: function(fileName, parent) {
    var targetFile = resolve(dirname(parent.i), fileName);
    var keys = Object
      // eslint-disable-next-line no-undef
      .keys(__webpack_modules__)
      .sort(function(a, b) { return a.length - b.length; });
    var targetFileIndex = targetFile + '/index';

    var asIs = keys.filter(function(name) { return name.indexOf(fileName) >= 0; }).shift();
    var asFile = keys.filter(function(name) { return name.indexOf(targetFile) >= 0; }).shift();
    var asIndex = keys.filter(function(name) { return name.indexOf(targetFileIndex) >= 0; }).shift();

    if (asFile && asIndex && asFile.substr(targetFile.length + 1).indexOf('/') >= 0) {
      return asIndex;
    }
    if (!asFile && !asIs) {
      // eslint-disable-next-line
      console.warn('rewiremock: ', fileName, 'requested from', parent.i, 'was not found');
    }
    return asFile || fileName;
  },
  get _cache() {
    return require.cache;
  }
};

interceptor.provideModule(Module);

module.exports = Module;