import wipeNode from 'wipe-node-cache';
import wipeWebpack from 'wipe-webpack-cache';
import {getAllMocks} from './mocks';
import {shouldWipe} from './plugins'

// which one?
export const wipe = module.hot ? wipeWebpack : wipeNode;

const primaryResolver = (stubs, moduleName) =>
  stubs[moduleName];

const resolver = (stubs, moduleName) => {
  // never wipe .node(native) module
  if (moduleName.indexOf('\.node') > -1) {
    return false;
  }
  return shouldWipe(stubs, moduleName);
};

const wipeCache = (primaryCache = {}) => {
  wipe(primaryCache, primaryResolver);
  wipe(getAllMocks(), resolver);
};

export default wipeCache;