import createPlugin, { YES, PASS, NO } from './_common';
import { inParents } from '../module';

var trimKey = function trimKey(key) {
  return key[0] == '.' ? trimKey(key.substr(1)) : key;
};

var relativeWipeCheck = function relativeWipeCheck(stubs, moduleName) {
  if (Object.keys(stubs).find(function (key) {
    return moduleName.indexOf(trimKey(key)) >= 0;
  })) {
    return YES;
  }
};

var fileNameTransformer = function fileNameTransformer(fileName /*, module*/) {
  return fileName;
};
var wipeCheck = function wipeCheck(stubs, moduleName) {
  return relativeWipeCheck(stubs, moduleName);
};

var shouldMock = function shouldMock(mock, request, parent, topModule) {
  return inParents(parent, topModule) ? PASS : NO;
};

var plugin = createPlugin({
  fileNameTransformer: fileNameTransformer,
  wipeCheck: wipeCheck,
  shouldMock: shouldMock,

  name: 'relative'
});

export default plugin;