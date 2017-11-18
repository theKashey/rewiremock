import { getAllMocks } from './mocks';
import { shouldWipe } from './plugins';

// which one?
export var wipe = module.hot ? require('wipe-webpack-cache') : require('wipe-node-cache');

var primaryResolver = function primaryResolver(stubs, moduleName) {
  return stubs[moduleName];
};

var resolver = function resolver(stubs, moduleName) {
  // never wipe .node(native) module
  if (moduleName.indexOf('\.node') > -1) {
    return false;
  }
  return shouldWipe(stubs, moduleName);
};

var wipeCache = function wipeCache() {
  var primaryCache = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  wipe(primaryCache, primaryResolver);
  wipe(getAllMocks(), resolver);
};

export default wipeCache;