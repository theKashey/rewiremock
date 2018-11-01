import Module, {getModuleParent} from './module';
import wipeCache from './wipeCache';
import createScope from './scope';
import {getScopeVariable, setScope} from './globals';
import {
    convertName,
    onMockCreate,
    onDisable,
    onEnable,
    addPlugin as addPluginAPI,
    removePlugin as removePluginAPI
} from './plugins';
import {resetMock, getMock, getAsyncMock, getAsyncModuleName, getAllMocks} from './mocks';
import ModuleMock from './mock';

let parentModule = getModuleParent(module);
let mockScope = null;
const scope = () => setScope(mockScope);
const updateScope = (parentScope = null) => {
    mockScope = createScope(parentScope, parentModule);
    scope();
};

updateScope();

/** main **/

/**
 * @name rewiremock
 * @param {String|Function} module name
 * @return {ModuleMock}
 */
function mockModule(moduleName) {
    scope();
    if(typeof moduleName === 'function'){
      return onMockCreate(new ModuleMock(getAsyncMock(moduleName, parentModule)));
    } else {
      const name = convertName(moduleName, parentModule);
      resetMock(name);
      return onMockCreate(new ModuleMock(getMock(name)));
    }
}

mockModule.getMock = (module) => {
  let moduleName = module;
  if(typeof moduleName === 'function'){
    moduleName = getAsyncModuleName(moduleName, parentModule);
  } else {
    moduleName = convertName(moduleName, parentModule);
  }
  const mock = getMock(moduleName);
  if(mock) {
    return new ModuleMock(mock)
  }
  return null;
}

/**
 * @name rewiremock.resolve
 * @param {String} module name
 * @return {String} converted module name
 */
mockModule.resolve = (module) => {
    scope();
    return convertName(module, parentModule);
};

/** flags **/

/**
 * Activates module isolation
 * @param {Object} [options]
 * @param {Boolean} [options.noAutoPassBy] excludes mocked modules to a isolation scope. Use it with mock.callThrough.
 * @param {Boolean} [options.noParentPassBy] disable allowing any module, with allowed parent
 */
mockModule.isolation = (options = {}) => {
    mockScope.isolation = Object.assign({}, options);
    return mockModule;
};

/**
 * Deactivates isolation
 */
mockModule.withoutIsolation = () => {
    mockScope.isolation = false;
    return mockModule;
};

mockModule.forceCacheClear = (mode) => {
    mockScope.forceCacheClear = mode ? mode : true;
};

/**
 * Adding new passby record
 * @param {String|RegEx|Function} pattern
 */
mockModule.passBy = (pattern) => {
    mockScope.passBy.push(pattern);
    return mockModule;
};

mockModule.overrideEntryPoint = (parent) => {
    mockScope.parentModule = parentModule = parent || getModuleParent(getModuleParent(module));
};


/** interface **/

/**
 * enabled rewiremock
 */
mockModule.enable = () => {
    scope();
    Module.probeSyncModules();
    Module.overloadRequire();
    storeCache();
    wipeCache();
    onEnable(getAllMocks());
    return mockModule;
};

/**
 * disabled rewiremock
 */
mockModule.disable = () => {
    scope();
    Module.restoreRequire();
    onDisable(getAllMocks());
    mockModule.withoutIsolation();
    mockModule.flush();
    return mockModule;
};


/**
 * Requires file with hooks
 * @param {String|Function} file
 * @param {Object|Function} overrides
 */
mockModule.proxy = (file, overrides = {}) => {
    let result = 0;
    const stubs =
      typeof overrides === 'function'
      ? overrides(ModuleMock.inlineConstructor)
      : overrides;

    mockModule.inScope( () => {
      Object
        .keys(stubs)
        .forEach( key => mockModule(key).from(stubs[key]));

      mockModule.enable();
      if(typeof file === 'string') {
        result = mockModule.requireActual(file);
      } else {
        result = file();
      }
      mockModule.disable();
    });
    return result;
};

