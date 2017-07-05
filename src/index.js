import path from 'path'
import wipe from 'wipe-node-cache';
delete require.cache[path.join(path.dirname(require.resolve(__filename)),'./mockModule.js')];
import * as API from './mockModule';
import {_clearPlugins} from './plugins';

export const cleanup = () => {
    const wipeAll = (stubs, moduleName) => moduleName.indexOf(stubs) === 0;
    wipe(path.dirname(require.resolve(__filename)), wipeAll);
};

export const overrideEntryPoint = (module) => {
    delete require.cache[require.resolve(module.filename)];
    API.mockModule.overrideEntryPoint(module.parent);
    //API.cleanup();
};

overrideEntryPoint(module);

// instance must be clean
API.mockModule.clear();
_clearPlugins();

export const addPlugin = API.addPlugin;
export default API.mockModule;