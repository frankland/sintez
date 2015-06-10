import Base from '../base';

export default class Server extends Base {
  getDefaultTaskName() {
    return 'server';
  }

  getWebpackInstance() {
    return this.env.getWebpack();
  }

  run() {
    var webpack = this.getWebpackInstance();
    var server = webpack.getServer();

    server.setupIndexAsEntry();
    server.run();
  }
}
