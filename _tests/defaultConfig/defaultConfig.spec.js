import {expect} from 'chai';
import path from 'path';
import rewiremock from '../../src/index';
import defaultConfig from '../../src/plugins/defaultConfig';

describe('defaultConfig', () => {

  it('unmocked test', () => {
    rewiremock.enable();
    const mocked = require('./foo');
    expect(mocked).to.be.equal('not mocked');
    rewiremock.disable();
  });

  it('mocked test', () => {
    defaultConfig(rewiremock, path.dirname(module.i || __filename));
    rewiremock.enable();
    const mocked = require('./foo');
    rewiremock.disable();
    expect(mocked).to.be.equal('mocked');

  });
});