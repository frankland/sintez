import { server as logger } from '../gulp-logger';

import runSequence from 'run-sequence';

import Base from '../base-task';

export default class Dev extends Base {
  getDefaultTaskName() {
    return 'dev';
  }

  run(done) {
    runSequence.use(this.gulp);

    runSequence([
      'html:watch',
      'less:watch',
      'static:watch',
      'server'
    ], done);
  }
}
