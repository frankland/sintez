import { join } from '../utils/path';

import { joinUrl } from '../utils/helpers';

import { sync as globSync } from 'glob';

import cloneDeep from 'lodash/lang/cloneDeep';
import getter from 'lodash/object/get';
import isArray from 'lodash/lang/isArray';
import isString from 'lodash/lang/isString';
import uniq from 'lodash/array/uniq';

var getName = (path) => {
  return /(.+(?:\/|\\))?(.+\..+)?/.exec(path)[2] || null;
};

var getLocation = (path) => {
  return path.replace(/[^(?:\/|\\)]+$/, '');
};


var normalize = (key, config) => {
  var normalized = {
    originalArraySource: false
  };

  if (!config.src) {
    throw new Error(`Wrong configuration for "${key}" resource: "src" is important option`);
  }

  if (!isArray(config.src)) {
    normalized.src = [config.src];
  } else {
    normalized.src = config.src;
    normalized.originalArraySource = true;
  }

  if (!config.dest) {
    if (!isArray(config.src)) {
      normalized.dest = config.src;
    } else {
      throw new Error(`Wrong configuration for "${key}" resource: "dest" is not defined and could not calculated`);
    }
  } else {
    if (!isString(config.dest)) {
      throw new Error(`Wrong configuration for "${key}" resource: "dest" should be string`);
    }
    normalized.dest = config.dest;
  }

  normalized.target = getLocation(normalized.dest);
  normalized.destName = getName(normalized.dest) || null;

  if (!normalized.destName && !normalized.originalArraySource) {
    normalized.destName = getName(config.src);
  }

  normalized.names = normalized.src.map(path => getName(path));
  var locations = normalized.src.map(path => getLocation(path));
  normalized.locations = uniq(locations);

  if (config.mask) {
    if (isArray(config.mask)) {
      normalized.mask = config.mask;
    } else {
      normalized.mask = [config.mask];
    }
  } else {
    normalized.mask = null;
  }

  normalized.options = config.options || {};

  return normalized;
};


var collectScripts = (paths, resource) => {
  if (!isArray(paths)) {
    paths = [paths];
  }

  var scripts = [];
  for (var path of paths) {
    var collected = globSync(path, {
      nosort: true
    });

    if (collected.length) {
      var processedScripts = collected.map((script) => './' + script);
      scripts = scripts.concat(processedScripts);
    } else {
      throw new Error(`There are no scripts for "${resource}" resource by "${path}" path`);
    }
  }

  return scripts;
};

var local = {
  normalized: Symbol('normalized'),
  src: 'src',
  key: 'key',
  dest: 'dest'
};


export default class Resource {
  constructor(src, dest, key, config) {
    this[local.src] = src;
    this[local.dest] = dest;

    this[local.key] = key;
    this[local.normalized] = normalize(key, config);
  }

  getConfig() {
    return cloneDeep(this[local.normalized]);
  }

  getApplicationSrc() {
    return this[local.src];
  }

  getApplicationDest() {
    return this[local.dest];
  }

  getSrc() {
    var relativeSrc = this.getOriginalSrc();
    var src = this[local.src];
    var resourceSrc = null;

    if (isArray(relativeSrc)) {
      resourceSrc = relativeSrc.map(path => join(src, path));
    } else {
      resourceSrc = join(src, relativeSrc);
    }

    return collectScripts(resourceSrc, this[local.key]);
  }

  getOriginalSrc() {
    var normalized = this[local.normalized];

    var relativeSrc = null;
    if (normalized.originalArraySource) {
      relativeSrc = normalized.src;
    } else {
      relativeSrc = normalized.src[0];
    }

    return relativeSrc;
  }

  getDest() {
    var relativeDest = this.getOriginalDest();
    var dest = this[local.dest];

    return join(dest, relativeDest);
  }

  getOriginalDest() {
    var normalized = this[local.normalized];
    return normalized.dest;
  }

  getMask() {
    var normalized = this[local.normalized];
    var mask = null;

    if (normalized.mask) {
      var src = this[local.src];

      if (isArray(normalized.mask)) {
        mask = normalized.mask.map(path => join(src, path));
      } else {
        mask = join(src, normalized.mask);
      }
    } else {
      mask = this.getSrc();
    }

    return mask;
  }

  /**
   * TODO: redevelop this function.
   * @returns {*}
   */
  getUrl() {
    //if (!this.hasUrl()) {
    //  var key = this[local.key];
    //  throw new Error(`Can not calculate url because destination name is not describe for "${key}".`);
    //}

    var target = this.getRelativeTarget();
    var destName = this.getDestName();

    var url = null;
    if (!destName) {
      /**
       * TODO: update getName method
       */
      var src = this.getSrc();

      if (isArray(src)) {
        url = [];

        for (var resourcePath of src) {
          var resourceUrl = joinUrl('/', target, getName(resourcePath));
          url.push(resourceUrl);
        }
      } else {
        url = joinUrl('/', target, getName(src));
      }

    } else{
      url = joinUrl('/', target, destName);
    }

    return url;
  }

  //hasUrl() {
  //  return this.hasDestName();
  //}

  /**
   * TODO: update getName method - should base on resource src
   */
  getName() {
    var normalized = this[local.normalized];
    var names = null;

    if (normalized.originalArraySource) {
      names = normalized.names;
    } else {
      names = normalized.names[0];
    }

    return names;
  }

  getDestName() {
    var normalized = this[local.normalized];
    return normalized.destName;
  }

  hasDestName() {
    var normalized = this[local.normalized];
    return !!normalized.destName;
  }

  getLocation() {
    var relativeLocation = this.getRelativeLocation();
    var src = this[local.src];

    var location = null;
    if (isArray(relativeLocation)) {
      location = relativeLocation.map(path => join(src, path));
    } else {
      location = join(src, relativeLocation);
    }

    return location;
  }

  getRelativeLocation() {
    var normalized = this[local.normalized];
    var relativeLocation = null;

    if (normalized.originalArraySource) {
      relativeLocation = normalized.locations;
    } else {
      relativeLocation = normalized.locations[0];
    }

    return relativeLocation;
  }

  getTarget() {
    var relativeTarget = this.getRelativeTarget();
    var dest = this[local.dest];

    return join(dest, relativeTarget);
  }

  getRelativeTarget() {
    var normalized = this[local.normalized];
    return normalized.target;
  }

  getOptions(key) {
    var normalized = this[local.normalized];
    var options = null;
    if (!key) {
      options = normalized.options;
    } else {
      options = getter(normalized.options, key) || null;
    }

    return options;
  }
}
