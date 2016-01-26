import Base from '../base-task';

export default class Server extends Base {
  getDefaultTaskName() {
    return 'server';
  }

  start(builder, server) {
    var applicationBuilder = builder.getApplicationBuilder();

    applicationBuilder.on('build.start', () => {
      this.logger.log('start rebuild');
    });

    applicationBuilder.on('build.end', (params) => {

      var message = `%#${params.counter}% application was packed. Elapsed time %${params.time}%s. `;
      message += `Number of scripts %${params.scripts.length}%`;

      this.logger.log(message);

      var warnings = params.warnings;
      if (warnings && !!warnings.length) {
        this.logger.log('------------------');
        this.logger.log('*** %WARNINGS% ***');
        for (var warning of warnings) {
          this.logger.log(`at %${warning.module.issuer}%`);
          this.logger.log(`requested %"${warning.module.rawRequest}"% ("${warning.module.userRequest}")`);
          this.logger.log(warning.message.replace(/(\r\n|\n|\r)/gm,' '));
        }

        this.logger.log('------------------');
      }
    });

    applicationBuilder.on('build.error', ({errors}) => {
      for (var error of errors) {
        console.log(error.message);
      }
    });

    var config = server.getConfig();

    server.run(() => {
      this.logger.log(`run at %http://${config.host}:${config.port}%`);
    });
  }

  run(done) {
    var server = this.sintez.getServer();
    var builder = this.sintez.getBuilder();

    this.start(builder, server);
  }
}
