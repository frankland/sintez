import { join } from '../utils/path';
import { sync as globSync } from 'glob';

import isArray from 'lodash/lang/isArray';

import BaseResource from './base-resource';

//var getCaller = () => {
//  var traceFn = Error.prepareStackTrace;
//  Error.prepareStackTrace = (err, stack) => {
//    return stack;
//  };
//
//  var stack = (new Error()).stack;
//  Error.prepareStackTrace = traceFn;
//  return stack[2].getFileName();
//};

var collectScripts = (src, paths) => {
  if (!isArray(paths)) {
    paths = [paths];
  }

  var scripts = [];
  for (var path of paths) {
    var modulePath = join(src, path);
    var collected = globSync(modulePath, {
      nosort: true
    });

    if (collected.length) {
      var processedScripts = collected.map((script) => './' + script);
      scripts = scripts.concat(processedScripts);
    } else {
      try {
        /**
         * Workaround for dev. step when using npm link this package
         */
        scripts.push(path);

        //var resolved = require.resolve(path);
        //scripts.push(resolved);
      } catch (e) {
        throw new Error(e.message);
      }
    }
  }


  return scripts;
};

export default class JsResoruce extends BaseResource {
  getSrc() {
    var originalSrc = this.getOriginalSrc();
    var src = this.getApplicationSrc();

    var resourceSrc = null;
    if (isArray(originalSrc)) {
      resourceSrc = originalSrc;
    } else {
      resourceSrc = [originalSrc];
    }

    var scripts = [];
    for (var path of resourceSrc) {
      var collected = collectScripts(src, path);
      scripts = scripts.concat(collected);
    }

    return scripts;
  }

  getUrl() {
    var url = super.getUrl();
    var split = this.getOptions('split');

    var urls = [];
    if (split) {
      var target = this.getRelativeTarget();
      for (var name of Object.keys(split)) {
        urls.push('/' + join(target, name + '.js'));
      }
    }
    urls.push(url);


    return urls;
  }
}
