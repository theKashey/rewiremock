import getScope from '../globals';
import createPlugin from './_common';

const onDisable = (mock) => {
    const name = mock.mock.name;
    if (mock.flag_toBeUsed && !getScope().mockedModules[name]) {
        throw new Error(name + ' set toBeUsed, but was unused')
    }
};

const plugin = createPlugin({
    onDisable
});

export default plugin;