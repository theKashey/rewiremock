import {expect} from 'chai';

import rewiremock, {addPlugin} from '../src/index';
import {_clearPlugins} from '../src/plugins';

import nodePlugin from '../src/plugins/nodejs';
import relativePlugin from '../src/plugins/relative';
import aliasPlugin, {configure as configureWebpackAlias} from '../src/plugins/webpack-alias';

describe('rewiremock ', () => {
    it('should not overload: ', () => {
        rewiremock('./lib/a/foo')
            .with(()=>'aa');

        rewiremock('./lib/a/../b/bar')
            .with(()=>'bb');

        rewiremock('./lib/a/../b/baz')
            .with(()=>'cc');

        const unmockedBaz = require('./lib/a/test.js');
        expect(unmockedBaz()).to.be.equal('foobarbaz');

        rewiremock.enable();

        const mockedBaz = require('./lib/a/test.js');
        expect(mockedBaz()).to.be.equal('foobarbaz');
        rewiremock.disable();
        rewiremock.clear();
    });

    it('should overload with node plugin: ', () => {
        addPlugin(nodePlugin);
        rewiremock('./lib/a/foo')
            .with(()=>'aa');

        rewiremock('./lib/a/../b/bar')
            .with(()=>'bb');

        rewiremock('./lib/a/../b/baz')
            .with(()=>'cc');

        const unmockedBaz = require('./lib/a/test.js');
        expect(unmockedBaz()).to.be.equal('foobarbaz');

        rewiremock.enable();

        const mockedBaz = require('./lib/a/test.js');
        expect(mockedBaz()).to.be.equal('aabbcc');
        rewiremock.disable();
        rewiremock.clear();
        _clearPlugins();
    });

    it('should overload with relative plugin: ', () => {
        addPlugin(relativePlugin);
        rewiremock('./foo')
            .with(()=>'aa');

        rewiremock('../b/bar')
            .with(()=>'bb');

        rewiremock('../b/baz')
            .with(()=>'cc');

        const unmockedBaz = require('./lib/a/test.js');
        expect(unmockedBaz()).to.be.equal('foobarbaz');

        rewiremock.enable();

        const mockedBaz = require('./lib/a/test.js');
        expect(mockedBaz()).to.be.equal('aabbcc');
        rewiremock.disable();
        rewiremock.clear();
        _clearPlugins();
    });

    it('should overload with webpack alias plugin: ', () => {
        configureWebpackAlias('_tests/webpack.config.js');

        addPlugin(aliasPlugin);
        rewiremock('my-absolute-test-lib/foo')
            .with(()=>'aa');

        rewiremock('same-folder-lib/bar')
            .with(()=>'bb');

        rewiremock('../b/baz')
            .with(()=>'cc');

        const unmockedBaz = require('./lib/a/test.js');
        expect(unmockedBaz()).to.be.equal('foobarbaz');

        rewiremock.enable();

        const mockedBaz = require('./lib/a/test.js');
        expect(mockedBaz()).to.be.equal('aabbcc');
        rewiremock.disable();
        rewiremock.clear();
        _clearPlugins();
    });

});
