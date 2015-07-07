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

    var index = resolve(__dirname, '../assets/index-tests.html');
    var absSrc = resolve(src);

    var testDest = tests.getTestDest();
    var resources = new Resources(src, testDest, {});

    this[local.index] = resources.create('mocha.index', {
      src: path.relative(absSrc, index),
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
