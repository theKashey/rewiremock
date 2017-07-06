import {isAbsolute} from 'path';
import createPlugin from './_common';

const onMockCreate = (mock) => {
    mock.disable();
    return mock;
};

const plugin = createPlugin({
    onMockCreate,
    onDisable: onMockCreate
});

export default plugin;