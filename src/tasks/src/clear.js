import { sync as rm } from 'rimraf';

import Base from '../base';

export default class Server extends Base {

  getDefaultTaskName() {
    return 'clear';
  }

  run() {
    var dest = this.env.getDest();
    rm(dest);
  }
}
