import isObject from 'lodash/lang/isObject';
import isString from 'lodash/lang/isString';


import { resolve } from '../../../utils/path';

import BaseConverter from '../base-converter';


export default class OutputCoverter extends BaseConverter {
  getConfig() {
    return {
      path: resolve(this.dest),
      filename: "[name].js",
      chunkFilename: "[name].js",
      pathinfo: true
    };
  }
}
