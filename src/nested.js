import * as API from './mockModule';

delete require.cache[require.resolve(__filename)];

API.overrideEntryPoint(module.parent);

export default API.mockModule;

export const overrideEntryPoint = API.overrideEntryPoint;