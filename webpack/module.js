const {dirname, resolve} = require('path');
const interceptor = require('./interceptor').default;

const Module = {
  _load: interceptor.load,
  _resolveFilename(fileName, parent){
    const targetFile = resolve(dirname(parent.i), fileName);
    const keys = Object
      .keys(__webpack_modules__)
      .sort((a,b) => a.length - b.length);
    const targetFileIndex = targetFile + '/index';

    const asFile = keys.find(name => name.indexOf(targetFile) > 0);
    const asIndex = keys.find(name => name.indexOf(targetFileIndex) > 0);

    if (asFile && asIndex && asFile.substr(targetFile.length+1).indexOf('/') >= 0) {
        return asIndex;
    }
    return asFile || fileName;
  },
  get _cache() {
    return require.cache;
  }
};

interceptor.provideModule(Module);

module.exports = Module;