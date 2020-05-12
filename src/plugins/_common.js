import {getExtensions} from '../constants';

const YES = 'yes';
const NO = 'no';
const PASS = true;

const onetoone = a => a;
const pass = () => PASS;
const empty = () => null;

const createPlugin = (plugin) => {
    const result = Object.assign({
        init: empty,
        fileNameTransformer: onetoone,
        wipeCheck: pass,
        shouldMock: pass,
    }, plugin);
    return result;
}

const standardWipeCheck = (stubs, moduleName) => {
    if (getExtensions().some(ext => stubs[moduleName + ext])) {
        return YES;
    }
};

export {
    standardWipeCheck,
    YES,
    NO,
    PASS
};

export default createPlugin;