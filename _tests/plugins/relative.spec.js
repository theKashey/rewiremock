import {expect} from 'chai';

import rewiremock from '../../src/index';
import { addPlugin, _clearPlugins } from '../../src/plugins';

import relativePlugin from '../../src/plugins/relative';

describe('relative ', () => {

    it('should mock only first level: ', () => {
        addPlugin(relativePlugin);
        rewiremock('./foo')
            .with(()=>'aa');

        const unmockedBaz = require('./lib/test.js');
        expect(unmockedBaz()).to.be.equal('foobar');

        rewiremock.enable();

        const mockedBaz = require('./lib/test.js');
        expect(mockedBaz()).to.be.equal('aabar');
        rewiremock.disable();
        rewiremock.clear();
        _clearPlugins();
    });
});
