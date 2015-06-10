import isArray from 'lodash/lang/isArray';
import isObject from 'lodash/lang/isObject';
import isEmpty from 'lodash/lang/isEmpty';


import values from 'lodash/object/values';
import flatten from 'lodash/array/flatten';

import { sync as globSync } from 'glob';
import { join } from 'path';


var collectScripts = (src, paths) => {
  if (!isArray(paths)) {
    paths = [paths];
  }

  var scripts = [];
  for (var path of paths) {
    var srcPath = join(src, path);

    var collected = globSync(srcPath, {
      nosort: true
    });

    var processedScripts = collected.map((script) => './' + script);
    scripts = scripts.concat(processedScripts);
  }

  return scripts;
};

export default class Entry {
  static validate(entries) {
    return {
      isValid: true,
      errors: []
    }
  }

  // TODO: hm...
  static convert(src, entries) {
    var collected = null;

    if (!isEmpty(entries)) {
      var list = null;
      var isArrayMode = isArray(entries);

      if (isArrayMode) {
        list = entries.reverse();
      } else {
        list = Object.keys(entries).reverse();
      }

      var scripts = {};
      for (var name of list) {
        var entry = isArrayMode ? name : entries[name];
        scripts[name] = collectScripts(src, entry);
      }

      collected = isArrayMode ? flatten(values(scripts)) : scripts;
    }

    return collected;
  }
}
