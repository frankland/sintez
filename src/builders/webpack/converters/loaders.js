import isArray from 'lodash/lang/isArray';

import { sep } from '../../../utils/helpers';

import BaseConverter from '../base-converter';


var webpackLoaders = new Map();

webpackLoaders.set('babel', 'babel-loader');
webpackLoaders.set('traceur', 'traceur-loader');
webpackLoaders.set('yml', 'yml-loader');
webpackLoaders.set('html', 'html-loader');
webpackLoaders.set('json', 'json-loader');

export default class LoadersConverter extends BaseConverter {
  getConfig(loaders) {
    var converted = [];

    if (loaders) {
      for (var loader of Object.keys(loaders)) {
        if (!webpackLoaders.has(loader)) {
          throw new Error(`Loader "${loader}" doest not exist`);
        }

        var webpackLoader = webpackLoaders.get(loader);
        var pattern = loaders[loader];

        converted.push({
          test: new RegExp(pattern.replace(/(\*|\/|\.)/g, '\\$1')),
          loader: webpackLoader
        })
      }
    }

    return converted;
  }
}