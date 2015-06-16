import Base from '../base-task';

export default class Server extends Base {
  getDefaultTaskName() {
    return 'server';
  }

  run() {
    var server = this.sintez.getServer();
    var builder = this.sintez.getBuilder();
    var applicationBuilder = builder.getApplicationBuilder();

    applicationBuilder.on('build.start', () => {
      this.logger.log('start rebuild');
    });

    applicationBuilder.on('build.end', (params) => {

      var message = `_#${params.counter}_ application was packed. Elapsed time _${params.time}_s. `;
      message += `Number of scripts _${params.scripts.length}_`;

      this.logger.log(message);
    });

    applicationBuilder.on('build.error', ({errors}) => {
      for (var error of errors) {
        console.log(error.message);
      }
    });

    var config = server.getConfig();

    server.run(() => {
      this.logger.log(`run at _http://${config.host}:${config.port}_`);
    });
  }
}
