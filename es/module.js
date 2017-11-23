import { dirname, resolve } from 'path';
import Module from './getModule';

import executor, { requireModule } from './executor';
import _probeAsyncModules from './asyncModules';

export var originalLoader = Module._load;

var NodeModule = {
  overloadRequire: function overloadRequire() {
    Module._load = executor;
    // overload modules by internally
  },
  restoreRequire: function restoreRequire() {
    Module._load = originalLoader;
  },
  probeAsyncModules: function probeAsyncModules() {
    var load = Module._load;
    Module._load = _probeAsyncModules.load(this);
    return _probeAsyncModules.execute().then(function () {
      Module._load = load;
    });
  },
  _resolveFilename: function _resolveFilename(fileName, module) {
    return Module._resolveFilename(fileName, module);
  },


  get _cache() {
    return Module._cache;
  },

  relativeFileName: function relativeFileName(name, parent) {
    if (name[0] == '.') {
      return this._resolveFilename(name, parent);
    }
    return name;
  },
  require: function require(name, parentModule) {
    return requireModule(name, parentModule);
  }
};

var toModule = function toModule(name) {
  return require.cache[name];
};

export var pickModuleName = function pickModuleName(fileName, parent) {
  if (typeof __webpack_modules__ !== 'undefined') {
    var targetFile = resolve(dirname(getModuleName(parent)), fileName);
    return Object.keys(__webpack_modules__).find(function (name) {
      return name.indexOf(targetFile) > 0;
    });
  } else {
    return fileName;
  }
};

export var moduleCompare = function moduleCompare(a, b) {
  return a === b || getModuleName(a) === getModuleName(b);
};

export var getModuleName = function getModuleName(module) {
  return module.filename || module.i;
};
export var getModuleParent = function getModuleParent(module) {
  return module.parent || toModule(module.parents[0]);
};
export var getModuleParents = function getModuleParents(module) {
  return module.parent ? [getModuleName(module.parent)] : module.parents;
};

export var inParents = function inParents(a, b) {
  var B = getModuleName(b);
  return !!getModuleParents(a).find(function (x) {
    return x === B;
  });
};

export default NodeModule;