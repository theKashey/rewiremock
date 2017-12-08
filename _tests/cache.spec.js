import {expect} from 'chai';
import path from 'path'
import rewiremock from '../src/index';
import { wipe } from '../src/wipeCache';

describe('cache', () => {

  const resetCache = () => {
    const wipeAll = (stubs, moduleName) => moduleName.indexOf(stubs) === 0;
    wipe(path.dirname(__filename), wipeAll);
  };

  it('should clear mocked modules cache', () => {
    rewiremock.inScope(() => {
      resetCache();
      var a1 = require('./lib/cache/a').functionA;
      rewiremock.forceCacheClear('nocache');
      var i0 = rewiremock.proxy('./lib/cache', {
        './a': {
          functionA: () => {
          }
        },
      }).default;
      var a2 = require('./lib/cache/a').functionA;
      var b2 = require('./lib/cache/b').functionB;
      expect(String(a1)).to.be.equal(String(a2));
      expect(a1).not.to.be.equal(a2);
      expect(i0.a).not.to.be.equal(a1);
      expect(i0.a).not.to.be.equal(a2);
      expect(i0.b).to.be.equal(b2);
    });
  });

  it('should disrespect all the cache', () => {
    rewiremock.inScope(() => {
      resetCache();
      var a1 = require('./lib/cache/a').functionA;
      rewiremock.forceCacheClear();
      var i0 = rewiremock.proxy('./lib/cache', {
        './a': {
          functionA: () => {
          }
        },
      }).default;
      var a2 = require('./lib/cache/a').functionA;
      var b2 = require('./lib/cache/b').functionB;
      expect(a1).to.be.deep.equal(a2);
      expect(a1).to.be.equal(a2);
      expect(i0.a).not.to.be.equal(a1);
      expect(i0.a).not.to.be.equal(a2);
      expect(i0.b).not.to.be.equal(b2);
    });
  });

  it('should respect cache', () => {
    rewiremock.inScope(() => {
      resetCache();
      var a1 = require('./lib/cache/a').functionA;
      var i0 = rewiremock.proxy('./lib/cache', {
        './a': {
          functionA: () => {
          }
        },
      }).default;
      var a2 = require('./lib/cache/a').functionA;
      var b2 = require('./lib/cache/b').functionB;
      expect(a1).to.be.deep.equal(a2);
      expect(a1).to.be.equal(a2);
      expect(i0.a).not.to.be.equal(a1);
      expect(i0.a).not.to.be.equal(a2);
      expect(i0.b).to.be.equal(b2);
    });
  })
});