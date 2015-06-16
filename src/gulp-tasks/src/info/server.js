import pretty from 'prettyjson';
import Base from '../../base-task';

export default class ServerInfo extends Base {

  getDefaultTaskName() {
    return 'info:server';
  }


  run(done) {
    var server = this.sintez.getServer();
    var config = server.getConfig();
    var yml = pretty.render(config);

    console.log(yml);

    done();
  }
}
