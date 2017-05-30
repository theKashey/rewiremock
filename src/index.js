import path from 'path'
import wipe from 'wipe-node-cache';
import * as API from './mockModule';
import {_clearPlugins} from './plugins';

delete require.cache[require.resolve(__filename)];

export const cleanup = () => {
    const wipeAll = (stubs, moduleName) =>
    moduleName.indexOf(stubs) === 0;

    wipe(path.dirname(require.resolve(__filename)), wipeAll);
};

API.overrideEntryPoint(module.parent);
// instance must be clear
API.mockModule.clear();
_clearPlugins();


export const addPlugin = API.addPlugin;
export const overrideEntryPoint = API.overrideEntryPoint;

export default API.mockModule;