import createPlugin, {PASS, NO} from './_common';
import getScope from '../globals';

import {inParents, getModuleName} from '../module';

const shouldMock = (mock, request, parent, topModule) => {
  if (mock.flag_directChildOnly) {
    return inParents(parent, topModule) ? PASS : NO;
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