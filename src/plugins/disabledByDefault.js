import createPlugin from './_common';

const onMockCreate = (mock) => {
    mock.disable();
    return mock;
};

const plugin = createPlugin({
    onMockCreate,
    onDisable: onMockCreate,

    name: 'disabledByDefault'
});

export default plugin;