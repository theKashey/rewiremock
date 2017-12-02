import childOnly from './childOnly';
import nodejs from './nodejs';
import protectNodeModules from './protectNodeModules';
import relative from './relative';
import webpackAlias from './webpack-alias';
import toBeUsed from './toBeUsed';
import directChild from './directChild';

import disabledByDefault from './disabledByDefault';
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
    alwaysMatchOrigin,
    usedByDefault,
    directChild
};

export default exports;