import isObject from 'lodash/lang/isObject';
import isArray from 'lodash/lang/isArray';

import merge from 'lodash/object/merge';

export default class Loaders {
  static validate(loaders) {
    return {
      isValid: true,
      errors: []
    }
  }

  // :S
  static convert(resolve) {
    var resolvePlugin = null;

    if (isObject(resolve)) {
      resolvePlugin = resolve;
    }

    return resolvePlugin;
  }
}
