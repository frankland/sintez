export default class WrongEnvironmentInstance extends Error {
  constructor(message) {
    super();
    this.message = `Invalid config. ${message}`;
  }
}
