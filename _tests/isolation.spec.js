import {expect} from 'chai';

import rewiremock, {addPlugin} from '../src/index';
import {_clearPlugins} from '../src/plugins';

import nodePlugin from '../src/plugins/nodejs';

describe('isolation ', () => {
  it('should trigger error: ', () => {
    addPlugin(nodePlugin);
    rewiremock.enable();
    rewiremock.isolation();

    expect(() => require('./lib/a/test.js')).to.throw();

    rewiremock.disable();
    rewiremock.clear();
    _clearPlugins();
  });

  it('work in isolation: ', () => {
    addPlugin(nodePlugin);
    rewiremock.passBy(/node_modules/);
    rewiremock('./lib/a/foo')
      .with(() => 'aa');

    rewiremock('./lib/a/../b/bar')
      .with(() => 'bb');

    rewiremock('./lib/a/../b/baz')
      .with(() => 'cc');

    rewiremock.enable();
    rewiremock.isolation();

    const mockedBaz = require('./lib/a/test.js');
    expect(mockedBaz()).to.be.equal('aabbcc');
    rewiremock.disable();
    rewiremock.clear();
    _clearPlugins();
  });

  it('should passby modules: ', () => {
    addPlugin(nodePlugin);
    rewiremock.passBy(/node_modules/);
    rewiremock('./lib/a/foo')
      .with(() => 'aa');

    rewiremock.passBy(module => module.indexOf('b/bar') >= 0);
    rewiremock.passBy(/b\/baz/);

    rewiremock.enable();
    rewiremock.isolation();

    const mockedBaz = require('./lib/a/test.js');
    expect(mockedBaz()).to.be.equal('aabarbaz');
    rewiremock.disable();
    rewiremock.clear();
    _clearPlugins();
  });

  it('should nest passby: ', () => {
    addPlugin(nodePlugin);
    rewiremock.passBy(/node_modules/);
    rewiremock('./lib/a/foo')
      .with(() => 'aa');

    rewiremock.passBy(/test.js/);

    rewiremock.enable();
    rewiremock.isolation();

    const mockedBaz = require('./lib/a/test.js');
    expect(mockedBaz()).to.be.equal('aabarbaz');
    rewiremock.disable();
    rewiremock.clear();
    _clearPlugins();
  });

  it('should nest mocked module: ', () => {
    addPlugin(nodePlugin);
    rewiremock.passBy(/node_modules/);
    rewiremock('./lib/c/bar')
      .callThrough();

    rewiremock.enable();
    rewiremock.isolation();

    const mockedBaz = require('./lib/c/foo.js');
    expect(mockedBaz()).to.be.equal('>+!');
    rewiremock.disable();
    rewiremock.clear();
    _clearPlugins();
  });

  it('should nest mocked module with options: ', () => {
    addPlugin(nodePlugin);
    rewiremock.passBy(/node_modules/);
    rewiremock('./lib/c/bar')
      .callThrough();

    rewiremock.enable();
    rewiremock.isolation({
      noAutoPassBy: true
    });

    expect(() => require('./lib/c/foo.js')).to.throw();

    rewiremock.disable();
    rewiremock.clear();
    _clearPlugins();
  });

  it('auto passby ', () => {
    addPlugin(nodePlugin);
    rewiremock.passBy(/node_modules/);
    rewiremock.passBy('./lib/c/bar');

    rewiremock.enable();
    rewiremock.isolation();

    require('./lib/c/foo.js');

    rewiremock.disable();
    rewiremock.clear();
    _clearPlugins();
  });

  it('auto passby noParent', () => {
    addPlugin(nodePlugin);
    rewiremock.passBy(/node_modules/);
    rewiremock.passBy('./lib/c/bar');

    rewiremock.enable();
    rewiremock.isolation({
      noParentPassBy: true
    });

    expect(() => require('./lib/c/foo.js')).to.throw();

    rewiremock.disable();
    rewiremock.clear();
    _clearPlugins();
  });
});
