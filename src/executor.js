import {relative} from 'path'
import Module, {originalLoader} from './module';
import {shouldMock} from './plugins';
import {getMock} from './mocks';
import getScope, {collectScopeVariable, getScopeVariable} from './globals';
import {moduleCompare, pickModuleName, getModuleName, getModuleParent} from './module';
import asyncModules from './asyncModules';
import ModuleLoader from './getModule';
import matchOriginFabric from 'compare-module-exports';

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
    (!isolation.noAutoPassBy && mockedModules[fileName]) ||  // parent was mocked
    passBy.filter(patternMatch(fileName)).length             // parent is in pass list
  );

  while (m) {
    if (test(fileName)) {
      return true;
    }
    fileName = getModuleName(m);
    m = getModuleParent(m);
  }
  return test(fileName);
};


function mockResult(name, mock, data) {
  if (mock.matchOrigin) {
    const matchResult = matchOrigin(mock.original, data, name, '%mock%', {noFunctionCompare: true})
    if (matchResult) {
      matchResult.forEach(line => console.error(line));
      throw new Error('Rewiremock: provided mocks does not match ' + name);
    }
  }
  if (data && !data.default) {
    data.default = data;
  }
  return data;
}

function monkeyPatchPath(addr) {
  const path = addr.split('/');
  if (path[0] == '..') {
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
      asyncModulesLeft.map(module => module.creator.toString())
    );
    /* eslint-enable */
    throw new Error('Rewiremock: listed async modules should finish loading first. Use async API of rewiremock.')
  }
}

function mockLoader(request, parent, isMain) {
  const {
    parentModule,
    mockedModules,
    isolation
  } = getScope();

  asyncTest();

  const baseRequest = Module._resolveFilename(request, parent);
  const shortRequest = monkeyPatchPath(relative(getModuleName(parent), request));

  if (moduleCompare(parent, parentModule) || moduleCompare(parent, thisModule)) {
    delete Module._cache[baseRequest];
    mockedModules[baseRequest] = true;
  }

  const mock = getMock(baseRequest) || getMock(request) || getMock(shortRequest);

  if (mock) {
    if (shouldMock(mock, request, parent, parentModule)) {
      // this file fill be not cached, but it`s opener - will. And we have to remember it
      mockedModules[getModuleName(parent)] = true;
      mock.usedAs = (mock.usedAs || []);
      mock.usedAs.push(baseRequest);

      mockedModules[baseRequest] = true;

      if (mock.allowCallThrough || mock.matchOrigin) {
        if (!mock.original) {
          mock.original = originalLoader(request, parent, isMain);
        }
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
        return mockResult(request, mock, mock.override);
      }

      if (mock.allowCallThrough) {
        if (typeof(mock.original) === 'function') {
          if (
            typeof mock.value === 'object' &&
            Object.keys(mock.value).length === 0
          ) {
            return mockResult(request, mock, mock.original);
          } else {
            throw new Error('rewiremock: trying to merge Functional base with callThrough mock at '
              + request + '. Use overrideBy instead.');
          }
        }
        return mockResult(request, mock, Object.assign({},
          mock.original,
          mock.value,
          {__esModule: mock.original.__esModule}
        ));
      }
      return mockResult(request, mock, mock.value);
    } else {
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