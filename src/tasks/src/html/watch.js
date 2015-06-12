import gulp from 'gulp';
import HtmlIndex from './index';


import Base from '../../base-task';

var defaultTaskName = 'html:watch';

export default class LessWatch extends Base {
  constructor(env) {
    super(env);
    this.compiler = new HtmlIndex(env);
  }

  getDefaultTaskName() {
    return 'html:watch';
  }

  run() {
    var resources = this.getResources();
    var mask = resources.getMask('index');

    this.compiler.run();
    return gulp.watch(mask, () => {
      return this.compiler.run();
    });
  }
}
