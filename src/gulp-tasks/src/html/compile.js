import { join } from 'path';

import htmlreplace from 'gulp-html-replace';
import rename from 'gulp-rename';

//import gutil from 'gulp-util';

//import { html as logger } from '../../../components/log';

import Base from '../../base-task';

export default class HtmlCompile extends Base {

  getDefaultTaskName() {
    return 'html:index';
  }

  getOptions() {
    var resources = this.sintez.getResources();
    var builder = this.sintez.getBuilder();

    return {
      css: resources.getUrl('less'),
      js: builder.getOutputScripts()

      //favicon: {
      //  src: resources.getUrl('favicon'),
      //  tpl: '<link rel="icon" type="image/png" href="%s" />'
      //}
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
    var name = resources.getDestName('index');

    var options = this.getOptions();

    return this.gulp.src(src)
      .pipe(htmlreplace(options))
      .pipe(rename(name))
      .pipe(this.gulp.dest(dest))
      .on('end', () => {

        //logger.updated({
        //  src,
        //  dest: join(dest, name)
        //});
      });
  }
}
