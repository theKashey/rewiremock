import {expect} from 'chai';

import rewiremock, {addPlugin, plugins} from '../src/index';
import {_clearPlugins} from '../src/plugins';

import relativePlugin from '../src/plugins/relative';

describe('es6 modules ', () => {
    it('should not overload: ', () => {
        const unmockedBaz = require('./lib/es6/test').default;
        expect(unmockedBaz()).to.be.equal('foobarbaz');
    });

    it('should overload default export with node plugin: ', () => {
        addPlugin(plugins.relative);
        rewiremock('./foo')
            .withDefault(()=>'aa');

        rewiremock('./bar')
            .with({
                bar: ()=>'bb',
                baz: ()=>'cc',
            });

        const unmockedBaz = require('./lib/es6/test').default;
        expect(unmockedBaz()).to.be.equal('foobarbaz');

        rewiremock.enable();

        const mockedBaz = require('./lib/es6/test').default;
        expect(mockedBaz()).to.be.equal('aabbcc');
        rewiremock.disable();
        rewiremock.clear();
        _clearPlugins();
    });

    it('should overload not-default export with node plugin: ', () => {
        addPlugin(relativePlugin);
        rewiremock('./foo')
            .with(()=>'aa');

        rewiremock('./bar')
            .es6()
            .with({
                bar: ()=>'bb',
                baz: ()=>'cc',
            });

        const unmockedBaz = require('./lib/es6/test').default;
        expect(unmockedBaz()).to.be.equal('foobarbaz');

        rewiremock.enable();

        console.log('prepare');
        const mockedBaz = require('./lib/es6/test').default;
        expect(mockedBaz()).to.be.equal('aabbcc');
        rewiremock.disable();
        rewiremock.clear();
        _clearPlugins();
    });

    it('should fail with callThought: ', () => {
        addPlugin(relativePlugin);
        rewiremock('./foo')
            .callThought()
            .with(()=>'aa');

        rewiremock('./bar')
            .es6()
            .with({
                bar: ()=>'bb',
                baz: ()=>'cc',
            });

        const unmockedBaz = require('./lib/es6/test').default;
        expect(unmockedBaz()).to.be.equal('foobarbaz');

        rewiremock.enable();

        const mockedBaz = require('./lib/es6/test').default;
        expect(mockedBaz()).to.be.equal('foobbcc');
        rewiremock.disable();
        rewiremock.clear();
        _clearPlugins();
    });

    it('should fail with callThought: ', () => {
        addPlugin(relativePlugin);
        rewiremock('./foo')
            .callThought()
            .withDefault(()=>'aa');

        rewiremock('./bar')
            .es6()
            .with({
                bar: ()=>'bb',
                baz: ()=>'cc',
            });

        const unmockedBaz = require('./lib/es6/test').default;
        expect(unmockedBaz()).to.be.equal('foobarbaz');

        rewiremock.enable();

        const mockedBaz = require('./lib/es6/test').default;
        expect(mockedBaz()).to.be.equal('aabbcc');
        rewiremock.disable();
        rewiremock.clear();
        _clearPlugins();
    });

});
