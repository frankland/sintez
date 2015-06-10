import { join, resolve as res } from 'path';

import Webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import cloneDeep from 'lodash/lang/cloneDeep';

import WebpackServer from './webpack-server';

import sintez from '../sintez-config';

import Loaders from './converters/loaders';
import Entry from './converters/entry';
import Shim from './converters/shim';
import Optimize from './converters/optimize';
import Chunks from './converters/chunks';
import Output from './converters/output';
import Resolve from './converters/resolve';

import WebpackLogPlugin from './webpack-log-plugin';

var local = {
  initialConfig: Symbol('initial-config'),
  processedConfig: Symbol('processed-config'),
  instance: Symbol('webpack-instance'),
  src: Symbol('src'),
  dest: Symbol('dest'),
  env: Symbol('environmnet')
};


export default class SintezWebpack {
  constructor(env, webpackConfig) {
    var validation = SintezWebpack.validate(webpackConfig);

    if (!validation.isValid) {
      throw new Error(`Webpack config is not valid`);
    }

    this[local.initialConfig] = webpackConfig;
    this[local.src] = env.get('src');
    this[local.dest] = env.get('dest');

    this[local.env] = env;
  }

  static validate(config) {
    // TODO:
    return {
      isValid: true,
      errors: []
    }
  }

  createConfig() {
    var webpackConfig = this[local.initialConfig];

    var src = this[local.src];
    var dest = this[local.dest];

    var bail = false;
    var devtool = 'source-map';
    //var context = res('.');

    var entry = Entry.convert(src, webpackConfig.entry);
    var loaders = Loaders.convert(webpackConfig.loaders);
    var output = Output.convert(dest, webpackConfig.output, webpackConfig.chunks, entry);
    var resolve = Resolve.convert(webpackConfig.resolve);

    // plugins
    var optimize = Optimize.convert(webpackConfig.optimize);
    var shim = Shim.convert(webpackConfig.shim);
    var chunks = Chunks.convert(webpackConfig.chunks, webpackConfig.entry);

    var config  = {
      //context,
      bail,
      devtool,
      output,
      plugins: [],
      module: {}
    };

    if (resolve) {
      config.resolve = entry;
    }

    if (entry) {
      config.entry = entry;
    }

    if (loaders) {
      config.module.loaders = loaders;
    }

    if (shim) {
      config.plugins.push(shim);
    }

    if (chunks) {
      config.plugins.push(chunks);

      //var chunkManifest = Chunks.getChunkManifest();
      //config.plugins.push(chunkManifest);
    }

    if (optimize) {
      config.plugins.push(optimize);
    }

    /**
     * console log Plugin. apply "done" and "invalid"
     */
    config.plugins.push(new WebpackLogPlugin());

    return config;
  }

  createInstance() {
    var config = this.createConfig();
    return Webpack(config);
  }

  getInstance() {
    if (!this[local.instance]) {
      this[local.instance] = this.createInstance();
    }

    return this[local.instance];
  }

  getInitialConfig() {
    return cloneDeep(this[local.initialConfig]);
  }

  getServer() {
    var env = this[local.env];
    var instance = this.createInstance();

    return new WebpackServer(env, instance);
  }


  getOutputScripts() {
    return 'NOTHING!!11';
  }
}
