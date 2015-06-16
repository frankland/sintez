import { use } from 'run-sequence';

import Base from '../base-task';

export default class Dev extends Base {
  constructor(gulp ,sintez) {
    super(gulp, sintez);

    this.runSequence = use(gulp);
  }
  getDefaultTaskName() {
    return 'dev';
  }

  run(done) {
    this.runSequence([
      'html:watch',
      'less:watch',
      'static:watch',
      'server'
    ], done);
  }
}
