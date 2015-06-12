import Base from '../base-task';

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
