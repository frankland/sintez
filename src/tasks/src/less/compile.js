import gulp from 'gulp';
import rename from 'gulp-rename';
import less from 'gulp-less';
import { join } from 'path';

import gutil from 'gulp-util';

import { less as logger } from '../../../components/log';


import Base from '../../base';

export default class LessCompile extends Base {
  getDefaultTaskName() {
    return 'less:compile';
  }

  run() {
    var resources = this.getResources();

    var mask = resources.getMask('less');
    var dest = resources.getTarget('less');
    var name = resources.getDestName('less');

    var options = Object.assign({}, resources.getOptions('less'), {
      compress: true
    });

    return gulp.src(mask)
      .pipe(less(options))
      .pipe(rename(name))
      .pipe(gulp.dest(dest))
      .on('end', () => {
        logger.updated({
          src: mask,
          dest: join(dest, name)
        });
      });
  }
}
