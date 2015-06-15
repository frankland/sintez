import pretty from 'prettyjson';
import Base from '../../base-task';

export default class BuilderInfo extends Base {
  getDefaultTaskName() {
    return 'info:sintez';
  }

  run() {
    var config = this.sintez.getConfig();
    var yml = pretty.render(config);

    console.log(yml);
  }
}
