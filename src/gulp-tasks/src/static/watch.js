import gulp from 'gulp';
import StaticCopy from './copy';

import Base from '../../base-task';

export default class StaticWatch extends Base {
  constructor(gulp, sintez) {
    super(gulp, sintez);
    this.copier = new StaticCopy(gulp, sintez);
  }

  getDefaultTaskName() {
    return 'static:watch';
  }

  run() {
    var resources = this.sintez.getResources();
    var copy = this.sintez.get('copy') || [];

    for (let key of copy) {
      var mask = resources.getMask(key);

      this.copier.copy(key);
      this.gulp.watch(mask, () => {
        return this.copier.copy(key);
      });
    }
  }
}
