import isObject from 'lodash/lang/isObject';
import isString from 'lodash/lang/isString';
import assign from 'lodash/object/assign';


import { resolve } from '../../../utils/path';

import BaseConverter from '../base-converter';


export default class OutputCoverter extends BaseConverter {
  getConfig(customOutputConfig) {
    return assign({
      path: resolve(this.dest),
      filename: "[name].js",
      chunkFilename: "[name].js",
      pathinfo: true
    }, customOutputConfig);
  }
}
