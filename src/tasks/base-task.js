import Environment from '../components/environment';
import WrongEnvironmentInstance from '../../utils/exceptions/wrong-environment-instance';


export default class TaskBase {
  constructor(env) {
    if (!(env instanceof Environment)) {
      throw new WrongEnvironmentInstance();
    }

    this.env = env;
  }

  getResources() {
    return this.env.getResources();
  }

  run() {
    throw new Error('@run method should be implemented');
  }

  getDefaultTaskName() {
    throw new Error('@getDefaultTaskName method should be implemented');
  }

  export() {
    return this.run.bind(this);
  }
}
