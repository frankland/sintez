import Base from '../../../base-task';


export default class BuildTests extends Base {
  constructor(gulp, sintez) {
    super(gulp, sintez);
  }

  getDefaultTaskName() {
    return 'tests:mocha:build';
  }

  createBuilder() {
    var tests = this.sintez.getTests();
    var config = tests.getConfig();

    return this.sintez.createBuilder({
      dest: config.tests.getTestDest(),
      js: config.tests
    });
  }

  run(done) {
    var builder = this.createBuilder();
    builder.run((err) => {
      done(err);
    });
  }
}
