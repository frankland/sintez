import { load as JSONfromYml } from 'js-yaml';
import { readFileSync } from 'fs';
import { resolve, join } from 'path';
import getter from 'lodash/object/get';
import isEmpty from 'lodash/lang/isEmpty';
import config from './configs/sintez';

var local = {
  config: Symbol('config')
};

class SintezConfig {
  constructor() {
    this[local.config] =  Object.assign(config, {
      dirname: __dirname
    });
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
