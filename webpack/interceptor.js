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
    RQ[key] = superRequire[key]
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
}

interceptor.load = loader;


module.exports = interceptor;