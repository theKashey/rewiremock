import Module from '../module';
import createPlugin, { standardWipeCheck } from './_common';

var fileNameTransformer = function fileNameTransformer(fileName, module) {
    return Module._resolveFilename(fileName, module);
};
var wipeCheck = function wipeCheck(stubs, moduleName) {
    return standardWipeCheck(stubs, moduleName);
};

var plugin = createPlugin({
    fileNameTransformer: fileNameTransformer,
    wipeCheck: wipeCheck,

    name: 'nodejs'
});

export default plugin;