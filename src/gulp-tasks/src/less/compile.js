import rename from 'gulp-rename';
import less from 'gulp-less';
import { join } from 'path';

import Base from '../../base-task';

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

    return this.gulp.src(mask)
      .pipe(less(options))
      .pipe(rename(name))
      .pipe(this.gulp.dest(dest))
      .on('end', () => {

        this.logger.updated({
          src: mask,
          dest: join(dest, name)
        });
      });
  }
}
