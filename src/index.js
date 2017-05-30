import path from 'path'
import wipe from 'wipe-node-cache';
import * as API from './mockModule';

delete require.cache[require.resolve(__filename)];

export const cleanup = () => {
    const wipeAll = (stubs, moduleName) =>
        moduleName.indexOf(stubs) === 0;

    wipe(path.dirname(require.resolve(__filename)), wipeAll);
};

API.overrideEntryPoint(module.parent);
API.mockModule.clear();

export const addPlugin = API.addPlugin;
export const overrideEntryPoint = API.overrideEntryPoint;

export default API.mockModule;