//import isArray from 'lodash/lang/isArray';
//import isEmpty from 'lodash/lang/isEmpty';

import ChunkManifest from 'chunk-manifest-webpack-plugin';
import CommonsChunkPlugin from 'webpack/lib/optimize/CommonsChunkPlugin';

import BaseConverter from '../base-converter';

export default class Chunks extends BaseConverter {

  getChunkManifest() {
    return new ChunkManifest({
      filename: 'chunk-manifest.json',
      manifestVariable: "webpackManifest"
    });
  }

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
