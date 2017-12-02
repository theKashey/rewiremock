import createPlugin from './_common';

const onMockCreate = (mock) => {
  mock.toMatchOrigin();
  return mock;
};

const plugin = createPlugin({
  onMockCreate,
  name: 'alwaysMatchOrigin'
});

export default plugin;