import { use } from 'run-sequence';

import Base from '../base-task';

export default class All extends Base {
  constructor(gulp ,sintez) {
    super(gulp, sintez);

    this.runSequence = use(gulp);
  }
  getDefaultTaskName() {
    return 'compile:all';
  }

  run(done) {
    this.runSequence([
      'html:compile',
      'less:compile',
      'static:copy',
      'build'
    ], done);
  }
}
