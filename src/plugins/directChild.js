import createPlugin, {PASS, NO} from './_common';
import getScope from '../globals';

import {isParent, getModuleName} from '../module';

const shouldMock = (mock, request, parent, topModule) => {
  if (mock.flag_directChildOnly) {
    return isParent(parent, topModule) ? PASS : NO;
  }
  if (mock.flag_toBeCalledFromMock) {
    const {mockedModules} = getScope();
    return getModuleName(parent) in mockedModules ? PASS : NO;
  }
};

const plugin = createPlugin({
  shouldMock,

  name: 'directChild'
});

export default plugin;