import { getAllAsyncMocks, insertMock } from "./mocks";

var currentModule = void 0;

var loadInRoll = function loadInRoll(mocks) {
  if (mocks.length) {
    currentModule = mocks[0];
    return Promise.resolve().then(currentModule.creator).then(function () {
      return loadInRoll(mocks.slice(1));
    });
  } else {
    return Promise.resolve();
  }
};

var probeAsyncModules = {
  hasAsyncModules: function hasAsyncModules() {
    var mocks = getAllAsyncMocks();
    return mocks.length ? mocks : false;
  },


  load: function load(Module) {
    return function (request, parent) {
      currentModule.loaded = true;
      var baseRequest = Module._resolveFilename(request, parent);
      currentModule.mock.name = baseRequest;
      insertMock(baseRequest, currentModule.mock);
    };
  },

  execute: function execute() {
    var mocks = getAllAsyncMocks();
    return loadInRoll(mocks);
  }
};

export default probeAsyncModules;