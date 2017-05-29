var path = require('path');

module.exports = {
    resolve: {
        alias: {
            'my-absolute-test-lib': path.join(__dirname, 'lib/a'),
            'same-folder-lib': path.resolve(__dirname, 'lib/b'),
        }
    }
};