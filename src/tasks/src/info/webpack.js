import pretty from 'prettyjson';
import Base from '../../base-task';

export default class WebpackInfo extends Base {
  getWebpackInstance() {
    return this.env.getWebpack();
  }

  run() {
    var webpack = this.getWebpackInstance();
    var config = webpack.createConfig();

    return () => {
      var yml = pretty.render(config);
      console.log(yml);
    }
  }
}
