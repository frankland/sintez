import Chunk from 'webpack/lib/Chunk';

var local = {
  counter: Symbol('counter'),
  lastBuildFailed: Symbol('last-fbuild-failed')
};

export default class WebpackLogPlugin {
  constructor(emit) {
    this.emit = emit;
    this[local.counter] = 1;
    this[local.lastBuildFailed] = false;
  }

  apply(compiler) {

    compiler.plugin('done', (stats) => {
      var counter = this[local.counter]++;

      var time =  (stats.endTime - stats.startTime) / 1000;
      var scripts = stats.compilation.fileDependencies;

      if (stats.compilation.errors && stats.compilation.errors.length)
      {
        this[local.lastBuildFailed] = true;

        this.emit('build.error', {
          errors: stats.compilation.errors
        });

      } else {
        this[local.lastBuildFailed] = false;

        this.emit('build.end', {
          counter,
          time,
          scripts
        });
      }
    });

    compiler.plugin('invalid', () => {
      this.emit('build.start');
    });
  }
}
