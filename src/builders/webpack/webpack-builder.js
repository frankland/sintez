import { join, resolve as res } from '../../utils/path';

import isArray from 'lodash/lang/isArray';
import Webpack from 'webpack';
import WebpackLogPlugin from './plugins/webpack-log-plugin';
import WebpackSplitByPathPlugin from './plugins/webpack-split-plugin';

import CommonsChunkPlugin from 'webpack/lib/optimize/CommonsChunkPlugin';

import BaseBuilder from '../base-builder';

import LoadersConverter from './converters/loaders';
import OutputConverter from './converters/output';
import ResolveConverter from './converters/resolve';
import OptimizeConverter from './converters/optimize';

import EntryConverter from './converters/entry';

var local = {
  processedConfig: Symbol('processed'),
  instance: Symbol('instance')
};

export default class WebpackBuilder extends BaseBuilder {
  createConfig(customConfig) {
    customConfig = customConfig || {};
    var src = this.config.src;
    var dest = this.config.dest;

    var debug = !!this.config.debug;
    var bail = debug;
    var devtool = this.config.devtool;
    var target = this.config.target;

    var experimental = this.config.experimental;

    var js = this.config.js;
    var jsSource = js.getSrc();
    var jsOutput = js.getOriginalDest();
    //var jsOutputFilename = js.getDestName();

    var entryConverter = new EntryConverter(src, dest);
    var entry = entryConverter.getConfig(jsSource, jsOutput);
    var loadersConverter = new LoadersConverter(src, dest);
    var loaders = loadersConverter.getConfig(this.config.loaders, experimental);

    var outputConverter = new OutputConverter(src, dest);
    var output = outputConverter.getConfig(customConfig.output);

    var resolveConverter = new ResolveConverter(src, dest);
    var resolve = resolveConverter.getConfig(this.config.alias, this.config.resolve);

    // plugins
    var optimizeConverter = new OptimizeConverter(src, dest);
    var optimize = optimizeConverter.getConfig(false);

    var config = {
      bail,
      devtool,
      target,
      output,
      debug,
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

    var split = js.getOptions('split');

    if (split) {
      var relativeTarget = js.getRelativeTarget();
      var splitConfig = [];
      for (var name of Object.keys(split)) {
        splitConfig.push({
          name: join(relativeTarget, name),
          path: split[name]
        });
      }
      var splitPlugin = new WebpackSplitByPathPlugin(splitConfig);
      config.plugins.push(splitPlugin);
    }

    return config;
  }

  createInstance() {
    var config = this.createConfig();
    return Webpack(config);
  }

  getConfig(customConfig) {
    if (!this[local.processedConfig]) {
      this[local.processedConfig] = this.createConfig(customConfig);
    }

    return this[local.processedConfig];
  }

  getWebpackInstance(customConfig) {
    if (!this[local.instance]) {
      var config = this.getConfig(customConfig);
      this[local.instance] = Webpack(config);
    }

    return this[local.instance];
  }

  run(cb) {
    var instance = this.getWebpackInstance();
    instance.run(cb);
  }
}


