import {dirname, resolve} from 'path';
import Module from './getModule';

import executor, {requireModule} from './executor';
import probeAsyncModules from './asyncModules';

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
      .execute()
      .then(() => {
        Module._load = load;
      })
  },

  _resolveFilename(fileName, module) {
    return Module._resolveFilename(fileName, module);
  },

  get _cache() {
    return Module._cache;
  },

  relativeFileName(name, parent) {
    if (name[0] == '.') {
      return this._resolveFilename(name, parent);
    }
    return name;
  },

  require(name, parentModule) {
    return requireModule(name, parentModule);
  }
};

const toModule = (name) => name && require.cache[name];

export const pickModuleName = (fileName, parent) => {
  if (typeof __webpack_modules__ !== 'undefined' && !__webpack_modules__[fileName]) {
    const targetFile = resolve(dirname(getModuleName(parent)), fileName);
    return Object
      .keys(__webpack_modules__)
      .find(name => name.indexOf(targetFile) > 0);
  } else {
    return fileName;
  }
};

export const moduleCompare = (a, b) => a === b || getModuleName(a) === getModuleName(b);

export const getModuleName = (module) => module.filename || module.i;
export const getModuleParent = (module) => module && (module.parent || toModule(module.parents && module.parents[0]));
export const getModuleParents = (module) => module && (module.parent ? [getModuleName(module.parent)] : module.parents);

export const inParents = (a, b) => {
  const B = getModuleName(b)
  return !!getModuleParents(a).find(x => x === B);
}

export default NodeModule;

