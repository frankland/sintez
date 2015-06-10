import isObject from 'lodash/lang/isObject';
import ProvidePlugin from 'webpack/lib/ProvidePlugin';

export default class Shim {
  static validate(shim) {
    return {
      isValid: true,
      errors: []
    }
  }

  static convert(shim) {
    var shimPlugin = null;
    if (isObject(shim)) {
      shimPlugin = new ProvidePlugin(shim);
    }

    return shimPlugin;
  }
}
