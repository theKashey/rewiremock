import {expect} from 'chai';

import rewiremock, {addPlugin} from '../src/index';
import {_clearPlugins} from '../src/plugins';

import nodePlugin from '../src/plugins/nodejs';

describe('scope ', () => {
    it('scope load es5: ', () => {

        const unmockedBaz = require('./lib/a/test.js');
        expect(unmockedBaz()).to.be.equal('foobarbaz');

        return rewiremock.inScope(() => require('./lib/a/test.js'),
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

        return rewiremock.inScope(() => import('./lib/a/test.js'),
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

    it('scope load es6 with deferred create: ', () => {
        const unmockedBaz = require('./lib/a/test.js');
        expect(unmockedBaz()).to.be.equal('foobarbaz');

        return rewiremock.inScope(() => import('./lib/a/test.js'),
            (mock) =>
                Promise.resolve().then(() => {
                    addPlugin(nodePlugin);

                    mock('./lib/a/foo').with(() => 'aa');
                    mock('./lib/a/../b/bar').with(() => 'bb');
                    mock('./lib/a/../b/baz').with(() => 'cc');
                }))
            .then((mockedBaz) => {
                expect(mockedBaz()).to.be.equal('aabbcc');
            });
    });

    it('scope load es6 with internal test: ', () => {
        const unmockedBaz = require('./lib/a/test.js');
        expect(unmockedBaz()).to.be.equal('foobarbaz');

        return rewiremock.inScope(
            () =>
                import('./lib/a/test.js')
                    .then((mockedBaz) => {
                        expect(mockedBaz()).to.be.equal('aabbcc');
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

        return rewiremock.inScope(() => import('./lib/a/test.js'),
            (mock) => {
                addPlugin(nodePlugin);

                mock('./lib/a/foo').with(() => 'aa');
                mock('./lib/a/../b/bar').with(() => 'bb').disable();
                mock('./lib/a/../b/baz').with(() => 'cc');
            })
            .then((mockedBaz) => {
                expect(mockedBaz()).to.be.equal('aabarcc');
            });
    });

    it('scope load es6 with no module mocked: ', () => {
        const unmockedBaz = require('./lib/a/test.js');
        expect(unmockedBaz()).to.be.equal('foobarbaz');

        return rewiremock.inScope(() => import('./lib/a/test.js'))
            .then((mockedBaz) => {
                expect(mockedBaz()).to.be.equal('foobarbaz');
            });
    });
});
