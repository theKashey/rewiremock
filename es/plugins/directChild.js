import createPlugin, { PASS, NO } from './_common';
import getScope from '../globals';

import { inParents, getModuleName } from '../module';

var shouldMock = function shouldMock(mock, request, parent, topModule) {
  if (mock.flag_directChildOnly) {
    return inParents(parent, topModule) ? PASS : NO;
  }
  if (mock.flag_toBeCalledFromMock) {
    var _getScope = getScope(),
        mockedModules = _getScope.mockedModules;

    return getModuleName(parent) in mockedModules ? PASS : NO;
  }
};

var plugin = createPlugin({
  shouldMock: shouldMock,

  name: 'directChild'
});

export default plugin;