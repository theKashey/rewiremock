import createPlugin from './_common';

const onMockCreate = (mock) => {
  mock.mockThrough();
  return mock;
};

const plugin = createPlugin({
  onMockCreate,
  onDisable: onMockCreate,

  name: 'mockThoughByDefault'
});

export default plugin;