import {expect} from 'chai';
import rewiremock, {addPlugin} from '../src/index';
import {_clearPlugins} from '../src/plugins';
import relativePlugin from '../src/plugins/relative';

describe('nested ', () => {
    it('should fail to load mocks: ', () => {
        addPlugin(relativePlugin);

        require('./lib/nested-broken.setup');

        const unmockedBaz = require('./lib/a/test.js');
        expect(unmockedBaz()).to.be.equal('foobarbaz');

        rewiremock.enable();

        const mockedBaz = require('./lib/a/test.js');
        expect(mockedBaz()).to.be.equal('aabbcc');
        rewiremock.disable();
        rewiremock.clear();
        _clearPlugins();
    });

    it('should load external nested setup: ', () => {
        addPlugin(relativePlugin);

        require('./lib/nested-valid.setup');

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
