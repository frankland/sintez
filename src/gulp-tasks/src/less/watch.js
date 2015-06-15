//import gulp from 'gulp';
import LessCompile from './compile';

import Base from '../../base-task';


export default class LessWatch extends Base {
  constructor(gulp, sintez) {
    super(gulp, sintez);
    this.compiler = new LessCompile(gulp, sintez);
  }

  getDefaultTaskName() {
    return 'less:watch';
  }

  run() {
    var resources = this.getResources();
    var mask = resources.getMask('less');

    this.compiler.run();
    return this.gulp.watch(mask, () => {
      return this.compiler.run();
    });
  }
}
