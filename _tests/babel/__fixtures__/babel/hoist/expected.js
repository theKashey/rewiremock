'use strict';

(function rwrmck() {
  if (!global["_REWIREMOCK_HOISTED_"] || global["_REWIREMOCK_HOISTED_"].rewiredFor && global["_REWIREMOCK_HOISTED_"].rewiredFor !== module.id) {
    global["_REWIREMOCK_HOISTED_"] = [];
  }

  global["_REWIREMOCK_HOISTED_"].push(function (rewiremock) {
    rewiremock.enable();


    rewiremock('common/Component1').by('common/Component2');
    rewiremock('common/Component2/action').with({
      action: () => {}
    });
    rewiremock('common/selectors').mockThrough(() => _sinon2.default.stub());
  });
})('rwrmck');

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _rewiremock = require('rewiremock');

var _rewiremock2 = _interopRequireDefault(_rewiremock);

var _Component = require('common/Component1');

var _Component2 = _interopRequireDefault(_Component);

var _selectors = require('common/selectors');

var _selectors2 = _interopRequireDefault(_selectors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_rewiremock2.default.disable();

global["_REWIREMOCK_HOISTED_"] = [];
const b = 1;
let a = b;