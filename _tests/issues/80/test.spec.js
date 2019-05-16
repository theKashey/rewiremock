import rewiremock, {addPlugin, plugins} from '../../../src/index';

import {expect} from 'chai';

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
    expect(subject.default).to.be.equal('bar')
  });

  it.skip('mock C', () => {
    const subject = rewiremock.proxy(
      () => require('./A'),
      () => {
        rewiremock(() => require('./C'))
          .with('bar')
      }
    );
    expect(subject.default).to.be.equal('bar')
  });

  it('mock B', () => {
    const subject = rewiremock.proxy(
      () => require('./B'),
      () => {
        rewiremock(() => require('./C'))
          .withDefault('baz')
      }
    );
    expect(subject.default).to.be.equal('baz')
  });
});