var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

import { relative } from 'path';
import Module, { originalLoader } from './module';
import { shouldMock } from './plugins';
import { getMock } from './mocks';
import getScope from './globals';
import { moduleCompare, pickModuleName, getModuleName, getModuleParent } from './module';
import asyncModules from './asyncModules';
import ModuleLoader from './getModule';

var thisModule = module;

var patternMatch = function patternMatch(fileName) {
  return function (pattern) {
    if (typeof pattern == 'function') {
      return pattern(fileName);
    }
    return fileName.match(pattern);
  };
};

export var requireModule = function requireModule(name, parentModule) {
  if (typeof __webpack_require__ !== 'undefined') {
    return __webpack_require__(name);
  } else {
    //return Module._load(name);
    return parentModule ? ModuleLoader._load(name, parentModule) : require(name);
  }
};

var testPassby = function testPassby(request, module) {
  var _getScope = getScope(),
      parentModule = _getScope.parentModule,
      passBy = _getScope.passBy,
      mockedModules = _getScope.mockedModules,
      isolation = _getScope.isolation;

  // was called from test


  if (moduleCompare(module, parentModule)) {
    //if (module === parentModule || module == module.parent) {
    return true;
  }
  // if parent is in the pass list - pass everything
  var fileName = Module._resolveFilename(request, module);
  var m = module;

  var test = function test(fileName) {
    return !isolation.noAutoPassBy && mockedModules[fileName] || // parent was mocked
    passBy.filter(patternMatch(fileName)).length // parent is in pass list
    ;
  };

  while (m) {
    if (test(fileName)) {
      return true;
    }
    fileName = getModuleName(m);
    m = getModuleParent(m);
  }
  return test(fileName);
};

function mockResult(name, data) {
  if (data && !data.default) {
    data.default = data;
  }
  return data;
}

function monkeyPatchPath(addr) {
  var path = addr.split('/');
  if (path[0] == '..') {
    path[0] = '.';
    return path.join('/');
  }
  return addr;
}

function asyncTest() {
  var asyncModulesLeft = asyncModules.hasAsyncModules();
  if (asyncModulesLeft) {
    console.error('Rewiremock: listed async modules should finish loading first. Use async API of rewiremock.', asyncModulesLeft.map(function (module) {
      return module.creator.toString();
    }));
    throw new Error('Rewiremock: listed async modules should finish loading first. Use async API of rewiremock.');
  }
}

function mockLoader(request, parent, isMain) {
  var _getScope2 = getScope(),
      parentModule = _getScope2.parentModule,
      mockedModules = _getScope2.mockedModules,
      isolation = _getScope2.isolation;

  asyncTest();

  var baseRequest = Module._resolveFilename(request, parent);
  var shortRequest = monkeyPatchPath(relative(getModuleName(parent), request));

  if (moduleCompare(parent, parentModule) || moduleCompare(parent, thisModule)) {
    delete Module._cache[baseRequest];
    mockedModules[baseRequest] = true;
  }

  var mock = getMock(baseRequest) || getMock(request) || getMock(shortRequest);

  if (mock) {
    if (shouldMock(mock, request, parent, parentModule)) {
      // this file fill be not cached, but it`s opener - will. And we have to remember it
      mockedModules[getModuleName(parent)] = true;
      mock.usedAs = mock.usedAs || [];
      mock.usedAs.push(baseRequest);

      mockedModules[baseRequest] = true;

      if (mock.allowCallThrough) {
        if (!mock.original) {
          mock.original = originalLoader(request, parent, isMain);
        }
      }

      if (mock.overrideBy) {
        if (!mock.override) {
          if (typeof mock.overrideBy === 'string') {
            mock.override = originalLoader(pickModuleName(mock.overrideBy, parent), parent, isMain);
          } else {
            mock.override = mock.overrideBy({
              name: request,
              fullName: baseRequest,
              parent: parent,
              original: mock.original,
              requireActual: function requireActual(name) {
                return originalLoader(pickModuleName(name, parent), parent, isMain);
              }
            });
          }
        }
        return mockResult(request, mock.override);
      }

      if (mock.allowCallThrough) {
        if (typeof mock.original === 'function') {
          if (_typeof(mock.value) === 'object' && Object.keys(mock.value).length === 0) {
            return mockResult(request, mock.original);
          } else {
            throw new Error('rewiremock: trying to merge Functional base with callThrough mock at ' + request + '. Use overrideBy instead.');
          }
        }
        return mockResult(request, Object.assign({}, mock.original, mock.value, { __esModule: mock.original.__esModule }));
      }
      return mockResult(request, mock.value);
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