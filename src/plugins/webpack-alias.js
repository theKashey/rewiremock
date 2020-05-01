import {readAliases, processFile} from './common/aliases'
import createPlugin, {standardWipeCheck} from './_common';

let settings = null;

const configure = (fileName) => {
    settings = readAliases(fileName);
};

const fileNameTransformer = (fileName) => {
    if (!settings) {
        configure();
    }
    return processFile(fileName, settings);
};

export {
    configure
}

export default createPlugin({
    fileNameTransformer,

    name: 'webpack-alias'
});

