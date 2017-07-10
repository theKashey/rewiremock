import {expect} from 'chai';

import rewiremock, {plugins} from '../src/index';

describe('tristate test ', () => {

    it('a0 case - no mock: ', () => {
        return import('./lib/tristate/a1.js').then(a1 =>
            expect(a1.default()).to.equal("FOOfoo")
        );
    });

    it('a1 case - mock before: ', () => {
        return rewiremock.around(() => import('./lib/tristate/a1.js'),
            () => {
                rewiremock.addPlugin(plugins.relative);
                rewiremock('./c.js').withDefault(() => "bar").toBeUsed();
            }).then(a1 => {
            expect(a1.default()).to.equal("FOObar");
        })
    });

    it('a2 case - mock after: ', () => {
        return rewiremock.around(() => import('./lib/tristate/a2.js'),
            () => {
                rewiremock.addPlugin(plugins.relative);
                rewiremock('./c.js').withDefault(() => "bar").toBeUsed();
            }).then(a1 => {
            expect(a1.default()).to.equal("FOObar");
        })
    });

    it('a1 case - mock all: ', () => {
        return rewiremock.around(() => import('./lib/tristate/a1.js'),
            () => {
                rewiremock.addPlugin(plugins.nodejs);
                rewiremock('./lib/tristate/c.js').withDefault(() => "bar").toBeUsed();
            }).then(a1 => {
            expect(a1.default()).to.equal("BARbar");
        })
    });

});
