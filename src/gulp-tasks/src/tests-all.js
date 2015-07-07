import { use } from 'run-sequence';

import Base from '../base-task';

export default class TestsAll extends Base {
  constructor(gulp ,sintez) {
    super(gulp, sintez);

    this.runSequence = use(gulp);
  }
  getDefaultTaskName() {
    return 'tests:all';
  }

  run(done) {
    this.runSequence([
      'tests:mocha:index',
      'test:mocha:resources',
      'tests:mocha:build',
    ], done);
  }
}
