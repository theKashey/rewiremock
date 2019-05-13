import rewiremock, {addPlugin, plugins} from '../../../lib/index';

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
});