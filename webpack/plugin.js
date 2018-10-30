const {relative} = require("path");
const {ConcatSource} = require("webpack-sources");

const normalizePath = a => a[0] === '.' ? a : './' + a;

const file = normalizePath(relative(process.cwd(), __dirname + '/interceptor.js').replace(/\\/g, '/'));

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
    compiler.plugin('compilation', function (compilation) {

      compilation.moduleTemplate.plugin('render', function (moduleSource) {
        const source = new ConcatSource();
        const src = moduleSource.source();
        // and injection
        if (src.indexOf('require') > 0) {
          source.add(injectString);
        }
        // re-hoists mocks
        if (src.indexOf('rwrmck') > 0 && src.indexOf('harmony import') > 0) {
          const rewirePosition = src.indexOf('/*! rewiremock */');
          const endOfLine = src.indexOf(';', rewirePosition) + 1;
          const match = src.match(/\(function rwrmck\(([\s\S]*)rwrm\+\'\);/g);

          if (match && match.length) {
            moduleSource = [
              src.substr(0, endOfLine),
              match[0],
              src.substr(endOfLine).replace(match[0], '')
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
};

module.exports = RewiremockPlugin;