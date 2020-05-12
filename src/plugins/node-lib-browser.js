import createPlugin from './_common';

let mapping;

const init = () => {
  mapping = require('node-libs-browser');
}
const fileNameTransformer = (fileName/*, module*/) => mapping[fileName] || fileName;

const plugin = createPlugin({
  init,
  fileNameTransformer,
  //wipeCheck,
  //shouldMock,

  name: 'node-libs-browser'
});

export default plugin;