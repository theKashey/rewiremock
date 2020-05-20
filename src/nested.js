import * as API from './mockModule';
import {safelyRemoveCache} from "./wipeCache";
import {getModuleName} from "./module";
safelyRemoveCache(getModuleName(module));
export default API.mockModule;