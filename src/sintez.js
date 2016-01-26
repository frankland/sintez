import { load as JSONfromYml } from 'js-yaml';
import { readFileSync, existsSync } from 'fs';

import { posix as path } from 'path';

import BaseStorage from 'base-storage';

import isString from 'lodash/lang/isString';
import isFunction from 'lodash/lang/isFunction';
import isArray from 'lodash/lang/isArray';
import isObject from 'lodash/lang/isObject';


const { join, dirname } = path;

const normalizeConfig = (config) => {
  return config;
};

const loadYml = (configPath) => {
  if (!existsSync(configPath)) {
    throw new Error(`Sintez config "${configPath}" does not exist"`);
  }

  let configYml = readFileSync(configPath);

  let config = JSONfromYml(configYml);
  let normalized = normalizeConfig(config);

  if (normalized.include) {
    let include = null;

    if (isArray(normalized.include)) {
      include = normalized.include;
    } else {
      include = [normalized.include];
    }

    for (let dependecy of include) {
      let currentDir = dirname(configPath);
      let parentConfigPath = join(currentDir, dependecy);

      let parentConfig = loadYml(parentConfigPath);
      normalized = Object.assign({}, parentConfig, normalized, {
        include: null
      });
    }
  }

  return normalized;
};

const getModuleMutatorName = (key) => `sintez-${key}`;
const getMutatorConfigKey = (key) => `${key}`;
const isValidMutatorKey = (key) => key && isString(key);
const invalidMutatorKey = (key) => new Error(`Mutator key should be a String. at "${key}"`);


const parseArray = (raw, getter) => {
  let parsed = [];

  for (let id of raw) {
    let value = parse(id, getter);

    parsed.push(value);
  }

  return parsed;
};

const parseObject = (raw, getter) => {
  let parsed = {};

  for (let id of Object.keys(raw)) {
    let value = raw[id];
    parsed[id] = parse(value, getter);
  }

  return parsed;
};


const isMagic = (raw) => /^[^\:]+\:.+/.test(raw);

const getMutatorAndSection = (raw) => {
  let [mutatorId, sectionId] = raw.split(':');

  if (!sectionId) {
    sectionId = mutatorId;
    mutatorId = null;
  }

  return {
    mutatorId,
    sectionId
  }
};

const parseTemplate = (raw, getter) => {
  let parsed = null;

  if (isMagic(raw)) {
    parsed = getter(raw);
  } else {
    parsed = raw;
  }

  return parsed;
};

const parse = (raw, getter) => {
  let parsed = null;

  if (isArray(raw)) {
    parsed = parseArray(raw, getter);
  } else if (isObject(raw)) {
    parsed = parseObject(raw, getter);
  } else if (isString(raw)) {
    parsed = parseTemplate(raw, getter);
  } else {
    parsed = raw;
  }

  return parsed;
};

// Private attributes
let _mutators = Symbol('mutators');

export default class Sintez extends BaseStorage {
  constructor(config) {
    super(config);

    this[_mutators] = new Map();
  }

  static fromPath(configPath) {
    let config = loadYml(configPath);
    return new Sintez(config);
  }

  addMutator(id, mutator) {
    this[_mutators].set(id, mutator);
  }

  // -----

  hasMutator(key) {
    return this.hasRegisteredMutator(key) || this.hasModuleMutator(key);
  }

  getMutator(key) {
    let transformer = null;

    if (this.hasRegisteredMutator(key)) {
      transformer = this.getRegisteredMutator(key);
    } else if (this.hasModuleMutator(key)) {
      transformer = this.getModuleMutator(key);
    } else {
      let moduleName = getModuleMutatorName(key);
      throw new Error(`Can not find mutator "${key}". try "npm install --save ${moduleName}"`);
    }

    return transformer;
  }

  // ----

  getRegisteredMutator(key) {
    return this[_mutators].get(key);
  }

  hasRegisteredMutator(key) {
    return this[_mutators].has(key);
  }

  // ----

  getModuleMutator() {
    let path = getModuleMutatorName(key);
    return require(path);
  }

  hasModuleMutator(key) {
    let sintezModuleMutatorName = getModuleMutatorName(key);

    let existsAsModule = false;
    try {
      require.resolve(sintezModuleMutatorName);
      existsAsModule = true;
    } catch (error) {
    }

    return existsAsModule;
  }

  // -----

  set() {
    throw new Error('"set" is not allowed');
  }

  get(id) {
    let {mutatorId, sectionId} = getMutatorAndSection(id);

    let mutator = null;
    if (mutatorId && mutatorId  != 'get') {
      mutator = this.getMutator(mutatorId);
    }

    let raw = super.get(sectionId);
    let parsed = parse(raw, ::this.get);

    if (mutator) {
      parsed = mutator(sectionId, parsed, {
        src: this.getSrc(),
        dest: this.getDest()
      });
    }

    return parsed;
  }

  // -----

  getDest() {
    return super.get('dest');
  }

  getSrc() {
    return super.get('src');
  }
}

