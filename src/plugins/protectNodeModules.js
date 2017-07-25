import createPlugin, {NO} from './_common';

const wipeCheck = (stubs, moduleName) => {
    if (moduleName.indexOf('/node_modules/') > -1) {
        return NO;
    }
};

const plugin = createPlugin({
    wipeCheck,

    name: 'protectNodeModules'
});

export default plugin;