import createPlugin from './_common';

var onEnable = function onEnable(_ref) {
    var mock = _ref.mock;

    mock.usedAs = undefined;
};

var onDisable = function onDisable(_ref2) {
    var mock = _ref2.mock;

    var name = mock.name;
    if (mock.flag_toBeUsed && !mock.usedAs) {
        throw new Error(name + ' is set toBeUsed, but was unused');
    }
};

var plugin = createPlugin({
    onDisable: onDisable,
    onEnable: onEnable,

    name: 'toBeUsed'
});

export default plugin;