import mapping from 'node-libs-browser';

import createPlugin from './_common';

const fileNameTransformer = (fileName/*, module*/) => mapping[fileName] || fileName;

const plugin = createPlugin({
  fileNameTransformer,
  //wipeCheck,
  //shouldMock,

  name: 'node-libs-browser'
});

export default plugin;