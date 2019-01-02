import {relative} from 'path'
import Module, {originalLoader} from './module';
import {autoMock, shouldMock} from './plugins';
import {getMock} from './mocks';
import getScope, {collectScopeVariable, getScopeOption, getScopeVariable} from './globals';
import {moduleCompare, pickModuleName, getModuleName, getModuleParent} from './module';
import asyncModules from './asyncModules';
import ModuleLoader from './getModule';
import matchOriginFabric from 'compare-module-exports';
import {NO} from "./plugins/_common";

const matchOrigin = matchOriginFabric('rewiremock');
const thisModule = module;

const patternMatch = fileName => pattern => {
  if (typeof pattern == 'function') {
    return pattern(fileName)
  }
  return fileName.match(pattern);
};

export const requireModule = (name, parentModule) => {
  if (typeof __webpack_require__ !== 'undefined') {
    return __webpack_require__(name);
  } else {
    //return Module._load(name);
    return parentModule
      ? ModuleLoader._load(name, parentModule)
      : require(name);
  }
};

const testPassby = (request, module) => {
  const {
    parentModule,
    mockedModules,
  } = getScope();

  const passBy = collectScopeVariable('passBy');
  const isolation = getScopeVariable('isolation');

  // was called from test
  if (moduleCompare(module, parentModule)) {
    //if (module === parentModule || module == module.parent) {
    return true;
  }
  // if parent is in the pass list - pass everything
  let fileName = Module._resolveFilename(request, module);
  let m = module;

  const test = (fileName) => (
    // parent was mocked
    (!isolation.noAutoPassBy && mockedModules[fileName]) ||
    // parent is in pass list
    passBy.filter(patternMatch(fileName)).length
  );

  if (!isolation.noParentPassBy) {
    while (m && !moduleCompare(m, parentModule)) {
      if (test(fileName)) {
        return true;
      }
      fileName = getModuleName(m);
      m = getModuleParent(m);
    }
  }
  return test(fileName);
};


function mockResult(name, mock, dataFactory) {
  const factory = () => {
    const data = dataFactory();
    if (mock.matchOrigin) {
      const matchResult = matchOrigin(mock.original, data, name, '%mock%', {noFunctionCompare: true})
      if (matchResult) {
        // eslint-disable-next-line no-console
        matchResult.forEach(line => console.error(line));
        throw new Error('Rewiremock: provided mocks does not match ' + name);
      }
    }
    if (data && !data.default) {
      if (['object', 'function'].indexOf(typeof data) >= 0) {
        Object.defineProperty(data, 'default', {
          enumerable: false,
          value: data
        })
      }
    }
    return data;
  };

  if (mock.flag_dynamic) {
    const origin = factory();
    if (['object', 'function'].indexOf(typeof origin) >= 0) {
      return new Proxy(origin, {
        get(target, prop) {
          return factory()[prop]
        }
      })
    }
  }
  return factory();
}

function standardStubFactory(name, object, deeperMock) {
  if (typeof object === 'function') {
    return () => {
    }
  }
  if (typeof object === 'object') {
    return deeperMock(deeperMock);
  }
  return object;
}

function mockThought(stubFactory, mockOriginal, name = '') {
  if (typeof mockOriginal === 'function') {
    return stubFactory(name || 'default', mockOriginal)
  }
  if (typeof mockOriginal === 'object') {
    const deeperMock = (key, value) => mockThought(stubFactory, value, name ? `${name}.${key}` : key);
    if (Array.isArray(mockOriginal)) {
      return mockOriginal.map((x, i) => deeperMock(i, x))
    } else {
      return Object.keys(mockOriginal)
        .map(key => ({key, value: deeperMock(key, mockOriginal[key])}))
        .reduce((acc, x) => (Object.assign(acc, {[x.key]: x.value})), {})
    }
  }
  return mockOriginal;
}

function monkeyPatchPath(addr) {
  const path = addr.split('/');
  if (path[0] === '..') {
    path[0] = '.';
    return path.join('/');
  }
  return addr;
}

