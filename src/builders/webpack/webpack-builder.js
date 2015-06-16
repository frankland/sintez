import { join, resolve as res } from 'path';

import Webpack from 'webpack';
import WebpackLogPlugin from './plugins/webpack-log-plugin';
import WebpackSplitPlugin from './plugins/webpack-split-plugin';
import CommonsChunkPlugin from 'webpack/lib/optimize/CommonsChunkPlugin';
//import SplitByNamePlugin from 'split-by-name-webpack-plugin';


import BaseBuilder from '../base-builder';

import LoadersConverter from './converters/loaders';
import OutputConverter from './converters/output';
import ResolveConverter from './converters/resolve';
import ChunksConverter from './converters/chunks';
import OptimizeConverter from './converters/optimize';

import EntryConverter from './converters/entry';

var local = {
  processedConfig: Symbol('processed'),
  instance: Symbol('instance')
};

export default class WebpackBuilder extends BaseBuilder {
  createConfig() {
    var src = this.config.src;
    var dest = this.config.dest;

    var bail = false;
    var devtool = 'source-map';

    var entryConverter = new EntryConverter(src, dest);
    var entry = entryConverter.getConfig(this.config.entry, this.config.output);

    var loadersConverter = new LoadersConverter(src, dest);
    var loaders = loadersConverter.getConfig(this.config.loaders);

    var outputConverter = new OutputConverter(src, dest);
    var output = outputConverter.getConfig(this.config.output);

    var resolveConverter = new ResolveConverter(src, dest);
    var resolve = resolveConverter.getConfig(this.config.aliases, this.config.resolve);

    // plugins
    var optimizeConverter = new OptimizeConverter(src, dest);
    var optimize = optimizeConverter.getConfig(false);

    var chunksConverter = new ChunksConverter(src, dest);
    var chunks = chunksConverter.getConfig(this.config.entry, this.config.output);

    var config = {
      bail,
      devtool,
      output,
      plugins: [],
      module: {}
    };

    if (resolve) {
      config.resolve = resolve;
    }

    if (entry) {
      config.entry = entry;
    }

    if (loaders) {
      config.module.loaders = loaders;
    }

    if (chunks) {
      config.plugins.push(chunks);

      //var chunkManifest = chunksConverter.getChunkManifest();
      //config.plugins.push(chunkManifest);
    }

    if (optimize) {
      config.plugins.push(optimize);
    }

    /**
     * console log Plugin. apply "done" and "invalid"
     */
    var logPlugin = new WebpackLogPlugin((event, params) => {
      this.emit(event, params);
    });

    config.plugins.push(logPlugin);

    return config;
  }

  createInstance() {
    var config = this.createConfig();
    return Webpack(config);
  }

  getConfig() {
    if (!this[local.processedConfig]) {
      this[local.processedConfig] = this.createConfig();
    }

    return this[local.processedConfig];
  }

  getWebpackInstance() {
    if (!this[local.instance]) {
      var config = this.getConfig();
      this[local.instance] = Webpack(config);
    }

    return this[local.instance];
  }

  run(cb) {
    var instance = this.getWebpackInstance();
    instance.run(cb);
  }
}


