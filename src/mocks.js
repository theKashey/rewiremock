import {parse, join} from 'path';
import getScope from './globals';

const genMock = (name) => {
    return {
        name,
        value: {}
    };
};

const resetMock = (name) => getScope().mocks[name] = genMock(name);

const getMock = (name, scope = getScope()) => {
    const {mocks} = scope;
    const fn = parse(name);
    const shortName = join(fn.dir, fn.name);
    const mock = mocks[name] || mocks[shortName];
    if (!mock && scope.parentScope) {
        return getMock(name, scope.parentScope);
    }
    return mock;
};

const getAllMocks = () => {
    const result = {};
    const collect = (scope) => {
        const mocks = scope.mocks;
        Object.keys(scope.mocks).forEach(key => result[key]=mocks[key]);
        if (scope.parentScope) {
            collect(scope.parentScope);
        }
    };
    collect(getScope());
    return result;
};

export {
    getMock,
    getAllMocks,
    resetMock
}