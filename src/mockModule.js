import Module from './module';
import wipeCache from './wipeCache';
import createScope from './scope';
import {setScope} from './globals';
import {
    convertName,
    onMockCreate,
    onDisable,
    onEnable,
    addPlugin as addPluginAPI,
    removePlugin as removePluginAPI
} from './plugins';
import {resetMock, getMock, getAllMocks} from './mocks';
import ModuleMock from './mock';

let parentModule = module.parent;
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
 * @param {String} module name
 * @return {ModuleMock}
 */
function mockModule(moduleName) {
    scope();
    const name = convertName(moduleName, parentModule);
    resetMock(name);
    return onMockCreate(new ModuleMock(getMock(name)));
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
 * @param {Boolean} [options.noAutoPassBy] includes mocked modules to a isolation scope. Usage with mock.callThrough.
 */
mockModule.isolation = (options = {}) => {
    mockScope.isolation = { ...options };
    return mockModule;
};

/**
 * Deactivates isolation
 */
mockModule.withoutIsolation = () => {
    mockScope.isolation = false;
    return mockModule;
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
    mockScope.parentModule = parentModule = parent || module.parent.parent;
};


/** interface **/

/**
 * enabled rewiremock
 */
mockModule.enable = () => {
    scope();
    Module.overloadRequire();
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
        result = Module.require(Module.relativeFileName(file, parentModule));
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
            .then(() => mockModule.enable())
            .then(() =>
                Promise.resolve(loader()).then((mockedResult) => {
                    restore();
                    resolve(mockedResult);
                }, (err) => {
                    restore();
                    reject(err)
                })
            );
    });
};

/**
 * flushes all active overrides
 */
mockModule.flush = () => {
    wipeCache(mockScope.mockedModules);
    mockScope.mockedModules = {};
};

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
