import plumber from 'gulp-plumber';

import rename from 'gulp-rename';
import concatFiles from 'gulp-concat';
import gulpLess from 'gulp-less';
import { join } from '../../../utils/path';

import Base from '../../base-task';

export default class LessCompile extends Base {
  getDefaultTaskName() {
    return 'css:compile';
  }

  run() {
    var resources = this.getResources();
    var css = resources.get('css');

    var src = css.getSrc();

    var dest = css.getTarget();
    var name = css.getDestName();

    var options = Object.assign({}, css.getOptions(), {
      compress: true
    });

    var stream = this.gulp.src(src)
      .pipe(plumber());

    if (name) {
      stream = stream.pipe(concatFiles(name));
    }

    return stream
      .pipe(gulpLess(options))
      .pipe(this.gulp.dest(dest))
      .on('end', () => {

        this.logger.updated({
          src: src,
          dest: name ? join(dest, name) : dest
        });
      });
  }
}
