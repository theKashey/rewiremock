import path from 'path'
import wipe from 'wipe-node-cache';
import {_clearPlugins} from './plugins';
import plugins from './plugins/index';

delete require.cache[path.join(path.dirname(require.resolve(__filename)), './mockModule.js')];
import * as API from './mockModule';


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

const addPlugin = API.addPlugin;
const removePlugin = API.removePlugin;

addPlugin(plugins.toBeUsed);

export {
    addPlugin,
    removePlugin,
    plugins
};
export default API.mockModule;