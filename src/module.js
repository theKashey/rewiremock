import Module from 'module';
import {dirname} from 'path';

import executor, { requireModule } from './executor';

export const originalLoader = Module._load;
//__webpack_require__
//__webpack_modules__

const NodeModule = {
  overloadRequire() {
    Module._load = executor;
    // overload modules by internally
  },

  restoreRequire(){
    Module._load = originalLoader;
  },

  _resolveFilename(fileName, module){
    return Module._resolveFilename(fileName, module);
  },

  get _cache(){ return  Module._cache; },

  relativeFileName (name,parent) {
    if(name[0]=='.'){
      return dirname(parent.filename)+'/'+name;
    }
    return name;
  },

  require(name) {
    return requireModule(name);
  }
};

export default NodeModule;

