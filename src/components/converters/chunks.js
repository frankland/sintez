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
    var chunkPlugins = null;

    if (chunks && !isEmpty(entries) && !isArray(entries)) {
      var list = null;
      var isArrayMode = isArray(entries);

      if (isArrayMode) {
        list = entries;
      } else {
        list = Object.keys(entries);
      }

      var mainBundle = list[list.length - 1];

      chunkPlugins = [new CommonsChunkPlugin({
        name: list,
        minChunks: Infinity
      })];

      //for (var entry of list) {
      // // var entry = name; //isArrayMode ? name : entries[name];
      //
      //  if (mainBundle !== entry) {
      //  chunkPlugins.push(new CommonsChunkPlugin({
      //      name: entry,
      //      minChunks: Infinity
      //    }));
      //  }
      //}
    }

    return chunkPlugins;
  }
}
