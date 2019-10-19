import {expect} from 'chai';
import path from 'path'

import Module from '../src/module';
import rewiremock from '../src/index';
import {wipe} from '../src/wipeCache';

describe('cache', () => {

  const resetCache = () => {
    const wipeAll = (stubs, moduleName) => moduleName.indexOf(stubs) === 0;
    wipe(path.dirname(__filename), wipeAll);
  };

  it('should handle cache properly', () => {
    const test1 = rewiremock.proxy('./lib/cache/requireA', r => {
      rewiremock(() => require('./lib/cache/a')).with(42).toBeUsed();
    });
    expect(test1.b).to.be.equal(42);

    const fileA = Module._resolveFilename('./lib/cache/a', module);
    expect(require.cache[fileA]).to.be.equal(undefined);

    let test2;

    expect(() => {
      test2 = rewiremock.proxy('./lib/cache/requireA', r => {
        rewiremock(() => require('./lib/cache/a')).with(42).toBeUsed();
      })
    }).not.to.throw();

    expect(require.cache[fileA]).to.be.equal(undefined);

    expect(test2.b).to.be.equal(42);
    expect(test1.a).not.to.be.equal(test2.a);
  });

  it('should restore cache properly', () => {
    const fileA = Module._resolveFilename('./lib/cache/a', module);

    const test0 = require('./lib/cache/requireA').a;

    const cache0 =require.cache[fileA];
    expect(cache0).not.to.be.equal(undefined);

    const test1 = rewiremock.proxy('./lib/cache/requireA', r => {
      rewiremock(() => require('./lib/cache/a')).with(42).toBeUsed();
    });
    expect(test1.a).not.to.be.equal(test0);
    expect(require.cache[fileA]).to.be.equal(cache0);

    const test2 = require('./lib/cache/requireA').a;

    expect(test2).to.be.equal(test0);
  });

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