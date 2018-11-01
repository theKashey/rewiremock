import {getAllAsyncMocks, insertMock} from "./mocks";

let currentModule;

const loadInRoll = (mocks, middleTick) => {
  if (mocks.length) {
    currentModule = mocks[0];
    currentModule.result = currentModule.creator();
    if (currentModule.result && currentModule.result.then) {
      return middleTick()
        .then(() => currentModule.result)
        .then(() => loadInRoll(mocks.slice(1), middleTick));
    } else {
      return loadInRoll(mocks.slice(1), middleTick);
    }
  } else {
    return Promise.resolve();
  }
};

const probeAsyncModules = {
  hasAsyncModules() {
    const mocks = getAllAsyncMocks();
    return mocks.length
      ? mocks
      : false;
  },

  load: (Module) => (request, parent) => {
    currentModule.loaded = true;
    const baseRequest = Module._resolveFilename(request, parent);
    currentModule.mock.name = baseRequest;
    insertMock(baseRequest, currentModule.mock);
  },

  execute(middleTick) {
    const mocks = getAllAsyncMocks();
    return loadInRoll(mocks, middleTick);
  }
};

export default probeAsyncModules;