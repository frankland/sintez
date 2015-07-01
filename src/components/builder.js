import { join } from '../utils/path';

import WebpackBuilder from  '../builders/webpack/webpack-builder';

var local = {
  config: Symbol('config'),
  builder: Symbol('builder')
};

var builders = new Map();
builders.set('webpack', WebpackBuilder);

export default class Builder {

  constructor(config) {
    this[local.config] = config;
    var builderName = config.builder;

    if (!builders.has(builderName)) {
      throw new Error(`builders "${builderName}" does not registered`);
    }

    var Builder = builders.get(builderName);
    this[local.builder] = new Builder(config);
  }

  getConfig() {
    return this[local.config];
  }


  getApplicationBuilder() {
    return this[local.builder];
  }

  run(cb) {
    this.getApplicationBuilder().run(cb);
  }
}
