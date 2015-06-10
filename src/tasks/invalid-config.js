export default class WrongEnvironmentInstance extends Error {
  constructor(task, message) {
    super();
    this.message = `Invalid config to run "${task}" task. ${message}`;
  }
}
