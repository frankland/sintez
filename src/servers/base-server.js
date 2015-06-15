export default class BaseServer {
  constructor(serverConfig) {
    this.builder = serverConfig.builder.getInstance();
    this.config = serverConfig;
  }

  run(cb) {
    throw new Error('@run method should be implemented');
  }

  getConfig() {
    throw new Error('@getConfig method should be implemented');
  }

  //getInstance() {
  //  throw new Error('@getInstance method should be implemented');
  //}
}
