import Sintez from '../components/sintez';
import WrongSintezInstance from '../utils/exceptions/wrong-sintez-instance';
import GulpLogger from './gulp-logger';

export default class TaskBase {
  constructor(gulp, sintez) {
    if (!(sintez instanceof Sintez)) {
      throw new WrongSintezInstance();
    }

    this.sintez = sintez;
    this.gulp = gulp;

    var taskName = this.getDefaultTaskName();
    this.logger = new GulpLogger(taskName);
  }

  getResources() {
    return this.sintez.getResources();
  }

  run() {
    throw new Error('@run method should be implemented');
  }

  getDefaultTaskName() {
    throw new Error('@getDefaultTaskName method should be implemented');
  }
}
