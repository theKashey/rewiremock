import {expect} from 'chai';

import rewiremock, {addPlugin} from '../src/index';
import {_clearPlugins} from '../src/plugins';

import nodePlugin from '../src/plugins/nodejs';

describe('isolation ', () => {
    it('should trigger error: ', () => {
        addPlugin(nodePlugin);
        rewiremock.enable();
        rewiremock.isolation();

        try {
            require('./lib/a/test.js');
            expect("should not be called").to.be.equal(false);
        } catch (e) {

        }
        rewiremock.disable();
        rewiremock.clear();
        _clearPlugins();
    });

    it('work in isolation: ', () => {
        addPlugin(nodePlugin);
        rewiremock.passBy(/node_modules/);
        rewiremock('./lib/a/foo')
            .with(() => 'aa');

        rewiremock('./lib/a/../b/bar')
            .with(() => 'bb');

        rewiremock('./lib/a/../b/baz')
            .with(() => 'cc');

        rewiremock.enable();
        rewiremock.isolation();

        const mockedBaz = require('./lib/a/test.js');
        expect(mockedBaz()).to.be.equal('aabbcc');
        rewiremock.disable();
        rewiremock.clear();
        _clearPlugins();
    });

    it('should passby modules: ', () => {
        addPlugin(nodePlugin);
        rewiremock.passBy(/node_modules/);
        rewiremock('./lib/a/foo')
            .with(() => 'aa');

        rewiremock.passBy(module => module.indexOf('b/bar') >= 0);
        rewiremock.passBy(/b\/baz/);

        rewiremock.enable();
        rewiremock.isolation();

        const mockedBaz = require('./lib/a/test.js');
        expect(mockedBaz()).to.be.equal('aabarbaz');
        rewiremock.disable();
        rewiremock.clear();
        _clearPlugins();
    });

    it('should nest passby: ', () => {
        addPlugin(nodePlugin);
        rewiremock.passBy(/node_modules/);
        rewiremock('./lib/a/foo')
            .with(() => 'aa');

        rewiremock.passBy(/test.js/);

        rewiremock.enable();
        rewiremock.isolation();

        const mockedBaz = require('./lib/a/test.js');
        expect(mockedBaz()).to.be.equal('aabarbaz');
        rewiremock.disable();
        rewiremock.clear();
        _clearPlugins();
    });

    it('should inverse isolation by toBeUsed: ', () => {
        rewiremock('./lib/a/foo')
            .with(() => 'aa')
            .toBeUsed();

        rewiremock.enable();

        const mockedBaz = require('./lib/a/test.js');
        expect(mockedBaz()).to.be.equal('foobarbaz');
        try {
            rewiremock.disable();
            expect('should not be called').to.equal.false();
        } catch (e) {

        }
        rewiremock.clear();
        _clearPlugins();
    });
});
