import {getAllAsyncMocks, insertMock} from "./mocks";

let currentModule;

const loadInRoll = (mocks) => {
  if (mocks.length) {
    currentModule = mocks[0];
    return Promise.resolve()
      .then(currentModule.creator)
      .then(() => loadInRoll(mocks.slice(1)))
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

  execute() {
    const mocks = getAllAsyncMocks();
    return loadInRoll(mocks);
  }
};

export default probeAsyncModules;