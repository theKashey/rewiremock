import rewiremock, {addPlugin, plugins} from '../../../lib/index';

import {expect} from 'chai';

// https://github.com/theKashey/rewiremock/issues/80

addPlugin(plugins.usedByDefault);

describe('Issue #80', () => {
  it('mock B', () => {
    const subject = rewiremock.proxy(
      () => require('./B'),
      () => {
        rewiremock(() => require('./C')).with('baz');
      }
    );
    expect(subject.default).to.be.equal('baz');
  });
});
