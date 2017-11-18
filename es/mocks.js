import { join } from 'path';
import parse from 'path-parse';
import getScope from './globals';
import { extensions } from './_common';

var genMock = function genMock(name) {
  return {
    name: name,
    value: {}
  };
};

var insertMock = function insertMock(name, mock) {
  return getScope().mocks[name] = mock;
};
var resetMock = function resetMock(name) {
  return insertMock(name, genMock(name));
};

var pickFrom = function pickFrom(mocks, name) {
  var ext = extensions.find(function (ext) {
    return mocks[name + ext];
  });
  if (ext !== undefined) {
    return mocks[name + ext];
  }
};

var getMock = function getMock(name) {
  var scope = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : getScope();
  var mocks = scope.mocks;

  var fn = parse(name);
  var shortName = join(fn.dir, fn.name);
  var wshortName = fn.dir + '/' + fn.name;

  var mock = pickFrom(mocks, name) || pickFrom(mocks, shortName) || pickFrom(mocks, wshortName);

  if (!mock && scope.parentScope) {
    return getMock(name, scope.parentScope);
  }
  return mock;
};

var getAsyncMock = function getAsyncMock(creator) {
  var scope = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : getScope();

  var signature = creator.toString();
  var mock = resetMock(signature);
  scope.asyncMocks.push({
    mock: mock,
    creator: creator,
    loaded: false
  });
  return mock;
};

var collectMocks = function collectMocks(result, selector) {
  var collect = function collect(scope) {
    if (scope.parentScope) {
      collect(scope.parentScope);
    }
    var mocks = selector(scope);
    Object.keys(mocks).forEach(function (key) {
      return result[key] = mocks[key];
    });
  };
  collect(getScope());
  return result;
};

var getAllMocks = function getAllMocks() {
  return collectMocks({}, function (scope) {
    return scope.mocks;
  });
};

var getAllAsyncMocks = function getAllAsyncMocks() {
  return collectMocks([], function (scope) {
    return scope.asyncMocks.filter(function (mock) {
      return !mock.loaded;
    });
  }).filter(function (mock) {
    return !!mock;
  });
};

export { insertMock, getMock, getAsyncMock, getAllAsyncMocks, getAllMocks, resetMock };