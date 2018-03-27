import {resolve,} from 'path';
import {ensureRequire, fileExists} from "./common/utils";


const rewireMockConfig = (rewiremock, path = process.cwd()) => {
  let resolvedConfigPath = resolve(path, 'rewiremock.config.js');
  let fileName = fileExists(resolvedConfigPath);
  if (fileName) {
    const config = ensureRequire(fileName);
    (config.default || config)(rewiremock);
  }
};

export default rewireMockConfig;
