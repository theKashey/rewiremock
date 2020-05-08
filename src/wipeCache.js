import {getAllMocks} from './mocks';
import {shouldWipe} from './plugins'
import {relativeWipeCheck} from "./plugins/relative";
import Module from './module';

// which one?
export const wipe = typeof __webpack_require__ === 'function'
    ? require('wipe-webpack-cache')
    : require('wipe-node-cache').wipeCache;

const primaryResolver = (stubs, moduleName) => stubs[moduleName];

const resolver = (stubs, moduleName) => {
  // never wipe .node(native) module
  if (moduleName.indexOf('.node') > -1) {
    return false;
  }
  return 0 ||
    shouldWipe(stubs, moduleName) ||
    primaryResolver(stubs, moduleName) ||
    relativeWipeCheck(stubs, moduleName);
};

const wipeCache = (primaryCache) => {
  if(primaryCache) {
    // post clean
    wipe(primaryCache, primaryResolver);
  } else {
    // pre clean
    wipe(getAllMocks(), resolver);
  }
};

export function safelyRemoveCache(moduleName) {
  const m = Module._cache[moduleName];
  if(m) {
    if(m.parent && m.parent.children){
      m.parent.children = m.parent.children.filter(x => x!==m);
    }
    delete Module._cache[moduleName]
  }
}

export default wipeCache;