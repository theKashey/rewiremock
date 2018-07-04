import childOnly from './childOnly';
import nodejs from './nodejs';
import protectNodeModules from './protectNodeModules';
import relative from './relative';
import webpackAlias from './webpack-alias';
import toBeUsed from './toBeUsed';
import directChild from './directChild';

import disabledByDefault from './disabledByDefault';
import mockThoughByDefault from './mockThoughByDefault';
import usedByDefault from './usedByDefault';
import alwaysMatchOrigin from './toMatchOrigin';

import nodeLibBrowser from './node-lib-browser';
import __mock__ from './__mock__';

const mockThroughByDefault = mockThoughByDefault;

const exports = {
    childOnly,
    nodejs,
    protectNodeModules,
    relative,
    webpackAlias,
    toBeUsed,

    disabledByDefault,

    mockThoughByDefault,
    mockThroughByDefault,

    alwaysMatchOrigin,
    usedByDefault,
    directChild,

    __mock__,

    nodeLibBrowser
};

export default exports;