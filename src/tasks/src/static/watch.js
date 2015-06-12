import gulp from 'gulp';
import StaticCopy from './copy';

import Base from '../../base-task';

export default class StaticWatch extends Base {
  constructor(env) {
    super(env);
    this.copier = new StaticCopy(env);
  }

  getDefaultTaskName() {
    return 'static:watch';
  }

  run() {
    var resources = this.env.getResources();
    var copy = this.env.get('copy') || [];

    for (let key of copy) {
      var mask = resources.getMask(key);

      this.copier.copy(key);
      gulp.watch(mask, () => {
        return this.copier.copy(key);
      });
    }
  }
}
