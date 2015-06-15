//import { server as logger } from './log';
//
//import { resolve } from 'path';

//import gutil from 'gulp-util';

import WebpackDevServer from 'webpack-dev-server';

//import isFunction from 'lodash/lang/isFunction';
//import cloneDeep from 'lodash/lang/cloneDeep';

import { resolve, basename } from 'path';
//
//import sintez from '../../configs/sintez-config';

import BaseServer from '../base-server';

var local = {
  server: Symbol('webpack-server'),
};

export default class WebpackServer extends BaseServer {
  constructor(config) {
    super(config);

    // TODO: check builder instance
  }

  setupIndexAsEntry() {
    var server = this[local.server];

    var index = this.config.index;
    var resolvedIndex = resolve(index);

    server.app.get('*', (req, res) => {
      res.sendFile(resolvedIndex);
    });
  }

  getConfig() {
    return {
      contentBase: this.config.dest,
      quiet: true,
      noInfo: true,
      lazy: false,
      watchDelay: true,
      headers: {
        'X-Custom-Header': 'yes'
      },
      stats: {
        colors: true
      },
      index: basename(this.config.index)
    }
  }

  getInstance() {
    if (!this[local.server]) {
      var webpack = this.builder.getInstance();
      var serverConfig = this.getConfig();

      this[local.server] = new WebpackDevServer(webpack, serverConfig);
      this.setupIndexAsEntry();
    }

    return this[local.server];
  }

  run(cb) {
    var host = this.config.host;
    var port = this.config.port;

    var server = this.getInstance();

    server.listen(port, host, cb);
  }
}
