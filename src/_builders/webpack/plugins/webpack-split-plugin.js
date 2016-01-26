import isArray from 'lodash/lang/isArray';
import values from 'lodash/object/values';
import { sep } from '../../../utils/helpers';


export default class SplitByPathPlugin {
  constructor(options) {
    this.buckets = [];
    for (var bucket of options) {
      var paths = null;
      if (isArray(bucket.path)) {
        paths = bucket.path;
      } else {
        paths = [bucket.path];
      }

      this.buckets.push({
        name: bucket.name,
        path: paths.map(path => new RegExp(path.replace(/\//g, sep)))
      });
    }
  }

  apply(compiler) {
    var match = (chunk) => {
      var match = null;
      this.buckets.some(bucket => {
        return bucket.path.some(path => {
          if (path.test(chunk.userRequest)) {
            match = bucket;
            return true;
          }
        });
      });

      return match;
    };

    compiler.plugin('compilation', compilation => {
      var splitedChunks = {};

      compilation.plugin('optimize-chunks', function(chunks) {
        var filtered = chunks.slice().filter(chunk => chunk.entry);

        var waitForRemove = [];

        for (var chunk of filtered) {
          for (var mod of chunk.modules) {
            var bucket = match(mod);
            if (bucket) {
              var newChunk = splitedChunks[bucket.name];
              if (!newChunk) {
                newChunk = this.addChunk(bucket.name);
                //newChunk.parents = [chunk];
                splitedChunks[bucket.name] = newChunk;
              }

              // add the module to the new chunk
              newChunk.addModule(mod);
              mod.addChunk(newChunk);

              // remove it from the existing chunk
              waitForRemove.push(mod);
            } else {
              //console.log('original', mod.userRequest);
            }
          }

          for (var removeMod of waitForRemove) {
            chunk.removeModule(removeMod);
            removeMod.removeChunk(chunk);
          }

          //chunk.entry = chunk.initial = true;


          /**
           *
           * Entry chunk
           * An entry chunk contains the runtime plus a bunch of modules.
           * If the chunk contains the module 0 the runtime executes it.
           * If not, it waits for chunks that contains the module 0 and executes it (every time when there is a chunk
           * with a module 0).
           *
           * Normal chunk
           * A normal chunk contains no runtime.
           * It only contains a bunch of modules.
           * The structure depends on the chunk loading algorithm.
           * I. e. for jsonp the modules are wrapped in a jsonp callback function. The chunk also contains a list of
           * chunk id that it fulfills.
           *
           * Initial chunk (non-entry)
           * An initial chunk is a normal chunk.
           * The only difference is that optimization treats it as more important because it counts toward the initial
           * loading time (like entry chunks). That chunk type can occur in combination with the CommonsChunkPlugin.
           */

          var all = values(splitedChunks);
          all.push(chunk);

          var main = all.shift();
          //var main = chunk;

          main.entry = true;
          main.initial = true;
          main.chunks = all;

          for (var resultChunk of all) {
            //get the first chunk as a parent
            resultChunk.parents = [main];
            resultChunk.entry = false;
            resultChunk.initial = false;
          }
        }
      }, this);
    });
  }
}


