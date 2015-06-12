import UglifyJsPlugin from 'webpack/lib/optimize/UglifyJsPlugin';
import BaseConverter from '../base-converter';

export default class OptimizeConverter extends BaseConverter {

  getConfig(optimize) {
    var optimizePlugin = null;

    if (optimize) {
      optimizePlugin = new UglifyJsPlugin({
        compress: {
          warnings: false
        }
      });
    }

    return optimizePlugin;
  }
}
