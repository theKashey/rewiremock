import {extensions} from '../_common';

const YES = 'yes';
const NO = 'no';
const PASS = true;

const onetoone = a => a;
const pass = () => PASS;



const createPlugin = (plugin) => {
    const result = Object.assign({
        fileNameTransformer: onetoone,
        wipeCheck: pass,
        shouldMock: pass,
    }, plugin);
    return result;
}

const standardWipeCheck = (stubs, moduleName) => {
    if (extensions.some(ext => stubs[moduleName + ext])) {
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