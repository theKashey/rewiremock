import {resolve,} from 'path';
import {fileExists} from "./common/utils";

const rewireMockConfig = (rewiremock, path = process.cwd()) => {
  let resolvedConfigPath = resolve(path, 'rewiremock.config.js');
  if (fileExists(resolvedConfigPath)) {
    const config = require(resolvedConfigPath);
    (config.default || config)(rewiremock);
  }
};

export default rewireMockConfig;
