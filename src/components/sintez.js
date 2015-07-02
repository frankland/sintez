import '../utils/polyfills';

import { load as JSONfromYml } from 'js-yaml';
import { readFileSync, existsSync } from 'fs';
import { resolve, join, dirname } from '../utils/path';

import ObjectDescription from 'object-description';

import getter from 'lodash/object/get';
import merge from 'lodash/object/merge';
import isArray from 'lodash/lang/isArray';

import Resources from './resoruces';
import Builder from './builder';
import Server from './server';


function getOrderedUrls(original, resources) {
  var urls = [];
  var originalResource = resources.get(original);
  var order = originalResource.getOptions('order');

  if (order) {
    for (var item of order) {
      var url = null;
      if (item[0] == '^') {
        var dependency = item.slice(1);
        var resource = resources.get(dependency);
        url = resource.getUrl();
      } else {
        url = item;
      }

      if (isArray(url)) {
        urls = urls.concat(url);
      } else {
        urls.push(url);
      }
    }
  } else {
    urls = originalResource.getUrl();
  }

  return urls;
}


function getDefaults(src, dest) {
  return ObjectDescription.create({
    'src': src,
    'dest': dest,
    //'resources': {
    //  'index': {
    //    src: 'index.html'
    //  },
    //  'js': {
    //    src: [
    //      'js/index.js'
    //    ]
    //  },
    //  'css': {
    //    src: [
    //      'less/index.less'
    //    ]
    //  }
    //},
    //'style': ['less'],
    //'scripts': ['js'],
    'source-maps': true,
    //'server.application': 'webpack-server',
    //'server.port': 9001,
    //'server.host': 'localhost',

    'builder': 'webpack',
    //'entry.js/index-build': join(src, '/index.js'),
    debug: false,

    //'output': 'index-build.js',
    'errorDetails': true,
    'loaders.babel': [
      join(src, '.+\.js$')
    ],
    'loaders.yaml': [
      join(src, '.+\.yml$')
    ],
    'loaders.html': [
      join(src, '.+\.html$')
    ],
    'loaders.json': [
      join(src, '.+\.json$')
    ],
    'loaders.jade': [
      join(src, '.+\.jade')
    ],

    'target': 'web',
    'devtool': 'eval',

    'server': 'webpack',
    'host': 'localhost',
    'port': 9001,
    'livereload': 35729
  });
}

var local = {
  config: Symbol('config'),
  resources: Symbol('resources'),
  builder: Symbol('builder')
};

export default class Sintez {
  constructor(config) {
    var validation = this.validate(config);

    if (!validation.isValid) {
      throw new Error(`Invalid sintez config. ${validation.errors.join(', ')}`);
    }

    var defaultConfig = getDefaults(config.src, config.dest);
    this[local.config] = merge(defaultConfig, config);
  }

  static loadYml(configPath) {
    if (!existsSync(configPath)) {
      throw new Error(`Sintez config "${configPath}" does not exist"`);
    }

    var configYml = readFileSync(configPath);

    var config = JSONfromYml(configYml);

    if (config.extend) {
      var currentDir = dirname(configPath);
      var parentConfigPath = join(currentDir, config.extend);

      var parentConfig = Sintez.loadYml(parentConfigPath);

      config = merge(parentConfig, config);
    }

    return config;
  }

  static fromPath(configPath) {

    var config = Sintez.loadYml(configPath);

    return new Sintez(config);
  }

  validate(config) {
    var errors = [];
    if (!config.src) {
      errors.push('"src" is not defined');
    }

    if (!config.dest) {
      errors.push('"dest" is not defined');
    }

    return {
      isValid: !errors.length,
      errors: errors
    }
  }

  getConfig() {
    return this[local.config];
  }

  addResource(key, resource) {

  }

  getResources() {
    if (!this[local.resources]) {
      var src = this.getSrc();
      var dest = this.getDest();
      var resourcesConfig = this.get('resources');

      this[local.resources] = new Resources(src, dest, resourcesConfig);
    }

    return this[local.resources];
  }

  getBuilder() {
    if (!this[local.builder]) {
      var resources = this.getResources();
      var js = resources.get('js');

      this[local.builder] = new Builder({
        builder: this.get('builder'),
        src: this.getSrc(),
        dest: this.getDest(),

        js,
        //output: js.getOriginalDest(),
        //entry: js.getOriginalSrc(),
        debug: this.get('debug'),
        loaders: this.get('loaders'),

        alias: this.get('alias'),
        resolve: this.get('resolve')
      });
    }

    return this[local.builder];
  }

  getServer() {
    if (!this[local.server]) {
      var resources = this.getResources();
      var index = resources.get('index');

      this[local.server] = new Server({
        builder: this.getBuilder(),
        server: this.get('server'),

        src: this.getSrc(),
        dest: this.getDest(),

        host: this.get('host'),
        port: this.get('port'),

        index: index.getDest()
      });
    }

    return this[local.server];
  }

  get(key) {
    return getter(this[local.config], key);
  }

  has(key) {
    return !!this.get(key);
  }

  getDest() {
    return this.get('dest');
  }

  getSrc() {
    return this.get('src');
  }

  // ------------ OUTPUT --------------

  getOutputScripts() {
    var resources = this.getResources();
    var output = null;

    if (resources.has('js')) {
      output = getOrderedUrls('js', resources);
    }
    return output;
  }

  getOutputStyles() {
    var resources = this.getResources();
    var output = null;

    if (resources.has('css')) {
      output = getOrderedUrls('css', resources);
    }
    return output;
  }
}
