import './polyfills';

import { load as JSONfromYml } from 'js-yaml';
import { readFileSync, existsSync } from 'fs';
import sintez from './sintez-config';

import { resolve, join } from 'path';
import gulpUtil from 'gulp-util';
import getter from 'lodash/object/get';

import Resources from './components/resoruces';
import Webpack from './components/webpack';

var local = {
  config: Symbol('config'),
  resources: Symbol('resources'),
  webpack: Symbol('webpack')
};

export default class Environment {
  constructor(config) {
    var validation = Environment.validate(config);

    if (!validation.isValid) {
      throw new Error(`Environment config is not valid`);
    }

    this[local.config] = {};
    Object.assign(this[local.config], config);
  }

  static fromPath(configPath) {
    if (!configPath) {
      configPath = Environment.getConfigPath();
    }

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

  static getConfigPath() {
    var name = sintez.get('env-configs.default-name');
    var cliConfigName = argv[sintez.get('env-configs.cli-arg')];

    if (cliConfigName) {
      name = cliConfigName;
    }

    var relativeConfigPath = join(sintez.get('env-configs.dir'), name + '.yml');
    return resolve(relativeConfigPath);
  }

  static validate(config) {
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
    var dest = this.get('dest');
    return resolve(dest);
  }

  getSrc() {
    var src = this.get('src');
    return resolve(src);
  }

  getResources() {
    if (!this[local.resources]) {
      var src = this.get('src');
      var dest = this.get('dest');
      var resourcesConfig = this.get('resources') || {};

      this[local.resources] = new Resources(src, dest, resourcesConfig);
    }

    return this[local.resources];
  }

  getWebpack() {
    if (!this[local.webpack]) {
      var webpackConfig = this.get('webpack');
      this[local.webpack] = new Webpack(this, webpackConfig);
    }

    return this[local.webpack];
  }
}
