import isArray from 'lodash/lang/isArray';
import { join, resolve } from 'path';

var buildName = 'build.js';

export default class Output {
  static validate(entries) {
    return {
      isValid: true,
      errors: []
    }
  }

  static getOutputPath(output) {
    return join('/', output || '');
  }

  static getScripts(output, chunks, entries) {
    var scripts = [];
    var path = Output.getOutputPath(output);

    if (chunks && !isArray(entries)) {
      scripts = Object.keys(entries).map((script) => {
        return join('/' + path, script + '.js');
      });
    } else {
      scripts.push(join('/', buildName));
    }

    return scripts;
  }

  static convert(dest, output, chunks, entry) {
    var path = Output.getOutputPath(output);

    var filename = null;
    if (chunks && !isArray(entry)) {
      filename = '[name].js';
    } else {
      filename = buildName;
    }

    return {
      path: resolve(dest, path),
      filename: filename
    };
  }
}
