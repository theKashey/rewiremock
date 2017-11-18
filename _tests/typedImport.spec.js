// @flow

import { expect } from 'chai';
import rewiremock from '../src/index';

describe('typed import ', () => {
  it('should throw: ', () => {
    rewiremock.inScope(() => {
      rewiremock(() => import('./lib/typed/b.js')).with(() => 42);
      rewiremock.enable();
      try {
        require('./lib/typed/a.js');
        expect("should throw").to.be.false();
      } catch (e) {
        expect(true).to.be.equal(true);
      }
      rewiremock.disable();
    });
  });

  it('import as a mock name: ', () => {
    const unmockedBaz = require('./lib/typed/a.js');
    expect(unmockedBaz.default()).to.be.equal(10);

    const mockedBazLoad = rewiremock.around(
      () => import('./lib/typed/a.js'),
      mock => {
        mock(() => import('./lib/typed/b.js')).with(() => 42).toBeUsed();
      });

    return mockedBazLoad.then(mockedBaz => {
      expect(mockedBaz.default()).to.be.equal(42)
    })
  });

  describe('import delayed: ', () => {
    it('import after: ', () => {
      const mockedBazLoad = rewiremock.around(
        () => import('./lib/typed/a-delayed.js'),
        mock => {
          mock(() => import('./lib/typed/b.js')).with(() => 0);
        });

      return mockedBazLoad.then(mockedBaz => {
        expect(mockedBaz.default()).not.to.be.equal('aa')
      })
    });

    it('import before: ', () => {
      return rewiremock.around(
        () =>
          import('./lib/typed/a-delayed.js')
            .then(module => module) // emulate time tick
            .then(mockedBaz => {
              expect(mockedBaz.default()).to.be.equal(5)
            }),
        mock => {
          mock(() => import('./lib/typed/b.js')).with(() => 5);
        });
    });
  });
});
