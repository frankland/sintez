import { load as JSONfromYml } from 'js-yaml';
import { readFileSync } from 'fs';
import { resolve, join } from 'path';
import getter from 'lodash/object/get';
import isEmpty from 'lodash/lang/isEmpty';
import cloneDeep from 'lodash/lang/cloneDeep';

var local = {
  config: Symbol('config')
};

var config = {
  "env-configs": {
    "default-name": "sintez",
    "cli-arg": "conf"
  },

  "webpack": {
    "port": 9001,
    "host": "localhost",
    "livereload": 35729,
    "quiet": true,
    "noInfo": true,
    "lazy": false,
    "watchDelay": true,
    "headers": {
      "X-Custom-Header": "yes"
    },
    "stats": {
      "colors": true
    }
  }
};

class SintezConfig {
  constructor() {
    this[local.config] = cloneDeep(config);
  }

  has(key) {
    return !isEmpty(this.get(key));
  }

  get(key) {
    return getter(this[local.config], key);
  }
}


export default new SintezConfig();
export { SintezConfig };
