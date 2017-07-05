import {isAbsolute} from 'path';
import createPlugin, { YES, PASS, NO } from './_common';

const trimKey = (key) => key[0] == '.' ? trimKey(key.substr(1)) : key;

const relativeWipeCheck = (stubs, moduleName) => {
    if (Object
            .keys(stubs)
            .find(key => moduleName.indexOf(trimKey(key)) >= 0)
    ) {
        return YES;
    }
};


const fileNameTransformer = (fileName/*, module*/) => fileName;
const wipeCheck = (stubs, moduleName) => relativeWipeCheck(stubs, moduleName);

const shouldMock = (mock, request, parent, topModule) => {
    return parent.parent === topModule ? PASS : NO;
};

const plugin = createPlugin({
    fileNameTransformer,
    wipeCheck,
    shouldMock
});

export default plugin;