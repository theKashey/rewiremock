const ConcatSource = require("webpack-sources").ConcatSource;

const injectString = "/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}\n";

class RewiremockPlugin {
  apply(compiler) {
    compiler.plugin('compilation', function (compilation) {
      compilation.moduleTemplate.plugin("render", function (moduleSource, module) {
        const source = new ConcatSource();
        source.add(injectString);
        source.add(moduleSource);
        return source;
      });
    });
  }
};

module.exports = RewiremockPlugin;