import path from '../utils/path';
import { resolve } from '../utils/path';

import Resources from '../components/resoruces';

var local = {
  resources: Symbol('resources'),
  css: Symbol('mochaCss'),
  index: Symbol('index'),
  js: Symbol('mochaJs'),
  tests: Symbol('test-scripts')
};

export default class Tests {
  constructor(src, dest, tests) {

    this[local.tests] = tests;

    var testDest = tests.getTestDest();
    var resources = new Resources(src, testDest, {});

    var absSrc = resolve(src);

    var absTestIndex = resolve(__dirname, '../assets/index-tests.html');
    this[local.index] = resources.create('mocha.index', {
      src: path.relative(absSrc, absTestIndex),
      dest: '/index.html'
    });

    var absMochaJs = require.resolve('mocha/mocha.js');
    this[local.js] = resources.create('mocha.js', {
      src: path.relative(absSrc, absMochaJs),
      dest: 'mocha-browser/mocha.js'
    });

    var absMochaCss = require.resolve('mocha/mocha.css');
    this[local.css] = resources.create('mocha.css', {
      src: path.relative(absSrc, absMochaCss),
      dest: 'mocha-browser/mocha.css'
    });
  }

  getConfig() {
    return {
      index: this[local.index],
      css: this[local.css],
      js: this[local.js],
      tests: this[local.tests]
    }
  }
}
