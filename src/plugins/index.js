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

const exports = {
    childOnly,
    nodejs,
    protectNodeModules,
    relative,
    webpackAlias,
    toBeUsed,

    disabledByDefault,
    mockThoughByDefault,
    alwaysMatchOrigin,
    usedByDefault,
    directChild
};

export default exports;