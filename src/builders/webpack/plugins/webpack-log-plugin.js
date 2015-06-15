//import gutil from 'gulp-util';
//import { js as logger } from './log';

import Chunk from 'webpack/lib/Chunk';
var local = {
  counter: Symbol('counter'),
  lastBuildFailed: Symbol('last-build-failed')
};

export default class WebpackLogPlugin {
  constructor() {
    this[local.counter] = 1;
    this[local.lastBuildFailed] = false;
  }

  apply(compiler) {

    //var
    //compiler.plugin("this-compilation", function(compilation) {
    //  compilation.plugin(["optimize-chunks", "optimize-extracted-chunks"], (chunks) => {
    //
    //    var chunk = new Chunk('yoyoyoyo');
    //    //chunks.modules = chunks;
    //
    //    //compilation.addChunk
    //
    //    var modules = [];
    //    chunks.map(chunk => {
    //      //var modules = modules.concat(chunk.modules);
    //      //chunk.modules = [modules[0]]
    //      //modules = modules.concat(chunk.modules);
    //      //chunk.modules.map(module => {
    //      //  chunk.addModule.addModule(module);
    //      //  //console.log(module.rawRequest);
    //      //});
    //
    //      //console.log(chunk.modules);
    //      console.log('-----');
    //    });
    //
    //    compilation.chunks = new Chunk('yooo', modules);
    //
    //  });
    //});


    compiler.plugin('done', (stats) => {
      var counter = this[local.counter]++;
      var isLastBuildFailed = this[local.lastBuildFailed];

      var time =  (stats.endTime - stats.startTime) / 1000;
      var scripts = stats.compilation.fileDependencies;

      if (stats.compilation.errors && stats.compilation.errors.length)
      {
        this[local.lastBuildFailed] = true;

        //logger.log(gutil.colors.red('Compilation errors'));

        for (var error of stats.compilation.errors) {
          //gutil.log(error.message);
        }
      } else {
        this[local.lastBuildFailed] = false;

        if (isLastBuildFailed) {
          //logger.log(gutil.colors.cyan('All previous compilation errors were fixed'));
        }


        //logger.log(`${gutil.colors.yellow(`#${counter}`)} Application was packed. Elapsed time ${gutil.colors.yellow(time)}s. Number of scripts: ${gutil.colors.yellow(scripts.length)}`);
      }
    });

    compiler.plugin('invalid', () => {
      //logger.log('changed');
    });
  }
}
