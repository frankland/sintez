import { join } from 'path';

import WebpackBuilder from  '../builders/webpack/webpack-builder';

var local = {
  config: Symbol('config'),
  builder: Symbol('builder'),
  //instance: Symbol('builder-instance')
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

  getOutputScripts() {
    var config = this[local.config];

    var output = config.output;
    var entry = config.entry;

    var outputScripts = null;

    if (output) {
      outputScripts = [output];
    } else {
      outputScripts = Object.keys(entry).map(entry => entry + '.js');
    }

    return outputScripts.map(sciprt => join('/', sciprt));
  }

  getApplicationBuilder() {
    return this[local.builder];
  }

  run(cb) {
    this.getApplicationBuilder().run(cb);
  }
}
