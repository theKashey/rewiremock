const mock = require("./lib/index.js");

mock.overrideEntryPoint(module);

mock.addPlugin(mock.plugins.nodejs);

module.exports = Object.assign({}, mock, mock.default);