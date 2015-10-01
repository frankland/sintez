import '../utils/polyfills';

import { load as JSONfromYml } from 'js-yaml';
import { readFileSync, existsSync } from 'fs';
import { resolve, join, dirname } from '../utils/path';

import ObjectDescription from 'object-description';

import getter from 'lodash/object/get';
import merge from 'lodash/object/merge';
import isArray from 'lodash/lang/isArray';
import isObject from 'lodash/lang/isObject';
import cloneDeep from 'lodash/lang/cloneDeep';

import Resources from './resoruces';
import Builder from './builder';
import Server from './server';
import Mocha from './mocha';


function getOrderedUrls(original, resources) {
  var urls = [];
  var originalResource = resources.get(original);
  var order = originalResource.getOptions('order');

  if (order) {
    for (var item of order) {
      var url = null;
      if (item[0] == '^') {
        var dependency = item.slice(1);
        var resource = resources.get(dependency);
        url = resource.getUrl();
      } else {
        url = item;
      }

      if (isArray(url)) {
        urls = urls.concat(url);
      } else {
        urls.push(url);
      }
    }
  } else {
    urls = originalResource.getUrl();
  }

  return urls;
}


function getDefaults(src, dest) {
  return ObjectDescription.create({
    'src': src,
    'dest': dest,
    'experimental': false,
    'source-maps': true,
    'builder': 'webpack',
    'debug': false,
    'loaders.babel': [
      join(src, '.+\.js$'),
      resolve('tests', '.+\.js$')
    ],
    'loaders.yaml': [
      join(src, '.+\.yml$')
    ],
    'loaders.html': [
      join(src, '.+\.html$')
    ],
    'loaders.json': [
      join(src, '.+\.json$')
    ],
    'loaders.jade': [
      join(src, '.+\.jade')
    ],
    'target': 'web',
    'devtool': 'eval',
    'server': 'webpack',
    'host': 'localhost',
    'port': 9001,
    'livereload': 35729
  });
}

function normalizeConfig(config) {
  var normalized = cloneDeep(config);
  var loaders = normalized.loaders;
  if (loaders) {
    var normalizedLoaders = {};
    for (var loader of Object.keys(loaders)) {
      if (!isArray(loaders[loader])) {
        normalizedLoaders[loader] = [loaders[loader]];
      } else {
        normalizedLoaders[loader] = loaders[loader];
      }
    }

    normalized.loaders = normalizedLoaders;
  }

  return normalized;
}

var local = {
  config: Symbol('config'),
  resources: Symbol('resources'),
  builder: Symbol('builder'),
  tests: Symbol('tests')
};

export default class Sintez {
  constructor(config) {
    var validation = this.validate(config);

    if (!validation.isValid) {
      throw new Error(`Invalid sintez config. ${validation.errors.join(', ')}`);
    }

    var defaultConfig = getDefaults(config.src, config.dest);
    this[local.config] = merge(defaultConfig, config);
  }

  static loadYml(configPath) {
    if (!existsSync(configPath)) {
      throw new Error(`Sintez config "${configPath}" does not exist"`);
    }

    var configYml = readFileSync(configPath);

    var config = JSONfromYml(configYml);
    var normalized = normalizeConfig(config);

    if (normalized.extend) {
      var currentDir = dirname(configPath);
      var parentConfigPath = join(currentDir, normalized.extend);

      var parentConfig = Sintez.loadYml(parentConfigPath);

      normalized = merge(parentConfig, normalized);
    }

    return normalized;
  }

  static fromPath(configPath) {

    var config = Sintez.loadYml(configPath);

    return new Sintez(config);
  }

  validate(config) {
    var errors = [];
    if (!config.src) {
      errors.push('"src" is not defined');
    }

    if (!config.dest) {
      errors.push('"dest" is not defined');
    }

    return {
      isValid: !errors.length,
      errors: errors
    }
  }

  getConfig() {
    return this[local.config];
  }

  addResource(key, resource) {

  }

  createResources(customOptions = {}) {
    var src = this.getSrc();
    var dest = this.getDest();
    var resourcesConfig = this.get('resources');

    var config = Object.assign({} , resourcesConfig, customOptions);
    return new Resources(src, dest, config);
  }

  getResources() {
    if (!this[local.resources]) {
      this[local.resources] =  this.createResources();
    }

    return this[local.resources];
  }

  createBuilder(customOptions = {}) {
    var resources = this.getResources();
    var js = resources.get('js');

    var configOptions = {
      builder: this.get('builder'),
      src: this.getSrc(),
      dest: this.getDest(),
      experimental: this.get('experimental'),
      js,
      //output: js.getOriginalDest(),
      //entry: js.getOriginalSrc(),
      debug: this.get('debug'),
      loaders: this.get('loaders'),

      devtool: this.get('devtool'),

      alias: this.get('alias'),
      shim: this.get('shim'),
      resolve: this.get('resolve')
    };

    var options = Object.assign({}, configOptions, customOptions);

    return new Builder(options);
  }

  getBuilder() {
    if (!this[local.builder]) {
      this[local.builder] = this.createBuilder();
    }

    return this[local.builder];
  }

  createServer(customOptions = {}) {
    var resources = this.getResources();
    var index = resources.get('index');

    var configOptions = {
      builder: this.getBuilder(),
      server: this.get('server'),

      src: this.getSrc(),
      dest: this.getDest(),

      host: this.get('host'),
      port: this.get('port'),

      index: index.getDest()
    };

    var options = Object.assign({}, configOptions, customOptions);

    return new Server(options);
  }

  getServer() {
    if (!this[local.server]) {
      this[local.server] = this.createServer();
    }

    return this[local.server];
  }

  getTests() {
    if (!this[local.tests]) {
      var resources = this.getResources();
      var tests = resources.get('tests');

      var src = this.getSrc();
      var dest = this.getDest();

      this[local.tests] = new Mocha(src, dest, tests);
    }

    return this[local.tests];
  }

  // --------------------------------

  get(key) {
    return getter(this[local.config], key);
  }

  has(key) {
    return !!this.get(key);
  }

  getDest() {
    return this.get('dest');
  }

  getSrc() {
    return this.get('src');
  }

  // ------------ OUTPUT --------------

  getOutputScripts() {
    var resources = this.getResources();
    var output = null;

    if (resources.has('js')) {
      output = getOrderedUrls('js', resources);
    }


    return isArray(output) ? output : [output];
  }

  getOutputStyles() {
    var resources = this.getResources();
    var output = null;

    if (resources.has('css')) {
      output = getOrderedUrls('css', resources);
    }

    return isArray(output) ? output : [output];
  }
}
