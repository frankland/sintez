import Base from '../base-task';

export default class Build extends Base {

  getDefaultTaskName() {
    return 'build';
  }

  run(done) {
    var builder = this.sintez.getBuilder();

    builder.run((err) => {
      done(err);
    });
  }
}
