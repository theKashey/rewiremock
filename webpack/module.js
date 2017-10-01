const {dirname, resolve} = require('path');
const interceptor = require('./interceptor');

const Module = {
  _load: interceptor.load,
  _resolveFilename(fileName, parent){
    const targetFile = resolve(dirname(parent.i), fileName);
    return Object
      .keys(__webpack_modules__)
      .find(name => name.indexOf(targetFile) > 0) || fileName;
  },
  get _cache() {
    return require.cache;
  }
};

interceptor.provideModule(Module);

module.exports = Module;