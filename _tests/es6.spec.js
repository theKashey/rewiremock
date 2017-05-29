import {expect} from 'chai';

import mockModule from '../src/index';
import {addPlugin, _clearPlugins} from '../src/plugins';

import relativePlugin from '../src/plugins/relative';

describe('es6 modules ', () => {
    it('should not overload: ', () => {
        const unmockedBaz = require('./lib/es6/test').default;
        expect(unmockedBaz()).to.be.equal('foobarbaz');
    });

    it('should overload with node plugin: ', () => {
        addPlugin(relativePlugin);
        mockModule('./foo')
            .withDefault(()=>'aa');

        mockModule('./bar')
            .with({
                bar: ()=>'bb',
                baz: ()=>'cc',
            });

        const unmockedBaz = require('./lib/es6/test').default;
        expect(unmockedBaz()).to.be.equal('foobarbaz');

        mockModule.enable();

        const mockedBaz = require('./lib/es6/test').default;
        expect(mockedBaz()).to.be.equal('aabbcc');
        mockModule.disable();
        mockModule.clear();
        _clearPlugins();
    });

    it('should overload with node plugin: ', () => {
        addPlugin(relativePlugin);
        mockModule('./foo')
            .with(()=>'aa');

        mockModule('./bar')
            .es6()
            .with({
                bar: ()=>'bb',
                baz: ()=>'cc',
            });

        const unmockedBaz = require('./lib/es6/test').default;
        expect(unmockedBaz()).to.be.equal('foobarbaz');

        mockModule.enable();

        const mockedBaz = require('./lib/es6/test').default;
        expect(mockedBaz()).to.be.equal('aabbcc');
        mockModule.disable();
        mockModule.clear();
        _clearPlugins();
    });

    it('should fail with callThought: ', () => {
        addPlugin(relativePlugin);
        mockModule('./foo')
            .callThought()
            .with(()=>'aa');

        mockModule('./bar')
            .es6()
            .with({
                bar: ()=>'bb',
                baz: ()=>'cc',
            });

        const unmockedBaz = require('./lib/es6/test').default;
        expect(unmockedBaz()).to.be.equal('foobarbaz');

        mockModule.enable();

        const mockedBaz = require('./lib/es6/test').default;
        expect(mockedBaz()).to.be.equal('foobbcc');
        mockModule.disable();
        mockModule.clear();
        _clearPlugins();
    });

    it('should fail with callThought: ', () => {
        addPlugin(relativePlugin);
        mockModule('./foo')
            .callThought()
            .withDefault(()=>'aa');

        mockModule('./bar')
            .es6()
            .with({
                bar: ()=>'bb',
                baz: ()=>'cc',
            });

        const unmockedBaz = require('./lib/es6/test').default;
        expect(unmockedBaz()).to.be.equal('foobarbaz');

        mockModule.enable();

        const mockedBaz = require('./lib/es6/test').default;
        expect(mockedBaz()).to.be.equal('aabbcc');
        mockModule.disable();
        mockModule.clear();
        _clearPlugins();
    });

});
