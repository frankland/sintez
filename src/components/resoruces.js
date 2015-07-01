import { resolve, join } from '../utils/path';
import cloneDeep from 'lodash/lang/cloneDeep';

import { toUnifiedPath } from '../utils/helpers';

import Resource from '../resources/base-resource';
import JsResource from '../resources/js-resource';
//import CssResource from '../resources/css-resource';


var local = {
  resources: Symbol('resources'),
  src: Symbol('src'),
  dest: Symbol('dest')
};

var resourcesMap = new Map();
resourcesMap.set('js', JsResource);

export default class Resources {
  constructor(src, dest, resources) {
    // TODO: check resources type
    this[local.src] = src;
    this[local.dest] = dest;
    this[local.resources] = resources;
  }

  getConfig() {
    return cloneDeep(this[local.resources]);
  }

  get(key) {
    var src = this[local.src];
    var dest = this[local.dest];
    var resources = this[local.resources];

    if (!this.has(key)) {
      throw new Error(`Resource "${key}" is not defined`);
    }

    var resourceClass = null;
    if (resourcesMap.has(key)) {
      resourceClass = resourcesMap.get(key);
    } else {
      resourceClass = Resource;
    }

    return new resourceClass(src, dest, key, resources[key]);
  }

  has(key) {
    var resources = this[local.resources];
    return resources[key]
  }
}
