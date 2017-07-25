import {readAlises, processFile} from './common/aliases'
import createPlugin, {standardWipeCheck} from './_common';

let settings = null;

const configure = (fileName) => {
    settings = readAlises(fileName);
};

const fileNameTransformer = (fileName) => {
    if (!settings) {
        configure();
    }
    return processFile(fileName, settings);
};

const wipeCheck = (stubs, moduleName) => standardWipeCheck(stubs, moduleName);

export {
    configure
}

export default createPlugin({
    fileNameTransformer,
    wipeCheck,

    name: 'webpack-alias'
});

