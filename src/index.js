import path from 'path'
import wipe from 'wipe-node-cache';
import * as API from './mockModule';
import {_clearPlugins} from './plugins';

export const cleanup = () => {
    const wipeAll = (stubs, moduleName) =>
    moduleName.indexOf(stubs) === 0;

    wipe(path.dirname(require.resolve(__filename)), wipeAll);
};

export const overrideEntryPoint = (module) => {
    delete require.cache[require.resolve(module.filename)];
    API.overrideEntryPoint(module.parent);
};

overrideEntryPoint(module);

// instance must be clear
API.mockModule.clear();
_clearPlugins();

export const addPlugin = API.addPlugin;
export default API.mockModule;