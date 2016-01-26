import WebpackServer from  '../servers/webpack/webpack-server';

var local = {
  config: Symbol('config'),
  server: Symbol('server')
};

var serversMap = new Map();
serversMap.set('webpack', WebpackServer);

export default class Server {
  constructor(config) {
    this[local.config] = config;
    var serverName = config.server;

    if (!serversMap.has(serverName)) {
      throw new Error(`builders "${serverName}" does not registered`);
    }

    var Server = serversMap.get(serverName);
    this[local.server] = new Server(config);
  }

  getConfig() {
    return this[local.config];
  }

  getApplicationServer() {
    return this[local.server];
  }

  run(cb) {
    this.getApplicationServer().run(cb);
  }
}
