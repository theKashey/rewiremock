import createPlugin, { PASS, NO } from './_common';
import { inParents } from '../module';

var shouldMock = function shouldMock(mock, request, parent, topModule) {
  return inParents(parent, topModule) ? PASS : NO;
};

var plugin = createPlugin({
  shouldMock: shouldMock,

  name: 'childOnly'
});

export default plugin;