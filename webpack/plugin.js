const {relative} = require("path");
const {ConcatSource} = require("webpack-sources");

const normalizePath = a => a[0] === '.' ? a : './' + a;

const file = normalizePath(relative(process.cwd(), __dirname + '/interceptor.js').replace(/\\/g, '/'));

const injectString = `/***/if(typeof __webpack_require__!=='undefined') {
   var rewiremockInterceptor = __webpack_require__('${file}');
   if (rewiremockInterceptor && rewiremockInterceptor.default) { 
     __webpack_require__ = rewiremockInterceptor.default(__webpack_require__, module);
   }
}
`;

class RewiremockPlugin {
  apply(compiler) {
    compiler.plugin('compilation', function (compilation) {

      compilation.moduleTemplate.plugin('render', function (moduleSource) {
        const source = new ConcatSource();
        if (moduleSource.source().indexOf('require') > 0) {
            source.add(injectString);
        }
        source.add(moduleSource);
        return source;
      });
    });
  }
};

module.exports = RewiremockPlugin;