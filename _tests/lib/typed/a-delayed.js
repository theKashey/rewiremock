// @flow
let a=42;

import('./b.js').then(t => a=t.default());

export default () => a;