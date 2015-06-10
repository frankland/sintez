import { expect } from 'chai';
import { join, resolve } from 'path';

import Environment from '../../../src/environment';
import Entry from '../../../src/components/converters/entry';
import Output from '../../../src/components/converters/output';

var configArrayEntries = join(__dirname, '../../configs/array-entries.yml');
var configObjectEntries = join(__dirname, '../../configs/object-entries.yml');
var configObjectEntriesAndChunks = join(__dirname, '../../configs/object-entries-chunks.yml');

var envArrayEntries = Environment.fromPath(configArrayEntries);
var envEntriesAsObject = Environment.fromPath(configObjectEntries);
var envEntriesAsObjectAndChunks = Environment.fromPath(configObjectEntriesAndChunks);


describe('Output scripts', () => {
  it('should be an array with one element if entry is array', () => {
    var webpack = envArrayEntries.getWebpack();

    expect(webpack.getOutputScripts()).to.eql([
      '/build.js'
    ]);
  });

  it('should be an array if entry is object', () => {
    var webpack = envEntriesAsObjectAndChunks.getWebpack();

    expect(webpack.getOutputScripts()).to.eql([
      '/js/vendor.js',
      '/js/deps.js',
      '/js/app.js'
    ]);
  });

  it('should be an array with one element if entry is object and chunks are disabled', () => {
    var webpack = envEntriesAsObject.getWebpack();

    expect(webpack.getOutputScripts()).to.eql([
      '/js/build.js'
    ]);
  });
});
