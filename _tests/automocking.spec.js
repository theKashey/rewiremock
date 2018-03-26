import {expect} from 'chai';
import rewiremock,{ removePlugin, addPlugin, plugins} from '../src/index';

describe('__mock__', () => {
  it('real test', () => {
    const mocked = require('./lib/mocks/foo');
    expect(mocked.default).to.be.equal('REAL');
  });

  it('generic test', () => {
    rewiremock.enable();
    removePlugin(plugins.__mock__);
    const mocked = require('./lib/mocks/foo');
    expect(mocked.default).to.be.equal('REAL');
    rewiremock.disable();
  });

  it('generic test', () => {
    rewiremock.enable();
    addPlugin(plugins.__mock__);
    const mocked = require('./lib/mocks/foo');
    expect(mocked.default).to.be.equal('MOCKED');
    rewiremock.disable();
  });
});