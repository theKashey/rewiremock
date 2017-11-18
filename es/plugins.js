function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import getScope from './globals';
import { YES, NO, PASS } from './plugins/_common';

var plugins = function plugins() {
  var result = [];
  var collect = function collect(scope) {
    result.push.apply(result, _toConsumableArray(scope.plugins));
    if (scope.parentScope) {
      collect(scope.parentScope);
    }
  };
  collect(getScope());
  return result;
};

var convertName = function convertName(fileName, parentModule) {
  var resultName = plugins().reduce(function (name, plugin) {
    if (plugin.fileNameTransformer) {
      return plugin.fileNameTransformer(name, parentModule) || name;
    }
    return name;
  }, fileName);

  if (typeof __webpack_modules__ !== 'undefined') {
    if (resultName[0] !== '.') {
      return '.' + resultName;
    }
  }
  return resultName;
};

var triResult = function triResult(values, defaultValue) {
  if (values.indexOf(NO) >= 0) {
    return false;
  }
  if (values.indexOf(YES) >= 0) {
    return true;
  }
  return defaultValue;
};

var shouldMock = function shouldMock(mock, request, parent, topModule) {
  return mock.disabled ? false : triResult(plugins().map(function (plugin) {
    return plugin.shouldMock ? plugin.shouldMock(mock, request, parent, topModule) : PASS;
  }), true);
};

var shouldWipe = function shouldWipe(stubs, moduleName) {
  return triResult(plugins().map(function (plugin) {
    return plugin.wipeCheck ? plugin.wipeCheck(stubs, moduleName) : PASS;
  }), false);
};

var onMockCreate = function onMockCreate(mock) {
  return plugins().reduce(function (mock, plugin) {
    if (plugin.onMockCreate) {
      return plugin.onMockCreate(mock) || mock;
    }
    return mock;
  }, mock);
};

var onDisable = function onDisable(mocks) {
  var plugs = plugins();
  Object.keys(mocks).forEach(function (mockName) {
    var mock = mocks[mockName];
    plugs.forEach(function (plugin) {
      return plugin.onDisable && plugin.onDisable(mock._parent);
    });
  });
};

var onEnable = function onEnable(mocks) {
  var plugs = plugins();
  Object.keys(mocks).forEach(function (mockName) {
    var mock = mocks[mockName];
    plugs.forEach(function (plugin) {
      return plugin.onEnable && plugin.onEnable(mock._parent);
    });
  });
};

var addPlugin = function addPlugin(plugin) {
  getScope().plugins.push(plugin);
};

var removePlugin = function removePlugin(plugin) {
  getScope().plugins = getScope().plugins.filter(function (plug) {
    return plug !== plugin;
  });
};

var _clearPlugins = function _clearPlugins() {
  getScope().plugins = [];
};

export { convertName, shouldWipe, shouldMock, onMockCreate, onDisable, onEnable, addPlugin, removePlugin, _clearPlugins };