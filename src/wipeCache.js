import {getAllMocks} from './mocks';
import {shouldWipe} from './plugins'
import {relativeWipeCheck} from "./plugins/relative";
import Module from './module';
import {toModule} from "./utils/modules";

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
  if (primaryCache) {
    // post clean
    wipe(primaryCache, primaryResolver);
  } else {
    // pre clean
    wipe(getAllMocks(), resolver);
  }
};

export function safelyRemoveCache(moduleName) {
  const m = Module._cache[moduleName];
  if (m) {
    // remove self from own parents
    if (m.parent && m.parent.children) {
      m.parent.children = m.parent.children.filter(x => x !== m);
    }
    // remove self from own children
    if (m.children) {
      m.children.forEach(child => {
        if (child.parent && child.parent === m) {
          child.parent = null;
        }
      })
    }
    delete Module._cache[moduleName]
  }
}

export default wipeCache;