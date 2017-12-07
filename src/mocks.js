import {join} from 'path';
import parse from 'path-parse';
import getScope from './globals';
import {extensions} from './_common';
import {getModuleName} from "./module";

const genMock = (name) => {
  return {
    name,
    value: {}
  };
};

const insertMock = (name, mock) => getScope().mocks[name] = mock;
const resetMock = (name) => insertMock(name, genMock(name));

const pickFrom = (mocks, name) => {
  const ext = extensions.find(ext => mocks[name + ext]);
  if (ext !== undefined) {
    return mocks[name + ext]
  }
};

const getMock = (name, scope = getScope()) => {
  const {mocks} = scope;
  const fn = parse(name);
  const shortName = join(fn.dir, fn.name);
  const wshortName = fn.dir + '/' + fn.name;
  const indexName = fn.name === 'index' ? fn.dir : null;

  const mock =
    pickFrom(mocks, name) || (indexName && pickFrom(mocks, indexName)) ||
    pickFrom(mocks, shortName) || pickFrom(mocks, wshortName);


  if (!mock && scope.parentScope) {
    return getMock(name, scope.parentScope);
  }
  return mock;
};

export const getAsyncModuleName = (creator, parent) => {
  return creator.toString() + ':' + getModuleName(parent);
};

const getAsyncMock = (creator, parent, scope = getScope()) => {
  const signature = getAsyncModuleName(creator, parent);
  const mock = resetMock(signature);
  scope.asyncMocks.push({
    mock,
    creator,
    loaded: false
  });
  return mock;
};

const collectMocks = (result, selector) => {
  const collect = (scope) => {
    if (scope.parentScope) {
      collect(scope.parentScope);
    }
    const mocks = selector(scope);
    Object.keys(mocks).forEach(key => result[key] = mocks[key]);
  };
  collect(getScope());
  return result;
};

const getAllMocks = () => {
  return collectMocks({}, scope => scope.mocks);
};

const getAllAsyncMocks = () => {
  return collectMocks([], scope => scope.asyncMocks.filter(mock => !mock.loaded)).filter(mock => !!mock);
};

export {
  insertMock,
  getMock,
  getAsyncMock,
  getAllAsyncMocks,
  getAllMocks,
  resetMock
}