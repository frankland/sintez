export default class WrongEnvironmentInstance extends Error {
  constructor() {
    super();
    this.message = 'Sintez instance that should be passed to task class constructor is wrong';
  }
}
