import createPlugin from './_common';

const onMockCreate = (mock) => {
    mock.toBeUsed();
    return mock;
};

const plugin = createPlugin({
    onMockCreate,

    name: 'usedByDefault'
});

export default plugin;