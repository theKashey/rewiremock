import createPlugin from './_common';

var onMockCreate = function onMockCreate(mock) {
    mock.disable();
    return mock;
};

var plugin = createPlugin({
    onMockCreate: onMockCreate,
    onDisable: onMockCreate,

    name: 'disabledByDefault'
});

export default plugin;