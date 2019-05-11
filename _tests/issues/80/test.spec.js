import {expect} from 'chai';
import rewiremock, {addPlugin, plugins} from '../../../src/index';

// https://github.com/theKashey/rewiremock/issues/80

addPlugin(plugins.usedByDefault);

describe('Issue #80', () => {
  it('mock A', () => {
    const subject = rewiremock.proxy(
      () => require('./A'),
      () => {
        rewiremock(() => require('./B'))
          .with('bar')
      }
    );
    expect(subject).to.be.equal('bar')
  });

  it('mock B', () => {
    const subject = rewiremock.proxy(
      () => require('./B'),
      () => {
        rewiremock(() => require('./C'))
          .with('baz')
      }
    );
    expect(subject).to.be.equal('baz')
  });
});