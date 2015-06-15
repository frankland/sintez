import pretty from 'prettyjson';
import Base from '../../base-task';

export default class BuilderInfo extends Base {
  getDefaultTaskName() {
    return 'info:builder';
  }

  run() {
    var builder = this.sintez.getBuilder();
    var config = builder.getInstance().getConfig();
    var yml = pretty.render(config);

    console.log(yml);
  }
}
