import {expect} from 'chai';

import rewiremock, {addPlugin, plugins} from '../../src/index';
import {_clearPlugins} from '../../src/plugins';

describe('relative ', () => {

    it('should mock only first level: ', () => {
        addPlugin(plugins.disabledByDefault);
        addPlugin(plugins.relative);
        rewiremock('./foo')
            .with(() => 'aa');

        const unmockedBaz = require('./lib/test.js');
        expect(unmockedBaz()).to.be.equal('foobar');

        rewiremock.enable();

        const mockedBaz = require('./lib/test.js');
        expect(mockedBaz()).to.be.equal('foobar');
        rewiremock.disable();
        rewiremock.clear();
        _clearPlugins();
    });
});
