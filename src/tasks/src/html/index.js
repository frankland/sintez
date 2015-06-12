import gulp from 'gulp';
import { join } from 'path';
import htmlreplace from 'gulp-html-replace';
import rename from 'gulp-rename';

import gutil from 'gulp-util';

import { html as logger } from '../../../components/log';

import Base from '../../base-task';

export default class HtmlIndex extends Base {

  getDefaultTaskName() {
    return 'html:index';
  }

  getOptions() {
    var resources = this.env.getResources();
    var webpack = this.env.getWebpack();

    return {
      css: resources.getUrl('less'),
      js: webpack.getOutputScripts(),
      favicon: {
        src: resources.getUrl('favicon'),
        tpl: '<link rel="icon" type="image/png" href="%s" />'
      }
    }
  }

  getName() {
    var resources = this.getResources();
    return resources.getDestName('index');
  }

  run() {
    var resources = this.getResources();

    var src = resources.getSrc('index');
    var dest = resources.getTarget('index');

    var name = this.getName();

    var options = this.getOptions();

    return gulp.src(src)
      .pipe(htmlreplace(options))
      .pipe(rename(name))
      .pipe(gulp.dest(dest))
      .on('end', () => {
        logger.updated({
          src,
          dest: join(dest, name)
        });
      });
  }
}
