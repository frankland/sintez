import CommonsChunkPlugin from 'webpack/lib/optimize/CommonsChunkPlugin';

import BaseConverter from '../base-converter';

export default class Chunks extends BaseConverter {

  getConfig(entries, output) {
    var chunkPlugin = null;

    if (!output) {
      var list = Object.keys(entries).slice(0, -1).reverse();

      chunkPlugin = new CommonsChunkPlugin({
        name: list,
        minChunks: Infinity
      });
    }

    return chunkPlugin;
  }
}
