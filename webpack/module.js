const interceptor = require('./interceptor');

const Module = {
  _load: interceptor.load,
  _resolveFilename(file, module){
    return file;
  },
  get _cache() {
    return require.cache;
  }
};

interceptor.provideModule(Module);

module.exports = Module;