import { resolve, join } from 'path';
import cloneDeep from 'lodash/lang/cloneDeep';

import { toUnifiedPath } from '../helpers';


var regs = {
  name:  /(.+(?:\/|\\))?(.+\..+)?/,
  location: /[^(?:\/|\\)]+$/
};

var getName = () => {

};

var getPath = () => {

};

var local = {
  resources: Symbol('resources'),
  src: Symbol('src'),
  dest: Symbol('dest')
};


export default class Resources {
  constructor(src, dest, resources) {
    // TODO: check resouces type

    this[local.src] = src;
    this[local.dest] = dest;
    this[local.resources] = resources;
  }

  getConfig() {
    return cloneDeep(this[local.resources]);
  }

  /**
   * Check if resource has destination option
   * @param key
   * @returns {boolean}
   */
  hasDest(key) {
    var resource = this.getResource(key);
    return resource.hasOwnProperty('dest') || this.hasSrc(key);
  }


  /**
   * Return relative resource destination (dir + / + file)
   * @param key
   * @returns {string}
   */
  getRelativeDest(key) {
    if (!this.hasDest(key)) {
      throw new Error(`Can not resolve "dest" for "${key}" resource because "dest" and "src" options are not defined`);
    }

    var resource = this.getResource(key);
    var dest = resource.dest && (resource.dest[0] == '/'
      ? resource.dest.slice(1)
      : resource.dest);

    return dest || this.getRelativeSrc(key);
  };

  /**
   * Return full resource destination (dir + / + file)
   * @param key
   * @returns {string}
   */
  getDest(key) {
    var dest = this.getRelativeDest(key);
    return join(this[local.dest], dest);
  };

  /**
   * Return resource relative destination directory
   * @param key
   * @returns {string}
   */
  getRelativeTarget(key) {
    var dest = this.getRelativeDest(key).replace(regs.location, '');
    return dest ? join(dest, '/') : '';
  };

  /**
   * Return resource full destination directory
   * @param key
   * @returns {string}
   */
  getTarget(key) {
    var relativeTarget = this.getRelativeTarget(key);
    var target = join(this[local.dest], relativeTarget);
    return target ? join(target, '/') : '';
  };

  /**
   * Return resource name at destination path
   * @param key
   * @returns {string}
   */
  getDestName(key) {
    var dest = this.getDest(key);
    return regs.name.exec(dest)[2] || '';
  };

  hasDestName(key) {
    return !!this.getDestName(key);
  }

// ---------------------------------------

  /**
   * Check if resource has src option
   * @param key
   * @returns {boolean}
   */
  hasSrc(key) {
    var resource = this.getResource(key);
    return resource.hasOwnProperty('src');
  }

  /**
   * Return relative resource src (dir + / + file)
   * @param key
   * @returns {string}
   */
  getRelativeSrc(key) {
    if (!this.hasSrc(key)) {
      throw new Error(`Source (@src) option for "${key}" resource is not defined`);
    }

    var resource = this.getResource(key);

    return resource.src[0] == '/'
      ? resource.src.slice(1)
      : resource.src;
  }

  /**
   * Return full resource src (dir + / + file)
   * @param key
   * @returns {string}
   */
  getSrc(key) {
    var src = this.getRelativeSrc(key);
    return join(this[local.src], src);
  }

  /**
   * Return relative resource src directory
   * @param key
   * @returns {string}
   */
  getRelativeLocation(key) {
    var src = this.getRelativeSrc(key).replace(regs.location, '');
    return src ? join(src, '/') : '';
  }


  /**
   * Return full resource src directory
   * @param key
   * @returns {string}
   */
  getLocation(key) {
    var relativeLocation = this.getRelativeLocation(key);
    var location = join(this[local.src], relativeLocation);
    return location ? join(location, '/') : '';
  }


  /**
   * Return resource name
   * @param key
   * @returns {string}
   */
  getName(key) {
    var src = this.getRelativeSrc(key);
    return regs.name.exec(src)[2] || '';
  }
// ---------------------------------------

  /**
   * Return resource config
   * @param key
   * @returns {object}
   */
  getResource(key) {
    if (this[local.resources] && !this[local.resources].hasOwnProperty(key)) {
      throw new Error(`resource "${key}" does not exist`);
    }
    return this[local.resources][key];
  }

  /**
   * Return URL on which resource is available in browser
   * Calculated as / + resource.target + / + resource.rename
   * @param key
   * @returns {string}
   */
  getUrl(key) {
    return toUnifiedPath(
      join('/', this.getRelativeTarget(key), '/', this.getDestName(key))
    );
  }

  hasUrl(key) {
    return !!this.getDestName(key);
  }

  /**
   * Return resource mask. Used for glob or watch functions.
   * Calculated as src + resource.mask || resource.src
   * @param key
   * @returns {string}
   */
  getMask(key) {
    if (!this.hasMask(key)) {
      throw new Error('Can not resolve "mask" for "' + key + '" resource because "src" and "mask" options are not defined');
    }

    var resource = this.getResource(key);
    var mask = resource.mask;

    return join(this[local.src], mask || this.getRelativeSrc(key));
  }

  /**
   * Check if resource has mask
   * @param key
   * @returns {boolean}
   */
  hasMask(key) {
    var resource = this.getResource(key);
    var mask = resource.mask;
    return mask || this.hasSrc(key);
  }

  /**
   * Return resource options
   * @param key
   * @returns {object}
   */
  getOptions(key) {
    var resource = this.getResource(key);
    return resource.options || {};
  }
}
