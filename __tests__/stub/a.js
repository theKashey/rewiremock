const path = require('path');
const b = require('./b');

exports.test1 = () => path.readFileSync('./use-node_module.js');
exports.test2 =  (a) => b(a);