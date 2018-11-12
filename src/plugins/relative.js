import createPlugin, {YES, PASS, NO} from './_common';
import {inParents} from '../module';
import { extensions } from "../_common";

const trimKey = (key) => key[0] == '.' ? trimKey(key.substr(1)) : key;

export const relativeWipeCheck = (stubs, moduleName) => {
  if (Object
      .keys(stubs)
      .some(key =>
        extensions.some( ext => moduleName.endsWith(trimKey(key+ext)))
      )
  ) {
    return YES;
  }
};

const fileNameTransformer = (fileName/*, module*/) => fileName;
//const wipeCheck = (stubs, moduleName) => relativeWipeCheck(stubs, moduleName);

const shouldMock = (mock, request, parent, topModule) => {
  return inParents(parent, topModule) ? PASS : NO;
};

const plugin = createPlugin({
  fileNameTransformer,
  //wipeCheck,
  shouldMock,

  name: 'relative'
});

export default plugin;