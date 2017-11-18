import * as API from './mockModule';
delete require.cache[require.resolve(__filename)];
export default API.mockModule;