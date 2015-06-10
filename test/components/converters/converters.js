import { expect } from 'chai';
import { join, resolve } from 'path';

import Environment from '../../../src/environment';
import Entry from '../../../src/components/converters/entry';
import Output from '../../../src/components/converters/output';

var configArrayEntries = join(__dirname, '../../configs/array-entries.yml');
var configObjectEntries = join(__dirname, '../../configs/object-entries.yml');

var envArrayEntries = Environment.fromPath(configArrayEntries);
var envEntriesAsObject = Environment.fromPath(configObjectEntries);


describe('webpack converters ', () => {
  it('entries as array', () => {
    var entries = envArrayEntries.get('webpack.entry');
    var src = envArrayEntries.get('src');

    var converted = Entry.convert(src, entries);

    expect(converted).to.eql([
      './test/src/app/a_a.js',
      './test/src/app/a_b.js',
      './test/src/app/deps/d_a.js',
      './test/src/app/deps/d_b.js',
      './test/src/vendor/v_a.js',
      './test/src/vendor/v_b.js'
    ]);
  });

  it('entries as object', () => {
    var entries = envEntriesAsObject.get('webpack.entry');
    var src = envEntriesAsObject.get('src');

    var converted = Entry.convert(src, entries);

    expect(converted).to.eql({
      app: [
        './test/src/app/a_a.js',
        './test/src/app/a_b.js'
      ],
      deps: [
        './test/src/app/deps/d_a.js',
        './test/src/app/deps/d_b.js'
      ],
      vendor: [
        './test/src/vendor/v_a.js',
        './test/src/vendor/v_b.js'
      ]
    });
  });

  it('output if chunks enabled', () => {
    var dest = envArrayEntries.get('dest');
    var output = envArrayEntries.get('webpack.output');
    var chunks = true;
    var entries = envEntriesAsObject.get('webpack.entry');

    var converted = Output.convert(dest, output, chunks, entries);

    expect(converted).to.eql({
      filename: '[name].js',
      path: resolve('./test/dest-array-entries'),
      urlBase: '/'
    });
  });

  it('output if chunks disabled', () => {
    var dest = envArrayEntries.get('dest');
    var output = envArrayEntries.get('webpack.output');
    var chunks = false;
    var entries = envEntriesAsObject.get('webpack.entry');

    var converted = Output.convert(dest, output, chunks, entries);

    expect(converted).to.eql({
      filename: 'build.js',
      path: resolve('./test/dest-array-entries'),
      urlBase: '/'
    });
  });
});
