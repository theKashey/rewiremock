import {expect} from 'chai';

import mockModule from '../src/index';
import { addPlugin, _clearPlugins } from '../src/plugins';

import nodePlugin from '../src/plugins/nodejs';

describe('isolation ', () => {
    it('should trigger error: ', () => {
        addPlugin(nodePlugin);
        mockModule.enable();
        mockModule.isolation();

        try {
            require('./lib/a/test.js');
            expect("should not be called").to.be.equal(false);
        } catch(e){

        }
        mockModule.disable();
        mockModule.clear();
        _clearPlugins();
    });

    it('work in isolation: ', () => {
        addPlugin(nodePlugin);
        mockModule.passBy(/node_modules/);
        mockModule('./lib/a/foo')
            .with(()=>'aa');

        mockModule('./lib/a/../b/bar')
            .with(()=>'bb');

        mockModule('./lib/a/../b/baz')
            .with(()=>'cc');

        mockModule.enable();
        mockModule.isolation();

        const mockedBaz = require('./lib/a/test.js');
        expect(mockedBaz()).to.be.equal('aabbcc');
        mockModule.disable();
        mockModule.clear();
        _clearPlugins();
    });

    it('should passby modules: ', () => {
        addPlugin(nodePlugin);
        mockModule.passBy(/node_modules/);
        mockModule('./lib/a/foo')
            .with(()=>'aa');

        mockModule.passBy(module => module.indexOf('b/bar')>=0);
        mockModule.passBy(/b\/baz/);

        mockModule.enable();
        mockModule.isolation();

        const mockedBaz = require('./lib/a/test.js');
        expect(mockedBaz()).to.be.equal('aabarbaz');
        mockModule.disable();
        mockModule.clear();
        _clearPlugins();
    });

    it('should nest passby: ', () => {
        addPlugin(nodePlugin);
        mockModule.passBy(/node_modules/);
        mockModule('./lib/a/foo')
            .with(()=>'aa');

        mockModule.passBy(/test.js/);

        mockModule.enable();
        mockModule.isolation();

        const mockedBaz = require('./lib/a/test.js');
        expect(mockedBaz()).to.be.equal('aabarbaz');
        mockModule.disable();
        mockModule.clear();
        _clearPlugins();
    });

});
