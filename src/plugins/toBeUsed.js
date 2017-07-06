import {isAbsolute} from 'path';
import getScope from '../globals';
import createPlugin from './_common';

const onDisable = (mock) => {
    if (mock.toBeUsed && !getScope().mockedModules[mock.name]) {
        throw new Error(mock.name + ' set toBeUsed, but was unused')
    }
};

const plugin = createPlugin({
    onDisable
});

export default plugin;