const {relative} = require("path");
const {ConcatSource} = require("webpack-sources");

const normalizePath = a => a[0] === '.' ? a : './' + a;

const file = normalizePath(relative(process.cwd(), __dirname + '/src/interceptor.js').replace(/\\/g, '/'));

const injectString = `/***/if(typeof __webpack_require__!=='undefined') {
   try {
     var rewiremockInterceptor = __webpack_require__('${file}');

     if (rewiremockInterceptor && rewiremockInterceptor.default) {
       __webpack_require__ = rewiremockInterceptor.default(__webpack_require__, module);
     }
   } catch (e) {}
}
`;

class RewiremockPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('RewiremockPlugin', function (compilation) {

      compilation.moduleTemplates.javascript.hooks.render.tap('RewiremockPlugin', function (moduleSource) {
        const source = new ConcatSource();
        const src = moduleSource.source();
        // and injection
        if (src.indexOf('require') > 0) {
          source.add(injectString);
        }
        // re-hoists mocks
        const firstImport = src.indexOf('/* harmony import');
        if (src.indexOf('rwrmck') > 0 && firstImport > 0) {
          const match = src.match(/\(function rwrmck\(([\s\S]*)rwrmck'\);/g);
          if (match && match.length) {
            moduleSource = [
              src.substr(0, firstImport),
              match[0],
              src.substr(firstImport).replace(match[0], '')
            ].join('');
          }
          source.add(moduleSource);
        } else {
          source.add(moduleSource);
        }
        return source;
      });
    });
  }
}

module.exports = RewiremockPlugin;
