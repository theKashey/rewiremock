const {relative} = require("path");
const {ConcatSource} = require("webpack-sources");

const file = './' + relative(process.cwd(), __dirname + '/interceptor.js');

const injectString = "/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('" + file + "')(__webpack_require__, module);}\n";

class RewiremockPlugin {
  apply(compiler) {
    compiler.plugin('compilation', function (compilation) {

      compilation.moduleTemplate.plugin("render", function (moduleSource) {
        const source = new ConcatSource();
        source.add(injectString);
        source.add(moduleSource);
        return source;
      });
    });
  }
};

module.exports = RewiremockPlugin;