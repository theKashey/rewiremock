import {expect} from 'chai';

import rewiremock, {addPlugin} from '../src/index';
import {_clearPlugins} from '../src/plugins';

import nodePlugin from '../src/plugins/nodejs';

describe('scope ', () => {

    const webpackDefault = exports => {
      return typeof __webpack_require__ !== 'undefined' ? exports.default: exports;
    };

    it('scope test: ', () => {
        addPlugin(nodePlugin);
        const unmockedBaz = require('./lib/a/test.js');
        expect(unmockedBaz()).to.be.equal('foobarbaz');

        rewiremock('./lib/a/foo').with(() => 'aa');
        rewiremock.inScope(() => {
            rewiremock('./lib/a/../b/bar').with(() => 'bb');
            rewiremock.enable();
            const mocked = require('./lib/a/test.js');
            expect(mocked()).to.be.equal('aabbbaz');
            rewiremock.disable();
        });

        rewiremock.enable();
        const mocked = require('./lib/a/test.js');
        expect(mocked()).to.be.equal('aabarbaz');
        rewiremock.disable();
        rewiremock.clear();
        _clearPlugins();
    });

    it('scope load es5: ', () => {
        const unmockedBaz = require('./lib/a/test.js');
        expect(unmockedBaz()).to.be.equal('foobarbaz');

        return rewiremock.around(() => require('./lib/a/test.js'),
            (mock) => {
                addPlugin(nodePlugin);
                mock('./lib/a/foo').with(() => 'aa');
                mock('./lib/a/../b/bar').with(() => 'bb');
                mock('./lib/a/../b/baz').with(() => 'cc');
            })
            .then((mockedBaz) => {
                expect(mockedBaz()).to.be.equal('aabbcc');
            });
    });

    it('scope load es6: ', () => {
        const unmockedBaz = require('./lib/a/test.js');
        expect(unmockedBaz()).to.be.equal('foobarbaz');

        return rewiremock.around(() => import('./lib/a/test.js'),
            (mock) => {
                addPlugin(nodePlugin);

                mock('./lib/a/foo').with(() => 'aa');
                mock('./lib/a/../b/bar').with(() => 'bb');
                mock('./lib/a/../b/baz').with(() => 'cc');
            })
            .then((mockedBaz) => {
                expect(webpackDefault(mockedBaz)()).to.be.equal('aabbcc');
            });
    });

    it('scope load es6 with deferred create: ', () => {
        const unmockedBaz = require('./lib/a/test.js');
        expect(unmockedBaz()).to.be.equal('foobarbaz');

        return rewiremock.around(() => import('./lib/a/test.js'),
            (mock) =>
                Promise.resolve().then(() => {
                    addPlugin(nodePlugin);

                    mock('./lib/a/foo').with(() => 'aa');
                    mock('./lib/a/../b/bar').with(() => 'bb');
                    mock('./lib/a/../b/baz').with(() => 'cc');
                }))
            .then((mockedBaz) => {
                expect(webpackDefault(mockedBaz)()).to.be.equal('aabbcc');
            });
    });

    it('scope load es6 with internal test: ', () => {
        const unmockedBaz = require('./lib/a/test.js');
        expect(unmockedBaz()).to.be.equal('foobarbaz');

        return rewiremock.around(
            () =>
                import('./lib/a/test.js')
                    .then((mockedBaz) => {
                        expect(webpackDefault(mockedBaz)()).to.be.equal('aabbcc');
                    }),
            (mock) => {
                addPlugin(nodePlugin);

                mock('./lib/a/foo').with(() => 'aa');
                mock('./lib/a/../b/bar').with(() => 'bb');
                mock('./lib/a/../b/baz').with(() => 'cc');
            })
    });

    it('scope load es6 with one disabled: ', () => {
        const unmockedBaz = require('./lib/a/test.js');
        expect(unmockedBaz()).to.be.equal('foobarbaz');

        return rewiremock.around(() => import('./lib/a/test.js'),
            (mock) => {
                addPlugin(nodePlugin);

                mock('./lib/a/foo').with(() => 'aa');
                mock('./lib/a/../b/bar').with(() => 'bb').disable();
                mock('./lib/a/../b/baz').with(() => 'cc');
            })
            .then((mockedBaz) => {
                expect(webpackDefault(mockedBaz)()).to.be.equal('aabarcc');
            });
    });

    it('scope load es6 with no module mocked: ', () => {
        const unmockedBaz = require('./lib/a/test.js');
        expect(unmockedBaz()).to.be.equal('foobarbaz');

        return rewiremock.around(() => import('./lib/a/test.js'))
            .then((mockedBaz) => {
                expect(webpackDefault(mockedBaz)()).to.be.equal('foobarbaz');
            });
    });

    it('scope load via proxy call: ', () => {
        const unmockedBaz = require('./lib/a/test.js');
        expect(unmockedBaz()).to.be.equal('foobarbaz');
        const mockedBaz = rewiremock.proxy('./lib/a/test.js',{
            './foo': () => 'aa',
            '../b/baz':() => 'cc'
        });

        expect(mockedBaz()).to.be.equal('aabarcc');
    });

  describe('proxy call', () => {

    it('simple flow: ', () => {
      const unmockedBaz = require('./lib/a/test.js');
      expect(unmockedBaz()).to.be.equal('foobarbaz');
      const mockedBaz = rewiremock.proxy('./lib/a/test.js', r => ({
        './foo': () => 'aa',
        '../b/baz': r.with(() => 'cc')
      }));

      expect(mockedBaz()).to.be.equal('aabarcc');
    });

    it('require call: ', () => {
      const unmockedBaz = require('./lib/a/test.js');
      expect(unmockedBaz()).to.be.equal('foobarbaz');
      const mockedBaz = rewiremock.proxy(() => require('./lib/a/test.js'), {
        './foo': () => 'aa',
        '../b/baz': () => 'cc'
      });

      expect(mockedBaz()).to.be.equal('aabarcc');
    });

    it('import es5: ', () => {
      const unmockedBaz = require('./lib/a/test.js');
      expect(unmockedBaz()).to.be.equal('foobarbaz');
      const mockedBazLoad = rewiremock.module( () => import('./lib/a/test.js'), r => ({
        './foo': () => 'aa',
        '../b/baz': r.with(() => 'cc')
      }));

      return mockedBazLoad.then(mockedBaz => {
        expect(webpackDefault(mockedBaz)()).to.be.equal('aabarcc')
      })
    });

    it('import es6: ', () => {
      const unmockedBaz = require('./lib/a/test.js');
      expect(unmockedBaz()).to.be.equal('foobarbaz');
      const mockedBazLoad = rewiremock.module( () => import('./lib/a/test.es6.js'), r => ({
        './foo': () => 'aa',
        '../b/baz': r.with(() => 'cc')
      }));

      return mockedBazLoad.then(mockedBaz => {
        expect(mockedBaz.default()).to.be.equal('aabarcc')
      })
    });
  });
});
