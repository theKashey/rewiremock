var requires = [];
var Module;

var loader = function baseLoader(request/*, parent, isMain*/) {
  return requires[requires.length - 1](request);
};


function interceptor(superRequire, parentModule) {
  function RQ(fileName) {
    interceptor.pushLoader(superRequire);
    var result = Module
      ? Module._load(fileName, parentModule)
      : loader(fileName, parentModule);

    interceptor.popLoader(superRequire);
    return result;
  }

  Object.getOwnPropertyNames(superRequire).forEach(function(key) {
    try {
      RQ[key] = superRequire[key]
    } catch (e) {
      // could not set length, for example
    }
  });
  return RQ;
}

interceptor.pushLoader = function(loader) {
  requires.push(loader)
};

interceptor.popLoader = function(/*loader*/) {
  requires.pop();
};

interceptor.provideModule = function(_Module) {
  Module = _Module;
};

interceptor.load = loader;

exports.default = interceptor;