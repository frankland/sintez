import UglifyJsPlugin from 'webpack/lib/optimize/UglifyJsPlugin';

export default class Optimize {
  static validate(shim) {
    return {
      isValid: true,
      errors: []
    }
  }

  static convert(optimize) {
    var optimizePlugin = null;

    if (optimize) {
      optimizePlugin =  new UglifyJsPlugin({
        compress: {
          warnings: false
        }
      });
    }

    return optimizePlugin;
  }
}
