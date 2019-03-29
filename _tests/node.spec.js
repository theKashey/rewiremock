import rewiremock from "../node";
import {expect} from 'chai';

describe('nodejs API', () => {

  // https://github.com/theKashey/rewiremock/issues/74
  it('should partially mock due to callThrough proxy:', () => {
    const mocked = rewiremock.proxy('./lib/d',
      (r) => ({
        './lib/d/a.js': r.callThrough().with({a: {toString: () => 'mocked'}}).toBeUsed()
      })
    );
    expect(mocked()).to.be.equal('mocked|notmocked-b');
  });

  // https://github.com/theKashey/rewiremock/issues/74
  it('should partially mock class instance using callThrough proxy:', () => {
    const mocked = rewiremock.proxy('./lib/d/class',
      (r) => ({
        './lib/d/a-class.js': r.callThrough().with({a: () => 'mocked'}).toBeUsed()
      })
    );
    expect(mocked()).to.be.equal('mocked|notmocked-b');
  });
});