/**
 * Imports file with hooks
 * @param {Function} importFunction (use import)
 * @param {Object|Function} overrides
 * @return {Promise}
 */
mockModule.module = (importFunction, overrides = {}) => {
  const stubs =
    typeof overrides === 'function'
      ? overrides(ModuleMock.inlineConstructor)
      : overrides;

  return mockModule.around(importFunction, () =>
    Object
      .keys(stubs)
      .forEach( key => mockModule(key).from(stubs[key]))
  );
};

/**
 * Creates temporary executing scope. All mocks and plugins you will add in callback will be removed at exit.
 * @param callback
 */
mockModule.inScope = (callback) => {
    const currentScope = mockScope;
    let error;
    updateScope(currentScope);
    try {
      callback();
    } catch(e) {
        error = e;
    }

    mockScope = currentScope;
    if(error) throw error;
    return mockModule;
};


/**
 * executes module in sandbox
 * @param {Function} loader loader callback
 * @param {Function} [createCallback] - optional callback to be executed before load.
 * @return {Promise}
 */
mockModule.around = (loader, createCallback) => {
    return new Promise((resolve, reject) => {
        const currentScope = mockScope;
        updateScope(currentScope);

        const restore = () => {
          mockModule.disable();
          mockScope = currentScope;
        };

        Promise.resolve(createCallback && createCallback(mockModule))
            .then(() => Module.probeAsyncModules())
            .then(() => mockModule.enable())
            .then(() =>
                Promise.resolve(loader())
                  .then((mockedResult) => {
                    restore();
                    resolve(mockedResult);
                }, (err) => {
                    restore();
                    reject(err)
                })
            );
    });
};

mockModule.stubFactory = factory => {
  const currentScope = mockScope;
  currentScope.options.stubFactory = factory;
};

const storeCache = () => {
  mockScope.requireCache = mockScope.requireCache || Object.assign({},require.cache);
};

const restoreCache = () => {
  const oldCache = mockScope.requireCache;
  const newCache = require.cache;
  if(oldCache) {
    Object
      .keys(oldCache)
      .filter(key => !newCache[key])
      .forEach(key => (newCache[key] = oldCache[key]));

    mockScope.requireCache = null;
  }
};

const swapCache = () => {
  const oldCache = mockScope.requireCache;
  const newCache = require.cache;
  if(oldCache) {
    Object
      .keys(newCache)
      .filter(key => !oldCache[key])
      .filter(key => key.indexOf('.node') < 0)
      .forEach(key => delete newCache[key]);

    Object
      .keys(oldCache)
      .forEach(key => (newCache[key] = oldCache[key]));

    mockScope.requireCache = null;
  }
};
/**
 * flushes all active overrides
 */
mockModule.flush = () => {
    const forceCacheClear = getScopeVariable('forceCacheClear');
    // flush away soiled modules
    wipeCache(mockScope.mockedModules);
    mockScope.mockedModules = {};
    if(forceCacheClear) {
      if (forceCacheClear !== 'nocache') {
        // restore cache completely
        swapCache();
      }
    } else {
        // merge caches
        restoreCache();
    }
};

/**
 * Low-level require
 * @param {String} fileName
 */
mockModule.requireActual = (fileName) => Module.require(Module.relativeFileName(fileName, parentModule), parentModule);

/**
 * Low-level import
 * @param {String} fileName
 */
mockModule.importActual = (fileName) => Promise.resolve(this.requireActual(fileName));


/**
 * flushes anything
 */
mockModule.clear = () => {
    updateScope();
    scope();
    mockModule.withoutIsolation();
    mockModule.flush();
};

const cleanup = () => {
    delete require.cache[require.resolve(__filename)];
};


const addPlugin = (plugin) => {
    scope();
    addPluginAPI(plugin);
};

const removePlugin = (plugin) => {
    scope();
    removePluginAPI(plugin);
};

mockModule.addPlugin = (plugin) => {
    addPlugin(plugin);
    return mockModule;
};

export {
    mockModule,
    addPlugin,
    removePlugin,
    cleanup
};
