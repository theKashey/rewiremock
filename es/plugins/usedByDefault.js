import createPlugin from './_common';

var onMockCreate = function onMockCreate(mock) {
    mock.toBeUsed();
    return mock;
};

var plugin = createPlugin({
    onMockCreate: onMockCreate,

    name: 'usedByDefault'
});

export default plugin;