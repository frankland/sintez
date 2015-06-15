import { server as logger } from '../gulp-logger';

import Base from '../base-task';

export default class Server extends Base {
  getDefaultTaskName() {
    return 'server';
  }

  run() {
    var server = this.sintez.getServer();

    server.run(() => {
      logger.log('run');
    });
  }
}
