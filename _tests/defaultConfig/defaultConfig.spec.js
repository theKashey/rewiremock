import {expect} from 'chai';
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
    defaultConfig(rewiremock, __dirname);
    rewiremock.enable();
    const mocked = require('./foo');
    expect(mocked).to.be.equal('mocked');
    rewiremock.disable();
  });
});