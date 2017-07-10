import {parse, join} from 'path';
import getScope from './globals';
import {extensions} from './_common';

const genMock = (name) => {
    return {
        name,
        value: {}
    };
};

const resetMock = (name) => getScope().mocks[name] = genMock(name);

const pickFrom = (mocks, name) => {
    const ext = extensions.find(ext => mocks[name + ext]);
    if(ext!==undefined){
        return mocks[name + ext]
    }
};

const getMock = (name, scope = getScope()) => {
    const {mocks} = scope;
    const fn = parse(name);
    const shortName = join(fn.dir, fn.name);

    const mock = pickFrom(mocks, name) || pickFrom(mocks, shortName);

    if (!mock && scope.parentScope) {
        return getMock(name, scope.parentScope);
    }
    return mock;
};

const getAllMocks = () => {
    const result = {};
    const collect = (scope) => {
        if (scope.parentScope) {
            collect(scope.parentScope);
        }
        const mocks = scope.mocks;
        Object.keys(scope.mocks).forEach(key => result[key] = mocks[key]);
    };
    collect(getScope());
    return result;
};

export {
    getMock,
    getAllMocks,
    resetMock
}