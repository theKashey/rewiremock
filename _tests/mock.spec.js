import {expect} from 'chai';

import mockModule from '../src/index';
import { addPlugin, _clearPlugins } from '../src/plugins';

import nodePlugin from '../src/plugins/nodejs';
import relativePlugin from '../src/plugins/relative';
import aliasPlugin, {configure as configureWebpackAlias} from '../src/plugins/webpack-alias';

describe('mockModule ', () => {
    it('should not overload: ', () => {
        mockModule('./lib/a/foo')
            .with(()=>'aa');

        mockModule('./lib/a/../b/bar')
            .with(()=>'bb');

        mockModule('./lib/a/../b/baz')
            .with(()=>'cc');

        const unmockedBaz = require('./lib/a/test.js');
        expect(unmockedBaz()).to.be.equal('foobarbaz');

        mockModule.enable();

        const mockedBaz = require('./lib/a/test.js');
        expect(mockedBaz()).to.be.equal('foobarbaz');
        mockModule.disable();
        mockModule.clear();
    });

    it('should overload with node plugin: ', () => {
        addPlugin(nodePlugin);
        mockModule('./lib/a/foo')
            .with(()=>'aa');

        mockModule('./lib/a/../b/bar')
            .with(()=>'bb');

        mockModule('./lib/a/../b/baz')
            .with(()=>'cc');

        const unmockedBaz = require('./lib/a/test.js');
        expect(unmockedBaz()).to.be.equal('foobarbaz');

        mockModule.enable();

        const mockedBaz = require('./lib/a/test.js');
        expect(mockedBaz()).to.be.equal('aabbcc');
        mockModule.disable();
        mockModule.clear();
        _clearPlugins();
    });

    it('should overload with relative plugin: ', () => {
        addPlugin(relativePlugin);
        mockModule('./foo')
            .with(()=>'aa');

        mockModule('../b/bar')
            .with(()=>'bb');

        mockModule('../b/baz')
            .with(()=>'cc');

        const unmockedBaz = require('./lib/a/test.js');
        expect(unmockedBaz()).to.be.equal('foobarbaz');

        mockModule.enable();

        const mockedBaz = require('./lib/a/test.js');
        expect(mockedBaz()).to.be.equal('aabbcc');
        mockModule.disable();
        mockModule.clear();
        _clearPlugins();
    });

    it('should overload with webpack alias plugin: ', () => {
        configureWebpackAlias('_tests/webpack.config.js');

        addPlugin(aliasPlugin);
        mockModule('my-absolute-test-lib/foo')
            .with(()=>'aa');

        mockModule('same-folder-lib/bar')
            .with(()=>'bb');

        mockModule('../b/baz')
            .with(()=>'cc');

        const unmockedBaz = require('./lib/a/test.js');
        expect(unmockedBaz()).to.be.equal('foobarbaz');

        mockModule.enable();

        const mockedBaz = require('./lib/a/test.js');
        expect(mockedBaz()).to.be.equal('aabbcc');
        mockModule.disable();
        mockModule.clear();
        _clearPlugins();
    });

});
