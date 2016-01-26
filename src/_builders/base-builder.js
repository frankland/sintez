import events from 'events';

var local = {
  events: Symbol('events'),
  available: ['build.start', 'build.end', 'build.error']
};

export default class BaseBuilder {
  constructor(builderConfig) {
    this.config = builderConfig;

    this[local.events] = new events.EventEmitter();
  }

  run(cb) {
    throw new Error('@run method should be implemented');
  }

  getConfig() {
    throw new Error('@getConfig method should be implemented');
  }

  on(event, fn) {

    this[local.events].on(event, fn);

    return () => {
      this[local.events].removeListener(event, fn);
    };
  }

  once(event, fn) {
    this[local.events].once(event, fn);
  }

  emit(event, params) {
    this[local.events].emit(event, params);
  }
}
