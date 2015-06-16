import { resolve } from '../../../utils/path';

import BaseConverter from '../base-converter';


export default class OutputCoverter extends BaseConverter {
  getConfig(output) {
    var filename = null;

    if (output) {
      filename = output;
    } else {
      filename = '[name].js';
    }

    return {
      path: resolve(this.dest),
      filename
    };
  }
}
