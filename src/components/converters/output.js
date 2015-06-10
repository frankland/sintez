import isArray from 'lodash/lang/isArray';
import { join, resolve } from 'path';

export default class Output {
  static validate(entries) {
    return {
      isValid: true,
      errors: []
    }
  }

  static convert(dest, output, chunks, entry) {
    var path = output || '';

    var filename = null;
    if (chunks && !isArray(entry)) {
      filename = '[name].js';
    } else {
      filename = 'build.js';
    }

    return {
      path: resolve(dest, path),
      filename: filename,
      urlBase: join('/', path)
    };
  }
}
