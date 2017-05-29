import Module from 'module';
import {modifyMock, getMock, resetMock, resetMocks} from './mocks';
import {addPlugin, convertName, shouldMock} from './plugins';
import wipeCache from './wipeCache';

const originalLoader = Module._load;

let currentModule = 0;
let isolation = false;
let parentModule = module.parent;

let passBy = [];
let mockedModules = {};

const patternMatch = fileName => pattern => {
    if (typeof pattern == 'function') {
        return pattern(fileName)
    }
    return fileName.match(pattern);
};

const testPassby = (request, module) => {
    // was called from test
    if (module === parentModule || module == module.parent) {
        return true;
    }
    // if parent was in passlist - pass everythinh
    let fileName = Module._resolveFilename(request, module);
    let m = module;
    while (m) {
        if (passBy.filter(patternMatch(fileName)).length) {
            return true;
        }
        fileName = m.filename;
        m = m.parent;
    }
    return false;
};

function mockLoader(request, parent, isMain) {
    const baseRequest = Module._resolveFilename(request, parent);

    if (parent === parentModule) {
        delete Module._cache[baseRequest];
        mockedModules[baseRequest] = true;
    }

    const mock = getMock(baseRequest) || getMock(request);

    if (mock && shouldMock(mock, request, parent, parentModule)) {
        // this file fill be not cached, but it`s opener - will. And we have to remeber it
        mockedModules[parent.filename] = true;

        mockedModules[baseRequest] = true;

        if (mock.__MI_overrideBy) {
            if (!mock.__MI_module) {
                Object.defineProperty(mock, '__MI_module', {
                    value: originalLoader(mock.__MI_overrideBy, parent, isMain)
                });
            }
            return mock.__MI_module;
        }

        if (mock.__MI_allowCallThought) {
            if (!mock.__MI_module) {
                Object.defineProperty(mock, '__MI_module', {
                    value: originalLoader(request, parent, isMain)
                });
            }
            return {
                ...mock.__MI_module,
                ...mock,
                __esModule: mock.__MI_module.__esModule
            };
        }
        return mock;
    }

    if (isolation) {
        if (!testPassby(request, parent)) {
            throw new Error('mockModule: ' + request + ' in not listed as passby modules');
        }
    }

    return originalLoader(request, parent, isMain);
}

/** main **/

function mockModule(module) {
    currentModule = convertName(module, parentModule);
    resetMock(currentModule);
    return mockModule;
}

/** mocks **/
mockModule.callThought = () => {
    Object.defineProperty(getMock(currentModule), "__MI_allowCallThought", {
        value: true
    });
    return mockModule;
};

mockModule.es6 = () => {
    Object.defineProperty(getMock(currentModule), "__esModule", {
        value: true
    });
    return mockModule;
};

mockModule.withDefault = (stub) => {
    modifyMock(currentModule, {default: stub});
    return mockModule.es6();
};

mockModule.with = (stubs) => {
    modifyMock(currentModule, stubs);
    return mockModule;
};

mockModule.by = (name)=> {
    Object.defineProperty(getMock(currentModule), "__MI_overrideBy", {
        value: convertName(name, parentModule)
    });
    return mockModule;
};

/** flags **/

mockModule.isolation = () => {
    isolation = true;
};

mockModule.withoutIsolation = () => {
    isolation = false;
};

mockModule.passBy = (pattern) => {
    passBy.push(pattern);
};

const overrideEntryPoint = (parent) => {
    parentModule = parent || module.parent.parent;
};

/** interface **/
mockModule.enable = () => {
    Module._load = mockLoader;
    wipeCache();
};

mockModule.disable = () => {
    Module._load = originalLoader;
    mockModule.withoutIsolation();
    mockModule.flush();
};

mockModule.flush = () => {
    wipeCache(mockedModules);
    mockedModules = {};
};

mockModule.clear = () => {
    resetMocks();
    passBy = [];
    mockModule.withoutIsolation();
    mockModule.flush();
};

delete require.cache[require.resolve(__filename)];

export {
    mockModule,
    addPlugin,
    overrideEntryPoint
};
