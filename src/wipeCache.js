import wipe from 'wipe-node-cache';
import {getAllMocks} from './mocks';
import {shouldWipe} from './plugins'

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
    console.log(getAllMocks());
    wipe(primaryCache, primaryResolver);
    wipe(getAllMocks(), resolver);
};

export default wipeCache;