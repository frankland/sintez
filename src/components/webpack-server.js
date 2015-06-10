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
  instance: Symbol('webpack-instance'),
  server: Symbol('webpack-server'),
  config: Symbol('webpack-server-config'),
  src: Symbol('src'),
  dest: Symbol('dest'),
  env: Symbol('environmnet')
};


export default class SintezWebpackServer {
  constructor(env, webpack) {
    this[local.src] = env.get('src');
    this[local.dest] = env.get('dest');

    this[local.env] = env;

    this[local.instance] = webpack;

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

    var resources = env.getResources();
    var index = resources.getRelativeDest('index');

    return Object.assign({}, def, {
      contentBase: this[local.dest],
      index: index
    });
  }

  express() {
    var server = this[local.server];
    return server.app;
  }

  setupIndexAsEntry() {
    var env = this[local.env];

    var resources = env.getResources();
    var index = resources.getDest('index');
    var indexFs = resolve(index);

    var express = this.express();
    express.get('*', function(req, res) {
      res.sendFile(indexFs);
    });
  }

  run(cb) {
    var config = this[local.config];

    this[local.server].listen(config.port, config.host, () => {

      logger.log(`launched at http://${gutil.colors.green(config.host)}:${gutil.colors.green(config.port)}`);

      if (isFunction(cb)) {
        cb();
      }
    });
  }
}
