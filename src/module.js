import Module from 'module';
import executor from './executor';

export const originalLoader = Module._load;

const NodeModule = {
  overloadRequire() {
    Module._load = executor;
  },

  restoreRequire(){
    Module._load = originalLoader;
  },

  _resolveFilename(fileName, module){
    return Module._resolveFilename(fileName, module);
  },

  get _cache(){ return  Module._cache; }
};

export default NodeModule;

