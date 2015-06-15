export default class WebpackSplitPlugin {
  constructor() {
    //this[local.counter] = 1;
    //this[local.lastBuildFailed] = false;
  }

  apply(compiler) {
    //var options = this.options;
    var options = {
      def: 'code',
      buckets: [{
        name: 'vendor',
        regex: /vendor\//
      }, {
        name: 'deps',
        regex: /deps\//
      }, {
        name: 'app',
        regex: /app\//
      }]
    };

    function findMatchingBucket(chunk) {
      var match = null;

      for (var bucket of options.buckets) {
        if (bucket.regex.test(chunk.rawRequest)) {
          match = bucket;
          break;
        }
      }

      if (!match) {
        match = {
          name: options.def
        }
      }

      return match;
    }

    compiler.plugin("compilation", function(compilation) {
      var pathChunks = {};

      // Find the chunk which was already created by this bucket.
      // This is also the grossest function name I've written today.
      function bucketToChunk(bucket) {
        return pathChunks[bucket.name];
      }

      compilation.plugin("optimize-chunks", function (chunks) {
        //var addChunk = this.addChunk.bind(this);

        for (var chunk of chunks) {
          for (var mod of chunk.modules) {
            if (mod.rawRequest !== undefined) {
              var bucket = findMatchingBucket(mod);

              var newChunk = null;

              //if (!bucket) {
              // it stays in the original bucket
              //return;
              //}

              if (!(newChunk = bucketToChunk(bucket))) {
                newChunk = pathChunks[bucket.name] = this.addChunk(bucket.name);
              }

              // add the module to the new chunk
              newChunk.addModule(mod);
              mod.addChunk(newChunk);

              // remove it from the existing chunk
              mod.removeChunk(chunk);
            }
          }


          options.buckets
            .map(bucketToChunk)
            .filter(Boolean)
            .concat(chunk)
            .forEach(function(chunk, index, allChunks) { // allChunks = [bucket0, bucket1, .. bucketN, orig]
              if (index) { // not the first one, they get the first chunk as a parent
                chunk.parents = [allChunks[0]];
              } else { // the first chunk, it gets the others as 'sub' chunks
                chunk.chunks = allChunks.slice(1);
              }
              chunk.initial = chunk.entry = !index;
            });
        }

      });
    });
  }
}
