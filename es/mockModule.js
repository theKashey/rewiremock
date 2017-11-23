var _this = this;

import Module, { getModuleParent } from './module';
import wipeCache from './wipeCache';
import createScope from './scope';
import { setScope } from './globals';
import { convertName, onMockCreate, onDisable, onEnable, addPlugin as addPluginAPI, removePlugin as removePluginAPI } from './plugins';
import { resetMock, getMock, getAsyncMock, getAllMocks } from './mocks';
import ModuleMock from './mock';

var parentModule = getModuleParent(module);
var mockScope = null;
var scope = function scope() {
    return setScope(mockScope);
};
var updateScope = function updateScope() {
    var parentScope = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

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
    if (typeof moduleName === 'function') {
        return onMockCreate(new ModuleMock(getAsyncMock(moduleName)));
    } else {
        var name = convertName(moduleName, parentModule);
        resetMock(name);
        return onMockCreate(new ModuleMock(getMock(name)));
    }
}

/**
 * @name rewiremock.resolve
 * @param {String} module name
 * @return {String} converted module name
 */
mockModule.resolve = function (module) {
    scope();
    return convertName(module, parentModule);
};

/** flags **/

/**
 * Activates module isolation
 * @param {Object} [options]
 * @param {Boolean} [options.noAutoPassBy] includes mocked modules to a isolation scope. Usage with mock.callThrough.
 */
mockModule.isolation = function () {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    mockScope.isolation = Object.assign({}, options);
    return mockModule;
};

/**
 * Deactivates isolation
 */
mockModule.withoutIsolation = function () {
    mockScope.isolation = false;
    return mockModule;
};

/**
 * Adding new passby record
 * @param {String|RegEx|Function} pattern
 */
mockModule.passBy = function (pattern) {
    mockScope.passBy.push(pattern);
    return mockModule;
};

mockModule.overrideEntryPoint = function (parent) {
    mockScope.parentModule = parentModule = parent || getModuleParent(getModuleParent(module));
};

/** interface **/

/**
 * enabled rewiremock
 */
mockModule.enable = function () {
    scope();
    Module.overloadRequire();
    wipeCache();
    onEnable(getAllMocks());
    return mockModule;
};

/**
 * disabled rewiremock
 */
mockModule.disable = function () {
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
mockModule.proxy = function (file) {
    var overrides = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var result = 0;
    var stubs = typeof overrides === 'function' ? overrides(ModuleMock.inlineConstructor) : overrides;

    mockModule.inScope(function () {
        Object.keys(stubs).forEach(function (key) {
            return mockModule(key).from(stubs[key]);
        });

        mockModule.enable();
        if (typeof file === 'string') {
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
mockModule.module = function (importFunction) {
    var overrides = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var stubs = typeof overrides === 'function' ? overrides(ModuleMock.inlineConstructor) : overrides;

    return mockModule.around(importFunction, function () {
        return Object.keys(stubs).forEach(function (key) {
            return mockModule(key).from(stubs[key]);
        });
    });
};

/**
 * Creates temporary executing scope. All mocks and plugins you will add in callback will be removed at exit.
 * @param callback
 */
mockModule.inScope = function (callback) {
    var currentScope = mockScope;
    var error = void 0;
    updateScope(currentScope);
    try {
        callback();
    } catch (e) {
        error = e;
    }

    mockScope = currentScope;
    if (error) throw error;
    return mockModule;
};

/**
 * executes module in sandbox
 * @param {Function} loader loader callback
 * @param {Function} [createCallback] - optional callback to be executed before load.
 * @return {Promise}
 */
mockModule.around = function (loader, createCallback) {
    return new Promise(function (resolve, reject) {
        var currentScope = mockScope;
        updateScope(currentScope);

        var restore = function restore() {
            mockModule.disable();
            mockScope = currentScope;
        };

        Promise.resolve(createCallback && createCallback(mockModule)).then(function () {
            return mockModule.enable();
        }).then(function () {
            return Module.probeAsyncModules();
        }).then(function () {
            return Promise.resolve(loader()).then(function (mockedResult) {
                restore();
                resolve(mockedResult);
            }, function (err) {
                restore();
                reject(err);
            });
        });
    });
};

/**
 * flushes all active overrides
 */
mockModule.flush = function () {
    wipeCache(mockScope.mockedModules);
    mockScope.mockedModules = {};
};

/**
 * Low-level require
 * @param {String} fileName
 */
mockModule.requireActual = function (fileName) {
    return Module.require(Module.relativeFileName(fileName, parentModule), parentModule);
};

/**
 * Low-level import
 * @param {String} fileName
 */
mockModule.importActual = function (fileName) {
    return Promise.resolve(_this.requireActual(fileName));
};

/**
 * flushes anything
 */
mockModule.clear = function () {
    updateScope();
    scope();
    mockModule.withoutIsolation();
    mockModule.flush();
};

var cleanup = function cleanup() {
    delete require.cache[require.resolve(__filename)];
};

var addPlugin = function addPlugin(plugin) {
    scope();
    addPluginAPI(plugin);
};

var removePlugin = function removePlugin(plugin) {
    scope();
    removePluginAPI(plugin);
};

mockModule.addPlugin = function (plugin) {
    addPlugin(plugin);
    return mockModule;
};

export { mockModule, addPlugin, removePlugin, cleanup };