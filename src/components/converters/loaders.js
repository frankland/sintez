import isArray from 'lodash/lang/isArray';

import { sep } from '../../utils/helpers';


export default class Loaders {
  static validate() {
    return {
      isValid: true,
      errors: []
    }
  }

  static convert(loaders) {
    var converted = null;

    if (isArray(loaders)) {
      converted = [];

      for (var loader of loaders) {
        var test = loader.test.replace(/\//g, sep);

        var webpackLoader = {
          test: new RegExp(test),
          loader: loader.loader
        };

        if (loader.hasOwnProperty('query')) {
          webpackLoader.query = loader.query;
        }

        converted.push(webpackLoader);
      }
    }

    return converted;
  }
}
