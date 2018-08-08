const requires = [];
let Module;

const loader = function baseLoader(request, parent, isMain) {
  return requires[requires.length - 1](request);
};


function interceptor(superRequire, parentModule) {
  function RQ(fileName) {
    interceptor.pushLoader(superRequire);
    const result = Module
      ? Module._load(fileName, parentModule)
      : loader(fileName, parentModule);

    interceptor.popLoader(superRequire);
    return result;
  }

  Object.getOwnPropertyNames(superRequire).forEach(key => {
    try {
      RQ[key] = superRequire[key]
    } catch (e) {
      // could not set length, for example
    }
  });
  return RQ;
}

interceptor.pushLoader = (loader) => {
  requires.push(loader)
};

interceptor.popLoader = (loader) => {
  requires.pop();
};

interceptor.provideModule = (_Module) => {
  Module = _Module;
};

interceptor.load = loader;

exports.default = interceptor;