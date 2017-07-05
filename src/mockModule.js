import Module from 'module';
import wipeCache from './wipeCache';
import createScope from './scope';
import getScope, {setScope} from './globals';
import executor, {originalLoader} from './executor';
import {convertName, addPlugin} from './plugins';
import {resetMock, getMock} from './mocks';
import ModuleMock from './mock';

let parentModule = module.parent;
let mockScope = null;
const updateScope = (parentScope = null) => { mockScope = createScope(parentScope, parentModule); };
const scope = () => setScope(mockScope);

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
    return new ModuleMock(getMock(name));
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

/** bulk **/
mockModule.require = (file, mocks, callback) => {

};

/** flags **/

/**
 * Activates module isolation
 */
mockModule.isolation = () => {
    mockScope.isolation = true;
};

/**
 * Deactivates isolation
 */
mockModule.withoutIsolation = () => {
    mockScope.isolation = false;
};

/**
 * Adding new passby record
 * @param {String|RegEx|Function} pattern
 */
mockModule.passBy = (pattern) => {
    mockScope.passBy.push(pattern);
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
    console.log('enable');
    Module._load = executor;
    wipeCache();
};

/**
 * disabled rewiremock
 */
mockModule.disable = () => {
    scope();
    Module._load = originalLoader;
    mockModule.withoutIsolation();
    mockModule.flush();
};

mockModule.inScope = () => {
    const promise = new Promise((resolve) => {
        const scope = createScope(getScope(), parentModule);
        setScope(scope);
        promise.then(() => {
            setScope(scope.parentScope);
        });
        resolve();
    });
    return promise;
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

export {
    mockModule,
    addPlugin,
    cleanup
};
