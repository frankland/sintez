import gulp from 'gulp';

import Log from '../components/log';

var logger = new Log('tasks');

export default class TaskManager {
  constructor() {

  }

  add(task, name) {
    var taskName = name || task.getDefaultTaskName();

    gulp.task(taskName, (done) => {
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

    gulp.start(taskName);
  }
}
