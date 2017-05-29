import {parse, join} from 'path';
import {magicProps} from './_common';

let mocks = {};

const modifyMock = (name, stubs) => {
    const stubType = typeof stubs;
    const oldMock = mocks[name];
    if (stubType === 'object') {
        mocks[name] = {
            ...mocks[name],
            ...stubs
        };
    } else {
        mocks[name] = stubs;
    }

    magicProps.forEach(key => {
        if (oldMock.hasOwnProperty(key)) {
            mocks[name][key] = oldMock[key];
        }
    })
};

const genMock = (name) => {
    const mock = {};
    Object.defineProperty(mock, "__MI_name", {
        value: name
    });
    return mock;
}

const resetMock = (name) => mocks[name] = genMock(name);

const resetMocks = () => (mocks = {});

const getMock = (name) => {
    const fn = parse(name);
    const shortName = join(fn.dir, fn.name);
    return mocks[name] || mocks[shortName];
};

const getAllMocks = () => mocks;

export {
    modifyMock,
    getMock,
    getAllMocks,
    resetMock,
    resetMocks
}