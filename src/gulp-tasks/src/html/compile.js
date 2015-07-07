import { join, extname } from '../../../utils/path';

import plumber from 'gulp-plumber';

import htmlreplace from 'gulp-html-replace';
import rename from 'gulp-rename';

import gulpJade from 'gulp-jade';

import Base from '../../base-task';


var compilersMap = new Map();
compilersMap.set('.jade', (options) => gulpJade(options));

export default class HtmlCompile extends Base {

  getDefaultTaskName() {
    return 'html:compile';
  }

  getOptions() {
    var resources = this.sintez.getResources();

    var options = {
      base: {
        src: '/',
        tpl: '<base href="%s">'
      }
    };

    options.css = this.sintez.getOutputStyles();
    options.js = this.sintez.getOutputScripts();

    if (resources.has('favicon')) {
      var favicon = resources.get('favicon');
      options.favicon = {
        src: favicon.getUrl(),
        tpl: '<link rel="icon" type="image/png" href="%s" />'
      }
    }

    return options;
  }

  compile(resource, options) {
    var src = resource.getSrc();
    var dest = resource.getTarget();
    var name = resource.getDestName();

    var stream = this.gulp.src(src)
      .pipe(plumber());

    var ext = extname(src);

    if (compilersMap.has(ext)) {
      var compiler = compilersMap.get(ext);
      var resourceOptions = resource.getOptions();

      stream.pipe(compiler(resourceOptions));
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

  compileWithDefaults(resource, customOptions) {
    var options = this.getOptions();
    if (customOptions) {
      options = Object.assign({}, options, customOptions);
    }

    return this.compile(resource, options);
  }

  run() {
    var resources = this.getResources();
    var resource = resources.get('index');

    return this.compileWithDefaults(resource);
  }
}
