import createPlugin, { PASS, NO } from './_common';

const shouldMock = (mock, request, parent, topModule) => {
  if(mock.flag_directChildOnly) {
    return parent.parent === topModule ? PASS : NO;
  }
};

const plugin = createPlugin({
  shouldMock,

  name: 'directChild'
});

export default plugin;