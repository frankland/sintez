export default class BaseBuilder {
  constructor(builderConfig) {
    this.config = builderConfig;
  }

  //createInstance() {
  //  throw new Error('@createInstance method should be implemented');
  //}

  //getProcessedConfig() {
  //  throw new Error('@getProcessedConfig method should be implemented');
  //}

  //getInstance() {
  //  throw new Error('@getInstance method should be implemented');
  //}



  run(cb) {
    throw new Error('@run method should be implemented');
  }

  getConfig() {
    throw new Error('@getConfig method should be implemented');
  }
}
