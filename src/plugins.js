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
    mock.disabled
        ? false
        : triResult(plugins().map(
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

const onMockCreate = (mock) => (
    plugins().reduce(
        (mock, plugin) => {
            if (plugin.onMockCreate) {
                return plugin.onMockCreate(mock) || mock
            }
            return mock;
        }, mock)
);

const onDisable = (mocks) => {
    const plugs = plugins();
    Object.keys(mocks).forEach(mockName => {
        const mock = mocks[mockName];
        plugs.forEach(plugin => plugin.onDisable && plugin.onDisable(mock._parent))
    });
};

const addPlugin = (plugin) => {
    getScope().plugins.push(plugin);
};

const removePlugin = (plugin) => {
    getScope().plugins = getScope().plugins.filter(plug => (plug !== plugin));
};

const _clearPlugins = () => (getScope().plugins = []);

export  {
    convertName,
    shouldWipe,
    shouldMock,
    onMockCreate,
    onDisable,

    addPlugin,
    removePlugin,

    _clearPlugins
}