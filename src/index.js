import path from 'path'
import {safelyRemoveCache, wipe} from './wipeCache';
import {_clearPlugins} from './plugins';
import plugins from './plugins/index';
import {getModuleName, getModuleParent} from './module';
import {setExtensions as resolveExtensions} from './constants';

const moduleName = getModuleName(module);
if (!moduleName) {
  throw new Error('Rewiremock: there is no "module name". If you are using Jest - disable automocking.');
}

if (!getModuleParent(module)) {
  throw new Error('Rewiremock: there is no "parent module". Is there two HotModuleReplacementPlugins?');
}

// delete core
safelyRemoveCache(path.join(path.dirname(__filename), './mockModule.js'));
// delete self
safelyRemoveCache(moduleName.replace('index.js', 'mockModule.js'));

import * as API from './mockModule';
import applyDefaultConfig from "./plugins/defaultConfig";

export const cleanup = () => {
  const wipeAll = (stubs, moduleName) => moduleName.indexOf(stubs) === 0;
  wipe(path.dirname(__filename), wipeAll);
};

export const overrideEntryPoint = (module) => {
  safelyRemoveCache(getModuleName(module));
  API.mockModule.overrideEntryPoint(getModuleParent(module));
  //API.cleanup();
};

overrideEntryPoint(module);

// instance must be clean
API.mockModule.clear();
_clearPlugins();

const addPlugin = API.addPlugin;
const removePlugin = API.removePlugin;

//addPlugin(plugins.nodejs);

addPlugin(plugins.toBeUsed);
addPlugin(plugins.directChild);

addPlugin(plugins.__mock__);

if (typeof __webpack_require__ !== "undefined") {
  addPlugin(plugins.nodeLibBrowser);
}

applyDefaultConfig(API.mockModule);

if (global['_REWIREMOCK_HOISTED_']) {
  global['_REWIREMOCK_HOISTED_'].forEach(cb => {
    cb(API.mockModule, {plugins, overrideEntryPoint})
  });
  global['_REWIREMOCK_HOISTED_'] = [];
}

export {
  addPlugin,
  removePlugin,
  plugins,
  resolveExtensions
};

export default API.mockModule;