function asyncTest() {
  const asyncModulesLeft = asyncModules.hasAsyncModules();
  if (asyncModulesLeft) {
    /* eslint-disable no-console */
    console.error(
      'Rewiremock: listed async modules should finish loading first. Use async API of rewiremock.',
      asyncModulesLeft.map(module => module.creator)
    );
    /* eslint-enable */
    throw new Error('Rewiremock: listed async modules should finish loading first. Use async API of rewiremock.')
  }
}

function tryOr(fn, failBack) {
  try {
    return fn();
  } catch (e) {
    // probably file not found
  }
  return failBack;
}

function mockLoader(request, parent, isMain) {
  const {
    parentModule,
    mockedModules,
    isolation
  } = getScope();

  asyncTest();

  const baseRequest = tryOr(() => Module._resolveFilename(request, parent), request);
  const shortRequest = monkeyPatchPath(relative(getModuleName(parent), request));

  if (moduleCompare(parent, parentModule) || moduleCompare(parent, thisModule)) {
    delete Module._cache[baseRequest];
    mockedModules[baseRequest] = true;
  }

  const mock = getMock(baseRequest) || getMock(request) || getMock(shortRequest) || autoMock(baseRequest);

  if (mock) {
    mock.wasRequired = true;
    const shouldResult = {};
    if (mock.alwaysMock || shouldMock(mock, request, parent, parentModule, shouldResult)) {
      // this file fill be not cached, but it`s opener - will. And we have to remember it
      mockedModules[getModuleName(parent)] = true;
      mock.usedAs = (mock.usedAs || []);
      mock.usedAs.push(baseRequest);

      mockedModules[baseRequest] = true;

      if (mock.allowCallThrough || mock.matchOrigin || mock.mockThrough) {
        if (!mock.original) {
          mock.original = originalLoader(request, parent, isMain);
        }
      }

      if (mock.mockThrough) {
        const factory = mock.mockThrough === true ? getScopeOption('stubFactory') : mock.mockThrough;
        mock.override = mockThought(factory || standardStubFactory, mock.original);
        return mockResult(request, mock, () => Object.assign({},
          mock.override,
          mock.value,
          {__esModule: mock.original.__esModule}
        ));
      }

      if (mock.overrideBy) {
        if (!mock.override) {
          if (typeof mock.overrideBy === 'string') {
            mock.override = originalLoader(pickModuleName(mock.overrideBy, parent), parent, isMain)
          } else {
            mock.override = mock.overrideBy({
              name: request,
              fullName: baseRequest,
              parent: parent,
              original: mock.original,
              requireActual: (name) => originalLoader(pickModuleName(name, parent), parent, isMain)
            });
          }
        }
        return mockResult(request, mock, () => mock.override);
      }

      if (mock.allowCallThrough) {
        if (typeof(mock.original) === 'function') {
          if (
            typeof mock.value === 'object' &&
            Object.keys(mock.value).length === 0
          ) {
            return mockResult(request, mock, () => mock.original);
          } else {
            throw new Error('rewiremock: trying to merge Functional base with callThrough mock at '
              + request + '. Use overrideBy instead.');
          }
        }
        return mockResult(request, mock, () => Object.assign({},
          mock.original,
          mock.value,
          {__esModule: mock.original.__esModule}
        ));
      }

      return mockResult(request, mock, () => mock.value);
    } else {
      mock.rejected = mock.rejected || [];
      if (shouldResult.plugins) {
        mock.rejected.push({
          parent,
          plugins:
            shouldResult
              .plugins
              .filter((p, index) => shouldResult.values[index] === NO)
              .map(p => p.name)
        });
      }
      // why you shouldn't?
    }
  }

  if (isolation && !mockedModules[baseRequest]) {
    if (!testPassby(request, parent)) {
      throw new Error('rewiremock: isolation breach by [' + request + ']. Requested from ', getModuleName(parent));
    }
  }

  return originalLoader(request, parent, isMain);
}

export default mockLoader;