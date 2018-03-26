const FS_MODULE_NAME = 'fs';
let fs;

if (typeof __webpack_modules__ === 'undefined') {
  try {
    fs = require(FS_MODULE_NAME);
  } catch (e) {
    //nop
  }
}

export function fileExists(path) {
  if (typeof __webpack_modules__ !== 'undefined') {
    const npath = path[0] === '.' ? path : '.' + path;
    return __webpack_modules__[npath] && npath;
  }
  try {
    return !fs.accessSync(path, fs.F_OK) && path;
  } catch (e) {
    return false;
  }
}