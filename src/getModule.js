const Module = module.hot
  ? require('../webpack/module')
  : require('module');

export default Module;