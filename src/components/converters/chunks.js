import isArray from 'lodash/lang/isArray';
import isEmpty from 'lodash/lang/isEmpty';

import ChunkManifest from 'chunk-manifest-webpack-plugin';
import CommonsChunkPlugin from 'webpack/lib/optimize/CommonsChunkPlugin';
import { globSync } from 'glob';


export default class Chunks {
  static validate(entries) {
    return {
      isValid: true,
      errors: []
    }
  }

  static getChunkManifest() {
    return new ChunkManifest({
      filename: 'chunk-manifest.json',
      manifestVariable: "webpackManifest"
    });
  }

  static convert(chunks, entries) {
    var chunkPlugin = null;

    if (chunks && !isEmpty(entries) && !isArray(entries)) {
      var list = null;
      var isArrayMode = isArray(entries);

      if (isArrayMode) {
        list = entries;
      } else {
        list = Object.keys(entries);
      }

      chunkPlugin = new CommonsChunkPlugin({
        name: list,
        minChunks: Infinity
      });
    }

    return chunkPlugin;
  }
}
