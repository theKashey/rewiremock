import createPlugin, {YES, PASS, NO} from './_common';
import {inParents} from '../module';

const trimKey = (key) => key[0] == '.' ? trimKey(key.substr(1)) : key;

const relativeWipeCheck = (stubs, moduleName) => {
  if (Object
      .keys(stubs)
      .find(key => moduleName.indexOf(trimKey(key)) >= 0)
  ) {
    return YES;
  }
};

const fileNameTransformer = (fileName/*, module*/) => fileName;
const wipeCheck = (stubs, moduleName) => relativeWipeCheck(stubs, moduleName);

const shouldMock = (mock, request, parent, topModule) => {
  return inParents(parent, topModule) ? PASS : NO;
};

const plugin = createPlugin({
  fileNameTransformer,
  wipeCheck,
  shouldMock,

  name: 'relative'
});

export default plugin;