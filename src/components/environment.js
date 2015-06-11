import '../utils/polyfills';

import { load as JSONfromYml } from 'js-yaml';
import { readFileSync, existsSync } from 'fs';

import { resolve, join } from 'path';
import gulpUtil from 'gulp-util';
import getter from 'lodash/object/get';

import Resources from './resoruces';
import Webpack from './webpack';

var local = {
  config: Symbol('config'),
  resources: Symbol('resources'),
  webpack: Symbol('webpack')
};

export default class Environment {
  constructor(config) {
    var validation = this.validate(config);

    if (!validation.isValid) {
      throw new Error(`Environment config is not valid`);
    }

    this[local.config] = {};
    Object.assign(this[local.config], config);
  }

  static fromPath(configPath) {
    if (!existsSync(configPath)) {
      throw new Error(`Environment config "${configPath}" does not exist"`);
    }

    if (!existsSync(configPath)) {
      throw new Error(`Environment config "${configPath}" does not exist"`);
    }

    var configYml = readFileSync(configPath);
    var environmentConfig = JSONfromYml(configYml);

    return new Environment(environmentConfig);
  }

  validate(config) {
    // TODO:
    return {
      isValid: true,
      errors: []
    }
  }

  get(key) {
    return getter(this[local.config], key);
  }

  getDest() {
    return this.get('dest');
  }

  getSrc() {
    return this.get('src');
  }

  getResources() {
    if (!this[local.resources]) {
      var src = this.get('src');
      var dest = this.getDest();
      var resourcesConfig = this.get('resources') || {};

      this[local.resources] = new Resources(src, dest, resourcesConfig);
    }

    return this[local.resources];
  }

  getWebpack() {
    if (!this[local.webpack]) {
      var webpackConfig = this.get('builder');
      this[local.webpack] = new Webpack(this, webpackConfig);
    }

    return this[local.webpack];
  }
}
