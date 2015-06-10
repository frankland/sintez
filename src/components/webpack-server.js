import { server as logger } from './log';

import { resolve } from 'path';

import gutil from 'gulp-util';

import WebpackDevServer from 'webpack-dev-server';

import isFunction from 'lodash/lang/isFunction';
import cloneDeep from 'lodash/lang/cloneDeep';
import Webpack from 'webpack';

import { join, resolve as res } from 'path';

import sintez from '../sintez-config';

var local = {
  server: Symbol('webpack-server'),
  env: Symbol('environmnet'),
  config: Symbol('config')
};


export default class SintezWebpackServer {
  constructor(env, webpack) {
    this[local.env] = env;
    this[local.config] = this.getConfig();

    this[local.server] = new WebpackDevServer(webpack, this[local.config]);
  }

  getDefaults() {
    var config = sintez.get('webpack');
    return cloneDeep(config);
  }

  getConfig() {
    var def = this.getDefaults();

    var env = this[local.env];
    var webpack = env.getWebpack();
    var publicPath = webpack.getOutputPath();

    var index = this.getIndexPath();

    return Object.assign({}, def, {
      contentBase: env.getDest(),
      publicPath,
      index: index
    });
  }

  express() {
    var server = this[local.server];
    return server.app;
  }

  getIndexPath() {
    var env = this[local.env];
    var resources = env.getResources();

    return resources.getDest('index');
  }

  setupIndexAsEntry() {
    var index = this.getIndexPath();
    var indexFs = resolve(index);

    var express = this.express();
    express.get('*', function(req, res) {
      res.sendFile(indexFs);
    });
  }

  run(cb) {
    var config = this[local.config];
    var server = this[local.server];

    server.listen(config.port, config.host, () => {

      logger.log(`launched at http://${gutil.colors.green(config.host)}:${gutil.colors.green(config.port)}`);

      if (isFunction(cb)) {
        cb();
      }
    });
  }
}
