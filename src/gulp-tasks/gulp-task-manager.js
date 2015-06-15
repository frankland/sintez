import Log from './gulp-logger';

var logger = new Log('tasks');

var local = {
  gulp: Symbol('gulp')
};

export default class TaskManager {
  constructor(gulp) {
    this[local.gulp] = gulp;
  }

  add(task, name) {
    var taskName = name || task.getDefaultTaskName();

    this[local.gulp].task(taskName, (done) => {
      if (task.run.length == 1) {
        task.run(done);
      } else {
        return task.run();
      }
    });

    logger.log(`+ ${taskName}`);

    return () => {
      this.start(taskName);
    }
  }

  start(taskName) {
    if (!taskName) {
      throw new Error('Can not manually start task because "taskName" is not defined');
    }

    this[local.gulp].start(taskName);
  }
}
