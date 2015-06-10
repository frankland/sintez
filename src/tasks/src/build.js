import Base from '../base';

export default class Build extends Base {

  getDefaultTaskName() {
    return 'build';
  }

  getWebpackInstance() {
    return this.env.getWebpack();
  }

  run(done) {
    var webpack = this.getWebpackInstance();

    webpack.run((err) => {
      done(err);
    });
  }
}
