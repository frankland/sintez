import HtmlCompile from './compile';


import Base from '../../base-task';

export default class LessWatch extends Base {
  constructor(gulp, sintez) {
    super(gulp, sintez);
    this.compiler = new HtmlCompile(gulp, sintez);
  }

  getDefaultTaskName() {
    return 'html:watch';
  }

  run() {
    var resources = this.getResources();
    var index = resources.get('index');
    var mask = index.getMask();

    this.compiler.run();

    return this.gulp.watch(mask, () => {
      return this.compiler.run();
    });
  }
}
