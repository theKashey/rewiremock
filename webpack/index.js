const fs = require('fs')
const path = require('path')
//const { SourceNode, SourceMapConsumer } = require('source-map')
//const makeIdentitySourceMap = require('./makeIdentitySourceMap')

const blocks = [
  '__webpack_require__ = require("rewiremock/webpack/interceptor")(__webpack_require__, module, "__FILENAME__")'
];

function transform(source, map) {
  // This is a Webpack loader, but the user put it in the Babel config.
  if (source && source.types && source.types.IfStatement) {
    throw new Error(
      'React Hot Loader: You are erroneously trying to use a Webpack loader ' +
        'as a Babel plugin. Replace "react-hot-loader/webpack" with ' +
        '"react-hot-loader/babel" in the "plugins" section of your .babelrc file. ' +
        'While we recommend the above, if you prefer not to use Babel, ' +
        'you may remove "react-hot-loader/webpack" from the "plugins" section of ' +
        'your .babelrc file altogether, and instead add "react-hot-loader/webpack" ' +
        'to the "loaders" section of your Webpack configuration.',
    )
  }

  if (this.cacheable) {
    this.cacheable()
  }

  // Parameterize the helper with the current filename.
  const separator = '\n\n'
  const start = blocks[0].replace(
    /__FILENAME__/g,
    JSON.stringify(this.resourcePath),
  )

  if (this.sourceMap === false) {
    return this.callback(null, [start, source].join(separator))
  }
  throw new Error('no source maps');
/*
  if (!map) {
    map = makeIdentitySourceMap(source, this.resourcePath) // eslint-disable-line no-param-reassign
  }
  const node = new SourceNode(null, null, null, [
    SourceNode.fromStringWithSourceMap(source, new SourceMapConsumer(map)),
    new SourceNode(null, null, this.resourcePath, appendText),
  ]).join(separator)

  const result = node.toStringWithSourceMap()
  return this.callback(null, result.code, result.map.toString())*/
}

module.exports = transform;
