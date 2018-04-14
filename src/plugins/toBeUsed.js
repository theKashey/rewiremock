import createPlugin from './_common';
import {getModuleName} from "../module";

const onEnable = ({mock}) => {
  mock.usedAs = undefined;
};


const onDisable = ({mock}) => {
  const name = mock.name;
  if (mock.flag_toBeUsed && !mock.usedAs) {
    if (!mock.wasRequired) {
      throw new Error(name + ' is set toBeUsed, but was unused')
    }

    const history = mock.rejected.map(({parent, plugins}) => getModuleName(parent) + '->' + plugins.join(','));

    throw new Error(name + ' is set toBeUsed, was requied, by rejected by plugins.\n' + history.join('\n'))

  }
};

const plugin = createPlugin({
  onDisable,
  onEnable,

  name: 'toBeUsed'
});

export default plugin;