import { sync as rm } from 'rimraf';
import { resolve } from 'path';
import Base from '../base-task';

export default class Server extends Base {

  getDefaultTaskName() {
    return 'clear';
  }

  run() {
    var dest = this.env.getDest();
    rm(resolve(dest));
  }
}
