import createPlugin from './_common';

const onEnable = ({mock}) => {
    mock.usedAs = undefined;
};


const onDisable = ({mock}) => {
    const name = mock.name;
    if (mock.flag_toBeUsed && !mock.usedAs) {
        throw new Error(name + ' is set toBeUsed, but was unused')
    }
};

const plugin = createPlugin({
    onDisable,
    onEnable,

    name: 'toBeUsed'
});

export default plugin;