import Module from 'module';
import {shouldMock} from './plugins';
import {getMock} from './mocks';
import getScope from './globals';

export const originalLoader = Module._load;

const patternMatch = fileName => pattern => {
    if (typeof pattern == 'function') {
        return pattern(fileName)
    }
    return fileName.match(pattern);
};

const testPassby = (request, module) => {
    const {parentModule, passBy} = getScope();
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


function mockResult(name, data) {
    console.log('mocking',name,'with',data);
    return data;
}

function mockLoader(request, parent, isMain) {
    const {
        parentModule,

        mockedModules
    } = getScope();

    const baseRequest = Module._resolveFilename(request, parent);

    if (parent === parentModule) {
        delete Module._cache[baseRequest];
        mockedModules[baseRequest] = true;
    }

    const mock = getMock(baseRequest) || getMock(request);

    if (mock) {
        if(shouldMock(mock, request, parent, parentModule)) {
            // this file fill be not cached, but it`s opener - will. And we have to remeber it
            mockedModules[parent.filename] = true;

            mockedModules[baseRequest] = true;

            if (mock.overrideBy) {
                if (!mock.module) {
                    mock.module = originalLoader(mock.overrideBy, parent, isMain)
                }
                return mockResult(request, mock.module);
            }

            if (mock.allowCallThought) {
                if (!mock.module) {
                    mock.module = originalLoader(request, parent, isMain);
                }
                return mockResult(request, {
                    ...mock.module,
                    ...mock.value,
                    __esModule: mock.module.__esModule
                });
            }
            return mockResult(request, mock.value);
        }else{
            console.log('mock', request,'is not mocked')
        }
    }

    if (getScope().isolation && !mockedModules[baseRequest]) {
        if (!testPassby(request, parent)) {
            throw new Error('mockModule: ' + request + ' in not listed as passby modules');
        }
    }

    return originalLoader(request, parent, isMain);
}

export default mockLoader;