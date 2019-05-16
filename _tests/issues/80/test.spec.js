import rewiremock, {addPlugin, plugins} from '../../../src/index';

import {expect} from 'chai';

// https://github.com/theKashey/rewiremock/issues/80

addPlugin(plugins.usedByDefault);

describe('Issue #80', () => {
  it('mock B', () => {
    const subject = rewiremock.proxy(
      () => require('./B'),
      () => {
        rewiremock(() => require('./C'))
          .withDefault('bazD')
      }
    );
    expect(subject.default).to.be.equal('bazD')
  });

  it('mock AA', () => {
    const subject = rewiremock.proxy(
      () => require('./A'),
      () => {
        rewiremock(() => require('./D'))
          .withDefault('bazD')
      }
    );
    expect(subject.default).to.be.equal('bazD')
  });

  it('mock A-C', () => {
    const subject = rewiremock.proxy(
      () => require('./A'),
      () => { rewiremock(() => require('./C')).withDefault('barr'); }
    );
    expect(subject.default).to.be.equal('barr')
  });

  it('mock AA', () => {
    const subject = rewiremock.proxy(
      () => require('./A'),
      () => {
        rewiremock(() => require('./D'))
          .withDefault('bazD')
      }
    );
    expect(subject.default).to.be.equal('bazD')
  });

  it('mock C', () => {
    const subject = rewiremock.proxy(
      () => require('./B'),
      () => {
        rewiremock(() => require('./C')).with('bar')
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

  it('mock B', () => {
    const subject = rewiremock.proxy(
      () => require('./B'),
      () => {
        rewiremock(() => require('./C'))
          .withDefault('baz1')
      }
    );
    expect(subject.default).to.be.equal('baz1')
  });

  it('mock B', () => {
    const subject = rewiremock.proxy(
      () => require('./B'),
      () => {
        rewiremock(() => require('./C'))
          .withDefault('baz2')
      }
    );
    expect(subject.default).to.be.equal('baz2')
  });
});