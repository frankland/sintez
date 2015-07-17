import isArray from 'lodash/lang/isArray';
import isFunction from 'lodash/lang/isFunction';

import { sep } from '../../../utils/helpers';

import BaseConverter from '../base-converter';


var webpackLoaders = new Map();

webpackLoaders.set('babel', 'babel-loader');
webpackLoaders.set('traceur', 'traceur-loader');
webpackLoaders.set('yaml', 'json-loader!yaml-loader');
webpackLoaders.set('html', 'html-loader');
webpackLoaders.set('json', 'json-loader');
webpackLoaders.set('jade', 'jade-loader');
webpackLoaders.set('script', 'script-loader');
webpackLoaders.set('expose', 'expose-loader');

function getLoaderMethodName(loader) {

  var first = loader.charAt(0).toUpperCase();
  return `get${ first + loader.substr(1).toLowerCase() }Loader`;
}

export default class LoadersConverter extends BaseConverter {

  getBabelLoader(pattern, isExperimental) {
    var webpackLoader = webpackLoaders.get('babel');
    var config = pattern.replace(/\//g, sep).split('?');
    var test = config.shift();

    var query = {};
    if (isExperimental) {
      query = {
        stage: 0
      }
    }

    return {
      test: new RegExp(test),
      loader: webpackLoader,
      query: query
    }
  }

  getLoader(pattern, isExperimental, loader) {
    var webpackLoader = webpackLoaders.get(loader);

    var config = pattern.replace(/\//g, sep).split('?');
    var test = config.shift();
    var query = config.shift();

    return {
      test: new RegExp(test),
      loader: webpackLoader,
      query: query
    }
  }

  getConfig(loaders, isExperimental) {
    var converted = [];
    var defaultLoaderMethod = 'getLoader';

    if (loaders) {
      for (var loader of Object.keys(loaders)) {
        if (!webpackLoaders.has(loader)) {
          throw new Error(`Loader "${loader}" doest not exist`);
        }

        var loaderPattern = loaders[loader];
        var patterns = null;
        if (isArray(loaderPattern)) {
          patterns = loaderPattern;
        } else {
          patterns = [loaderPattern];
        }


        var loaderMethodName = getLoaderMethodName(loader);
        var loaderMethod = this.getLoader;

        if (isFunction(this[loaderMethodName])) {
          loaderMethod = this[loaderMethodName];
        }

        for (var pattern of patterns) {
          var loaderConfig = loaderMethod(pattern, isExperimental, loader);

          converted.push(loaderConfig);
        }
      }
    }

    return converted;
  }
}
