const webpack = require('webpack');
const mockPlugin = require("./webpack/plugin");

module.exports = {
  // webpack configuration
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new mockPlugin()
  ]
}
