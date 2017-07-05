import {extensions} from '../_common';

const YES = 'yes';
const NO = 'no';
const PASS = true;

const onetoone = a => a;
const pass = () => PASS;

const createPlugin = (plugin) => ({
    fileNameTransformer: onetoone,
    wipeCheck: pass,
    shouldMock: pass,
    ...plugin
});

const standardWipeCheck = (stubs, moduleName) => {
    if(moduleName.indexOf('node_')==-1){
        console.log('should i',moduleName);
    }
    if (extensions.find(ext => stubs[moduleName + ext]) !== undefined) {
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