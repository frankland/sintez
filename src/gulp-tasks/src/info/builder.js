import pretty from 'prettyjson';
import Base from '../../base-task';

export default class BuilderInfo extends Base {
  getDefaultTaskName() {
    return 'info:builder';
  }

  run() {
    var builder = this.sintez.getBuilder();
    var config = builder.getApplicationBuilder().getConfig();

    var resources = this.getResources();
    var js = resources.get('js');
    var split = js.getOptions('split');

    if (split) {
      config.split = split;
    }

    var yml = pretty.render(config);
    console.log(yml);
  }
}
