import { join, resolve, isAbsolute, dirname, basename, sep } from 'path';
import template from 'lodash.template';
import some from 'lodash.some';
import { requireModule } from '../../executor';

var FS_MODULE_NAME = 'fs';
var DEFAULT_CONFIG_NAMES = ['webpack.config.js', 'webpack.config.babel.js'];

// most of this file is a copypaste from https://github.com/trayio/babel-plugin-webpack-alias/blob/master/src/index.js
// just cos we emulate its behavior

function fileExists(path) {
  if (typeof __webpack_modules__ !== 'undefined') {
    return __webpack_modules__['.' + path] && '.' + path;
  }
  try {
    var fs = require(FS_MODULE_NAME);
    return !fs.accessSync(path, fs.F_OK) && path;
  } catch (e) {
    return false;
  }
}

function getConfigPath(configPaths) {
  var conf = null;

  // Try all config paths and return for the first found one
  some(configPaths, function (configPath) {
    if (!configPath) return;

    // Compile config using environment variables
    var compiledConfigPath = template(configPath)(process.env);

    var resolvedConfigPath = resolve(process.cwd(), compiledConfigPath);
    var resolvedName = fileExists(resolvedConfigPath);

    if (resolvedConfigPath && resolvedName) {
      conf = resolvedName;
    }

    return conf;
  });

  return conf;
}

function readAliases(configPath) {
  var configPaths = configPath ? [configPath].concat(DEFAULT_CONFIG_NAMES) : DEFAULT_CONFIG_NAMES;

  // Get webpack config
  var confPath = getConfigPath(configPaths);

  // If the config comes back as null, we didn't find it, so throw an exception.
  if (!confPath) {
    throw new Error('Cannot find any of these configuration files: ' + configPaths.join(', '));
  }

  // Require the config
  var conf = requireModule(confPath);

  if (conf && conf.__esModule && conf.default) {
    conf = conf.default;
  }

  // exit if there's no alias config and the config is not an array
  if (!(conf.resolve && conf.resolve.alias) && !Array.isArray(conf)) {
    throw new Error('The resolved config file doesn\'t contain a resolve configuration');
  }

  // Get the webpack alias config
  var aliasConf = void 0;
  var extensionsConf = void 0;

  if (Array.isArray(conf)) {
    // the exported webpack config is an array ...
    // (i.e., the project is using webpack's multicompile feature) ...

    // reduce the configs to a single alias object
    aliasConf = conf.reduce(function (prev, curr) {
      var next = Object.assign({}, prev);
      if (curr.resolve && curr.resolve.alias) {
        Object.assign(next, curr.resolve.alias);
      }
      return next;
    }, {});

    // if the object is empty, bail
    if (!Object.keys(aliasConf).length) {
      return;
    }

    // reduce the configs to a single extensions array
    extensionsConf = conf.reduce(function (prev, curr) {
      var next = [].concat(prev);
      if (curr.resolve && curr.resolve.extensions && curr.resolve.extensions.length) {
        curr.resolve.extensions.forEach(function (ext) {
          if (next.indexOf(ext) === -1) {
            next.push(ext);
          }
        });
      }
      return next;
    }, []);

    if (!extensionsConf.length) {
      extensionsConf = null;
    }
  } else {
    // the exported webpack config is a single object...

    // use it's resolve.alias property
    aliasConf = conf.resolve.alias;

    // use it's resolve.extensions property, if available
    extensionsConf = conf.resolve.extensions && conf.resolve.extensions.length ? conf.resolve.extensions : null;
  }

  if (typeof __webpack_modules__ !== 'undefined') Object.keys(aliasConf).forEach(function (alias) {
    var location = aliasConf[alias];
    if (!__webpack_modules__[location]) {
      aliasConf[alias] = '.' + resolve(dirname(confPath), '.' + location);
    }
  });

  return {
    aliasConf: aliasConf,
    extensionsConf: extensionsConf
  };
}

function processFile(filePath, _ref) {
  var aliasConf = _ref.aliasConf,
      extensionsConf = _ref.extensionsConf;

  for (var aliasFrom in aliasConf) {
    if (aliasConf.hasOwnProperty(aliasFrom)) {

      var aliasTo = aliasConf[aliasFrom];
      var regex = new RegExp('^' + aliasFrom + '(/|$)');

      // If the regex matches, replace by the right config
      if (regex.test(filePath)) {

        // notModuleRegExp from https://github.com/webpack/enhanced-resolve/blob/master/lib/Resolver.js
        var notModuleRegExp = /^\.$|^\.[\\\/]|^\.\.$|^\.\.[\/\\]|^\/|^[A-Z]:[\\\/]/i;
        var isModule = !notModuleRegExp.test(aliasTo);

        if (isModule) {
          return aliasTo;
        }

        // If the filepath is not absolute, make it absolute
        if (!isAbsolute(aliasTo)) {
          aliasTo = join(process.cwd(), aliasTo);
        }
        var relativeFilePath = resolve(dirname(filePath), aliasTo).split(sep).join('/');

        // In case the file path is the root of the alias, need to put a dot to avoid having an absolute path
        if (relativeFilePath.length === 0) {
          relativeFilePath = '.';
        }

        var requiredFilePath = filePath.replace(aliasFrom, relativeFilePath);

        // In the unfortunate case of a file requiring the current directory which is the alias, we need to add
        // an extra slash
        if (requiredFilePath === '.') {
          requiredFilePath = './';
        }

        // In the case of a file requiring a child directory of the current directory, we need to add a dot slash
        if (['.', '/'].indexOf(requiredFilePath[0]) === -1) {
          requiredFilePath = './' + requiredFilePath;
        }

        // In case the extension option is passed
        if (extensionsConf) {
          (function () {
            // Get an absolute path to the file
            var absoluteRequire = join(aliasTo, basename(filePath));

            var extension = null;
            some(extensionsConf, function (ext) {
              if (!ext) return;

              // If the file with this extension exists set it
              if (fileExists(absoluteRequire + ext)) {
                extension = ext;
              }

              return extension;
            });

            // Set the extension to the file path, or keep the original one
            requiredFilePath += extension || '';
          })();
        }

        return requiredFilePath;
      }
    }
  }
}

export { readAliases, processFile };