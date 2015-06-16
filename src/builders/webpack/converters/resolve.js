import isEmpty from 'lodash/lang/isEmpty';
import isObject from 'lodash/lang/isObject';
import isArray from 'lodash/lang/isArray';

import BaseConverter from '../base-converter';


export default class ResolveCoverter extends BaseConverter {

  getConfig(alias, resolve) {
    var config = null;

    if (!isEmpty(alias) && isObject(alias)) {
      config = config || {};
      config.alias = alias;
    }

    if (!isEmpty(resolve) && isArray(resolve)) {
      config = config || {};
      config.modulesDirectories = resolve;
    }

    return config;
  }
}
