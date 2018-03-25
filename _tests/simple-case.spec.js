import {expect} from 'chai';

import rewiremock from '../src/index';

describe('simples case ', () => {
  it('scope test: ', () => {
    rewiremock('path')
      .with({
        readFileSync: () => "mocked"
      });

    rewiremock.enable();
    const mocked = require('./lib/use-node_module.js');

    expect(mocked.test()).to.be.equal('mocked');
    rewiremock.disable();
  });
});