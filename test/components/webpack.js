import { expect } from 'chai';
import { join } from 'path';
//import { sync as rm } from 'rimraf';
import { existsSync } from 'fs';
import { argv } from 'yargs';

import Environment from '../../src/components/environment';

var configArrayEntries = join(__dirname, '../configs/array-entries.yml');
var configObjectEntriesChunks = join(__dirname, '../configs/object-entries-chunks.yml');
var configObjectEntries = join(__dirname, '../configs/object-entries.yml');

var rm = () => {};

describe('webpack', () => {
  it('build when entry is array', (done) => {
    var env = Environment.fromPath(configArrayEntries);
    var dest = env.getDest();
    rm(dest);

    var webpack = env.getWebpack();

    var instance = webpack.getInstance();
    instance.run((err) => {
      if (err === null) {
        var existing = [
          join(dest, 'build.js'),
          join(dest, 'build.js.map')
        ].map((script) => existsSync(script));

        expect(existing.indexOf(false) == -1).to.be.equal(true);

        if (!argv['save-dest']) {
          rm(dest);
        }
      }

      done(err);
    });
  });

  it('build when entry as object with chunks', (done) => {
    var env = Environment.fromPath(configObjectEntriesChunks);
    var dest = env.getDest();
    rm(dest);

    var webpack = env.getWebpack();

    var instance = webpack.getInstance();
    instance.run((err) => {
      if (err === null) {
        var existing = [
          join(dest, 'js/app.js'),
          join(dest, 'js/app.js.map'),

          join(dest, 'js/deps.js.map'),
          join(dest, 'js/deps.js'),

          join(dest, 'js/vendor.js'),
          join(dest, 'js/vendor.js.map')
        ].map((script) => existsSync(script));

        expect(existing.indexOf(false) == -1).to.be.equal(true);

        if (!argv['save-dest']) {
          rm(dest);
        }
      }

      done(err);
    });
  });

  it('build when entry as object without chunks', (done) => {
    var env = Environment.fromPath(configObjectEntries);
    var dest = env.getDest();
    rm(dest);

    var webpack = env.getWebpack();

    var instance = webpack.getInstance();
    instance.run((err) => {
      if (err === null) {
        var existing = [
          join(dest, 'js/build.js'),
          join(dest, 'js/build.js.map')
        ].map((script) => existsSync(script));

        expect(existing.indexOf(false) == -1).to.be.equal(true);

        if (!argv['save-dest']) {
          rm(dest);
        }
      }

      done(err);
    });
  });
});
