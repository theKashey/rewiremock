import path from 'path'
import { wipe } from './wipeCache';
import {_clearPlugins} from './plugins';
import plugins from './plugins/index';
import {getModuleName, getModuleParent} from './module';

const moduleName = getModuleName(module);
if(!moduleName) {
    throw new Error('Rewiremock: while you using Jest - disable automocking')
}

delete require.cache[path.join(path.dirname(__filename), './mockModule.js')];
delete require.cache[moduleName.replace('index.js', 'mockModule.js')];

import * as API from './mockModule';

export const cleanup = () => {
    const wipeAll = (stubs, moduleName) => moduleName.indexOf(stubs) === 0;
    wipe(path.dirname(__filename), wipeAll);
};

export const overrideEntryPoint = (module) => {
    delete require.cache[getModuleName(module)];
    API.mockModule.overrideEntryPoint(getModuleParent(module));
    //API.cleanup();
};

overrideEntryPoint(module);

// instance must be clean
API.mockModule.clear();
_clearPlugins();

const addPlugin = API.addPlugin;
const removePlugin = API.removePlugin;

//addPlugin(plugins.nodejs);

addPlugin(plugins.toBeUsed);
addPlugin(plugins.directChild);

export {
    addPlugin,
    removePlugin,
    plugins
};

export default API.mockModule;