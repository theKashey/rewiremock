import {dirname, resolve} from 'path';
import Module from './getModule';

import executor, {requireModule} from './executor';
import probeAsyncModules from './asyncModules';
import {getModuleName, getModuleParent, getModuleParents, moduleCompare} from "./utils/modules";

export const originalLoader = Module._load;

const NodeModule = {
  overloadRequire() {
    Module._load = executor;
    // overload modules by internally
  },

  restoreRequire() {
    Module._load = originalLoader;
  },

  probeAsyncModules() {
    const load = Module._load;
    Module._load = probeAsyncModules.load(this);
    return probeAsyncModules
      .execute(() => Promise.resolve(true))
      .then(() => {
        Module._load = load;
      })
  },

  probeSyncModules() {
    const load = Module._load;
    Module._load = probeAsyncModules.load(this);
    probeAsyncModules.execute(() => {
      throw new Error('could not use dynamic imports with sync API')
    });
    Module._load = load;
  },

  _resolveFilename(fileName, module) {
    return Module._resolveFilename(fileName, module);
  },

  get _cache() {
    return Module._cache;
  },

  relativeFileName(name, parent) {
    if (name[0] === '.') {
      return this._resolveFilename(name, parent);
    }
    return name;
  },

  require(name, parentModule) {
    return requireModule(name, parentModule);
  }
};

export const pickModuleName = (fileName, parent) => {
  if (typeof __webpack_modules__ !== 'undefined' && !__webpack_modules__[fileName]) {
    const targetFile = resolve(dirname(getModuleName(parent)), fileName);
    return Object
      .keys(__webpack_modules__)
      .filter(name => name.indexOf(targetFile) > 0)
      .shift();
  } else {
    return fileName;
  }
};



export {getModuleName, getModuleParent, getModuleParents, moduleCompare}

export const inParents = (a, b) => {
  const B = getModuleName(b)
  const parents = getModuleParents(a);
  return parents.some(x => x === B);
}

export const isParent = (a, b) => {
  const B = getModuleName(b)
  const parents = getModuleParents(a);
  return parents[0] === B;
}


export default NodeModule;

