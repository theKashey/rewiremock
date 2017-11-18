import { readAliases, processFile } from './common/aliases';
import createPlugin, { standardWipeCheck } from './_common';

var settings = null;

var configure = function configure(fileName) {
    settings = readAliases(fileName);
};

var fileNameTransformer = function fileNameTransformer(fileName) {
    if (!settings) {
        configure();
    }
    return processFile(fileName, settings);
};

var wipeCheck = function wipeCheck(stubs, moduleName) {
    return standardWipeCheck(stubs, moduleName);
};

export { configure };

export default createPlugin({
    fileNameTransformer: fileNameTransformer,
    wipeCheck: wipeCheck,

    name: 'webpack-alias'
});