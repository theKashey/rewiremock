const webpack = require("webpack");
const mockPlugin = require("./webpack/plugin");

module.exports = {
  mode: "development",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            sourceType: "module",
            presets: [
              [
                "babel-preset-env",
                {
                  useBuiltIns: "usage",
                  corejs: 3,
                },
              ],
            ],
            plugins: [],
          },
        },
      },
    ],
  },
  optimization: {
    chunkIds: "named",
  },
  resolve: {
    fallback: {
      path: require.resolve("path-browserify"),
      stream: require.resolve("stream-browserify"),
      http: require.resolve("stream-http"),
    },
  },
  // webpack configuration
  plugins: [new webpack.HotModuleReplacementPlugin(), new mockPlugin()],
};
