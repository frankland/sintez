import '../utils/polyfills';

import { load as JSONfromYml } from 'js-yaml';
import { readFileSync, existsSync } from 'fs';
import { resolve, join, dirname } from 'path';

import getter from 'lodash/object/get';
import merge from 'lodash/object/merge';

import Resources from './resoruces';
import Builder from './builder';

var local = {
  config: Symbol('config'),
  resources: Symbol('resources'),
  builder: Symbol('builder')
};


function getDefaults(src, dest) {
  return {
    'server.application': 'webpack-server',
    'server.port': 9001,
    'server.livereload': 'localhost',
    'server.host': 35729,

    'entry.js/index-build': join(src, '/index.js'),

    //'output': 'index-build.js',

    'builder': 'webpack',
    //'chunks': false,

    //'builder.include.loaders': ['es6', 'yml', 'html', 'json'],
    //'builder.include.transpilers': ['es6'],

    'loaders.babel': join(src, '/**/*.js'),
    'loaders.yml': '.yml$',
    'loaders.html': '.html$',
    'loaders.json': '.json$'
  };
}

export default class Sintez {
  constructor(config) {
    var validation = this.validate(config);

    if (!validation.isValid) {
      throw new Error(`Invalid sintez config. ${validation.errors.join(', ')}`);
    }

    var defaultConfig = getDefaults(config.src, config.dest);
    this[local.config] = Object.assign({}, defaultConfig, config);
  }

  static loadYml(configPath) {
    if (!existsSync(configPath)) {
      throw new Error(`Sintez config "${configPath}" does not exist"`);
    }

    if (!existsSync(configPath)) {
      throw new Error(`Sintez config "${configPath}" does not exist"`);
    }

    var configYml = readFileSync(configPath);

    var config = JSONfromYml(configYml);

    if (config.extend) {
      var currentDir = dirname(configPath);
      var parentConfigPath = join(currentDir, config.extend);

      var parentConfig = Sintez.loadYml(parentConfigPath);

      config = merge(parentConfig, config);
    }

    return config;
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

  getResources() {
    if (!this[local.resources]) {
      var src = this.getSrc();
      var dest = this.getDest();
      var resourcesConfig = this.get('resources');

      this[local.resources] =  new Resources(src, dest, resourcesConfig);
    }

    return this[local.resources];
  }

  getBuilder() {
    if (!this[local.builder]) {
      this[local.builder] = new Builder({
        builder: this.get('builder'),
        src: this.getSrc(),
        dest: this.getDest(),
        output: this.get('output'),
        entry: this.get('entry'),
        loaders:  this.get('loaders'),
        //chunks: this.get('chunks'),
        aliases: this.get('aliases'),
        resolve: this.get('resolve')
      });
    }

    return this[local.builder];
  }

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
}
