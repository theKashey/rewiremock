import {isAbsolute} from 'path';
import createPlugin, {standardWipeCheck} from './_common';

const fileNameTransformer = (fileName/*, module*/) => fileName;
const wipeCheck = (stubs, moduleName) => standardWipeCheck(stubs, moduleName);

const shouldMock = (mock, request, parent, topModule) => {
    return isAbsolute(mock.__MI_name) || parent.parent === topModule
};

const plugin = createPlugin({
    fileNameTransformer,
    wipeCheck,
    shouldMock
});

export default plugin;