import pretty from 'prettyjson';
import Base from '../../base-task';

export default class WebpackServerInfo extends Base {
  getWebpackInstance() {
    return this.env.getWebpack();
  }

  run() {
    var webpack = this.getWebpackInstance();
    var server = webpack.getServer();
    var config = server.getConfig();

    return () => {
      var yml = pretty.render(config);
      console.log(yml);
    }
  }
}
