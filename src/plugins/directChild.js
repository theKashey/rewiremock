import createPlugin, { PASS, NO } from './_common';
import getScope from '../globals';

const shouldMock = (mock, request, parent, topModule) => {
  if(mock.flag_directChildOnly) {
    return parent.parent === topModule ? PASS : NO;
  }
  if(mock.flag_toBeCalledFromMock){
    const { mockedModules } = getScope();
    return parent.filename in mockedModules ? PASS : NO;
  }
};

const plugin = createPlugin({
  shouldMock,

  name: 'directChild'
});

export default plugin;