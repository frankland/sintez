import LessCompile from './compile';

import Base from '../../base-task';


export default class LessWatch extends Base {
  constructor(gulp, sintez) {
    super(gulp, sintez);
    this.compiler = new LessCompile(gulp, sintez);
  }

  getDefaultTaskName() {
    return 'css:watch';
  }

  run() {
    var resources = this.getResources();
    var less = resources.get('css');
    var mask = less.getMask();

    this.compiler.run();
    return this.gulp.watch(mask, () => {
      return this.compiler.run();
    });
  }
}
