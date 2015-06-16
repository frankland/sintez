import { sync as globSync } from 'glob';
import { join } from '../../../utils/path';
import isArray from 'lodash/lang/isArray';

import BaseConverter from '../base-converter';


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

    if (collected.length) {
      var processedScripts = collected.map((script) => './' + script);
      scripts = scripts.concat(processedScripts);
    } else {
      //console.log(`files not found "${srcPath}"`);
      //console.log(`will be added as resolve dependency "${path}"`);

      scripts.push(path);
    }
  }

  return scripts;
};

export default class EntryConverter extends BaseConverter {
  getConfig(entry, output) {
    var scripts = {};

    var outputEntry = null;
    if (output) {
      outputEntry = output.replace(/\.js$/, '');
      scripts[outputEntry] = [];
    }


    for (var name of Object.keys(entry)) {
      var collected = collectScripts(this.src, entry[name]);

      if (output) {
        scripts[outputEntry] = scripts[outputEntry].concat(collected);
      } else {
        scripts[name] = collected;
      }
    }

    return scripts;
  }
}
