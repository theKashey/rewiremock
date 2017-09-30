import createPlugin, {PASS, NO} from './_common';
import {inParents} from '../module';

const shouldMock = (mock, request, parent, topModule) => {
  return inParents(parent, topModule) ? PASS : NO;
};

const plugin = createPlugin({
  shouldMock,

  name: 'childOnly'
});

export default plugin;