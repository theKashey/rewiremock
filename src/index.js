import * as API from './mockModule';

delete require.cache[require.resolve(__filename)];

API.overrideEntryPoint(module.parent);
API.mockModule.clear();

export default API.mockModule;

export const addPlugin = API.addPlugin;
export const overrideEntryPoint = API.overrideEntryPoint;