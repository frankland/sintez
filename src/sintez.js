import { load as JSONfromYml } from 'js-yaml';
import { readFileSync, existsSync } from 'fs';

import path from 'path';

import { argv } from 'yargs';

import chalk from 'chalk';
import prettyJson from 'prettyjson';

import BaseStorage from 'base-storage';

import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import isRegexp from 'lodash/isRegexp';
import isDate from 'lodash/isDate';


const { join, dirname } = path;

const normalizeConfig = (config) => {
  return config;
};

const loadYml = (configPath) => {
  let normalized = {};
  let warnings = [];
  let includes = [];

  if (existsSync(configPath)) {
    includes.push(configPath);

    let configYml = readFileSync(configPath);

    let config = JSONfromYml(configYml);
    normalized = normalizeConfig(config);

    if (normalized.include) {
      let include = null;

      if (isArray(normalized.include)) {
        include = normalized.include;
      } else {
        include = [normalized.include];
      }

      for (let dependency of include) {
        let currentDir = dirname(configPath);
        let parentConfigPath = join(currentDir, dependency);

        let included = loadYml(parentConfigPath);

        normalized = Object.assign({}, included.config, normalized, {
          include: null
        });

        warnings = warnings.concat(included.warnings);
        includes = includes.concat(included.includes);
      }
    }
  } else {
    warnings.push(`Sintez config "${chalk.cyan(configPath)}" ${chalk.red.bold('DOES NOT EXIST. Will be ignored')}`);
  }

  return {
    config: normalized,
    warnings,
    includes
  };
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


const isMagic = (raw) => /^([^\~]+\~)+/.test(raw);

const getMutatorsAndSection = (raw) => {
  let mutatorIds = raw.split('~');
  let sectionId = mutatorIds.pop();

  return {
    mutatorIds: mutatorIds.map(mutatorId => mutatorId.trim()).reverse(),
    sectionId: sectionId.trim()
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

  if (isRegexp(raw) || isDate(raw)) {
    parsed = raw;
  } else if (isArray(raw)) {
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

// workarond commonJs
module.exports = class Sintez extends BaseStorage {
  constructor(config) {
    super(config);
    this[_mutators] = new Map();
  }

  static fromPath(configPath) {
    let {config, warnings, includes} = loadYml(configPath);

    if (warnings.length) {
      console.log('Sintez warnings:');
      for (let warning of warnings) {
        console.log(` - ${warning}`);
      }

      console.log('');
    }

    if (includes.length) {
      console.log('Sintez was configured using configs:');
      for (let path of includes) {
        console.log(` - ${path}`);
      }

      console.log('');
    } else {
      throw new Error('Can not configure Sintez. There are no existing configs files');
    }

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
    let {mutatorIds, sectionId} = getMutatorsAndSection(id);

    //let mutators = null;
    //if (mutatorId && mutatorId  != 'get') {
    //  mutator = this.getMutator(mutatorId);
    //}

    //console.log(id, mutatorIds);

    let raw = super.get(sectionId);
    let parsed = parse(raw, ::this.get);

    if (mutatorIds.length) {
      for (let mutatorId of mutatorIds) {

        if (mutatorId != 'get') {
          let mutator = this.getMutator(mutatorId);

          parsed = mutator(sectionId, parsed, {
            src: this.getSrc(),
            dest: this.getDest()
          });
        }
      }
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

  // ----

  raw(path) {
    let key = null;

    if (path) {
      key = path;
    } else {
      key = argv.key;
    }

    let config = null;

    if (key) {
      config = super.get(key);
    } else {
      config = super.get();
    }

    let pretty = prettyJson.render(config);

    console.log('');
    console.log(pretty);
    console.log('');
  }

  render(path) {
    let key = null;

    if (path) {
      key = path;
    } else {
      key = argv.key;
    }

    let config = null;

    if (key) {
      config = this.get(key);
    } else {
      config = this.raw();
    }

    let pretty = prettyJson.render(config);

    console.log('');
    console.log(pretty);
    console.log('');
  }
};

