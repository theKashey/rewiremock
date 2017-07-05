import getScope from './globals';
import {YES, NO, PASS} from './plugins/_common';

const plugins = () => {
    const result = [];
    const collect = (scope) => {
        result.push(...scope.plugins);
        if (scope.parentScope) {
            collect(scope.parentScope);
        }
    };
    collect(getScope());
    return result;
};

const convertName = (fileName, parentModule) => (
    plugins().reduce(
        (name, plugin) => {
            if (plugin.fileNameTransformer) {
                return plugin.fileNameTransformer(name, parentModule) || name
            }
            return name;
        }, fileName)
);

const triResult = (values, defaultValue) => {
    if (values.indexOf(NO) >= 0) {
        return false;
    }
    if (values.indexOf(YES) >= 0) {
        return true;
    }
    return defaultValue;
};

const shouldMock = (mock, request, parent, topModule) => (
    triResult(plugins().map(
        plugin =>
            plugin.shouldMock ? plugin.shouldMock(mock, request, parent, topModule) : PASS
    ), true)
);

const shouldWipe = (stubs, moduleName) => (
    triResult(plugins().map(
        plugin =>
            plugin.wipeCheck ? plugin.wipeCheck(stubs, moduleName) : PASS
    ), false)
);

const addPlugin = (plugin) => {
    getScope().plugins.push(plugin);
};

const _clearPlugins = () => (getScope().plugins = []);

export  {
    convertName,
    shouldWipe,
    shouldMock,

    addPlugin,

    _clearPlugins
}