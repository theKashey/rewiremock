// @flow
global['_REWIREMOCK_HOISTED_'] = global['_REWIREMOCK_HOISTED_'] || [];
global['_REWIREMOCK_HOISTED_'].unshift( function (rewiremock, api) {
  api.overrideEntryPoint(module);
  rewiremock.addPlugin(api.plugins.nodejs);
});

const mock = require("./lib/index.js");


module.exports = Object.assign(mock.default, mock);
