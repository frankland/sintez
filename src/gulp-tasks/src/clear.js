import { sync as rm } from 'rimraf';
import { resolve } from '../../utils/path';

import Base from '../base-task';

export default class Server extends Base {

  getDefaultTaskName() {
    return 'clean';
  }

  run() {
    var dest = this.sintez.getDest();
    rm(resolve(dest));
  }
}
