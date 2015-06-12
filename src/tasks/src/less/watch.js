import gulp from 'gulp';
import LessCompile from './compile';

import Base from '../../base-task';


export default class LessWatch extends Base {
  constructor(env) {
    super(env);
    this.compiler = new LessCompile(env);
  }

  getDefaultTaskName() {
    return 'less:watch';
  }

  run() {
    var resources = this.getResources();
    var mask = resources.getMask('less');

    this.compiler.run();
    return gulp.watch(mask, () => {
      return this.compiler.run();
    });
  }
}
