import {expect} from 'chai';

import mockModule from '../../src/index';
import { addPlugin, _clearPlugins } from '../../src/plugins';

import relativePlugin from '../../src/plugins/relative';

describe('relative ', () => {

    it('should mock only first level: ', () => {
        addPlugin(relativePlugin);
        mockModule('./foo')
            .with(()=>'aa');

        const unmockedBaz = require('./lib/test.js');
        expect(unmockedBaz()).to.be.equal('foobar');

        mockModule.enable();

        const mockedBaz = require('./lib/test.js');
        expect(mockedBaz()).to.be.equal('aabar');
        mockModule.disable();
        mockModule.clear();
        _clearPlugins();
    });
});
