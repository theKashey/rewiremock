import createPlugin, { NO } from './_common';

var wipeCheck = function wipeCheck(stubs, moduleName) {
    if (moduleName.indexOf('/node_modules/') > -1) {
        return NO;
    }
};

var plugin = createPlugin({
    wipeCheck: wipeCheck,

    name: 'protectNodeModules'
});

export default plugin;