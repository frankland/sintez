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
    var builder = this.sintez.getBuilder();

    var options = {
      base: {
        src: '/',
        tpl: '<base href="%s">'
      }
    };

    if (resources.hasResource('less')) {
      options.css = resources.getUrl('less');
    }

    var scripts = builder.getOutputScripts();
    if (scripts && scripts.length) {
      options.js = scripts;
    }

    if (resources.hasResource('favicon')) {
      options.favicon = {
        src: resources.getUrl('favicon'),
        tpl: '<link rel="icon" type="image/png" href="%s" />'
      }
    }

    return options;
  }

  getName() {
    var resources = this.getResources();
    return resources.getDestName('index');
  }

  run(customResource, customOptions) {
    var options = this.getOptions();
    if (customOptions) {
      options = Object.assign({}, options, customOptions);
    }

    var resource = 'index';
    if (customResource) {
      resource = customResource;
    }

    var resources = this.getResources();

    var src = resources.getSrc(resource);
    var dest = resources.getTarget(resource);
    var name = resources.getDestName(resource);

    var stream = this.gulp.src(src)
      .pipe(plumber());

    var ext = extname(src);

    if (compilersMap.has(ext)) {
      var compiler = compilersMap.get(ext);
      var resourceOptions = resources.getOptions(resource);
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
}
