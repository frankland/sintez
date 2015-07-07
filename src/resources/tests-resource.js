import isArray from 'lodash/lang/isArray';

import { join, resolve, relative } from '../utils/path';

import JsResource from './js-resource';

var local = {
  dest: Symbol('test-dest')
};

export default class TestsResource extends JsResource {
  constructor(src, dest, key, config) {
    var testDest = join(dest, 'tests');

    var options = config.options || {};
    var environment = options.environment;

    var testSrc = null;
    if (isArray(config.src)) {
      testSrc = config.src;
    } else {
      testSrc = [config.src];
    }

    var absSrc = resolve(src);
    testSrc = testSrc.map((path) => {
      return relative(absSrc, resolve('tests', path));
    });

    if (environment) {
      if (isArray(environment)) {
        testSrc = environment.concat(testSrc);
      } else {
        testSrc = testSrc.unshift(environment);
      }
    }

    super(src, testDest, key, {
      src: testSrc,
      dest: 'tests-build.js',
      options: config.options
    });

    this[local.dest] = testDest;
  }

  getTestDest() {
    return this[local.dest];
  }
}
