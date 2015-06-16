import { join, extname } from 'path';

import htmlreplace from 'gulp-html-replace';
import rename from 'gulp-rename';

import gulpJade from 'gulp-jade';

import Base from '../../base-task';


var compilersMap = new Map();
compilersMap.set('.jade', (locals) => gulpJade({locals}));

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

    var stream =  this.gulp.src(src);

    var ext = extname(src);

    if (compilersMap.has(ext)) {
      var compiler = compilersMap.get(ext);
      var resourceOptions = resources.getOptions('index');

      stream.pipe(compiler({
        params: resourceOptions.params || {}
      }));
    }

    return stream.pipe(htmlreplace(options))
      .pipe(rename(name))
      .pipe(this.gulp.dest(dest))
      .on('end', () => {

        this.logger.updated({
          src,
          dest: join(dest, name)
        });
      });
  }
}
