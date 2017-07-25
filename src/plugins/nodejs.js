import Module from 'module';
import createPlugin, {standardWipeCheck} from './_common';

const fileNameTransformer = (fileName, module) => Module._resolveFilename(fileName, module);
const wipeCheck = (stubs, moduleName) => standardWipeCheck(stubs, moduleName);

const plugin = createPlugin({
    fileNameTransformer,
    wipeCheck,

    name: 'nodejs'
});

export default plugin;