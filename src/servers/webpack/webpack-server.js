import WebpackDevServer from 'webpack-dev-server';

import { resolve, basename } from '../../utils/path';

import BaseServer from '../base-server';

var local = {
  server: Symbol('webpack-server')
};

export default class WebpackServer extends BaseServer {
  constructor(config) {
    super(config);
  }

  getConfig() {
    return {
      historyApiFallback: true,
      contentBase: this.config.dest,
      quiet: true,
      noInfo: true,
      lazy: false,
      watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
      },
      headers: {
        'X-Custom-Header': 'yes'
      },
      stats: {
        colors: true
      }
    }
  }

  getInstance() {
    if (!this[local.server]) {
      var webpack = this.builder.getWebpackInstance();
      var serverConfig = this.getConfig();

      this[local.server] = new WebpackDevServer(webpack, serverConfig);
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
