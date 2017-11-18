import { extensions } from '../_common';

var YES = 'yes';
var NO = 'no';
var PASS = true;

var onetoone = function onetoone(a) {
    return a;
};
var pass = function pass() {
    return PASS;
};

var createPlugin = function createPlugin(plugin) {
    var result = Object.assign({
        fileNameTransformer: onetoone,
        wipeCheck: pass,
        shouldMock: pass
    }, plugin);
    return result;
};

var standardWipeCheck = function standardWipeCheck(stubs, moduleName) {
    if (extensions.find(function (ext) {
        return stubs[moduleName + ext];
    }) !== undefined) {
        return YES;
    }
};

export { standardWipeCheck, YES, NO, PASS };

export default createPlugin;