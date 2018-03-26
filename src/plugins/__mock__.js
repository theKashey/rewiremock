import createPlugin from './_common';
import ModuleMock from "../mock";
import {fileExists} from "./common/utils";

const getDelimiter = path => {
  const i1 = path.lastIndexOf('/');
  const i2 = path.lastIndexOf('\\');
  return i1 > i2 ? '/' : '\\'
};

const getMockName = path => {
  const delimiter = getDelimiter(path);
  const paths = path.split(delimiter);
  paths.splice(paths.length - 1, 0, '__mocks__');
  return paths.join(delimiter);
};

const autoMock = (baseRequest) => {
  const mockName = getMockName(baseRequest);
  if (!fileExists(mockName)) {
    return false;
  }
  const mock = new ModuleMock({});
  mock.by(mockName);
  return mock.mock;
};

const plugin = createPlugin({
  autoMock,

  name: 'directChild'
});

export default plugin;