import { expect } from 'chai';
import { join, resolve } from 'path';

import sintez from '../../test-resources/test-sintez';
import { withChunks as sintezWithChunks } from '../../test-resources/test-sintez';


var builder = sintez.getBuilder();
var webpackBuilder = builder.getApplicationBuilder();

var builderWithChunks = sintezWithChunks.getBuilder();
var webpackBuilderWithChunks = builderWithChunks.getApplicationBuilder();

var resolvedDest = resolve(sintez.getDest());
var resolvedDestWithChunks = resolve(sintezWithChunks.getDest());

describe('Webpack builder', () => {
  it('should return correct output scripts if output path is defined', () => {
    expect(sintez.getOutputScripts()).to.eql([
      'js/node_modules.js',
      'js/vendor.js',
      'js/deps.js',
      'js/bootstrap.js',
      'js/app.js',
      'js/build.js'
    ]);
  });

  it('should return correct output scripts if output path is not defined', () => {
    expect(sintezWithChunks.getOutputScripts()).to.eql([
      'js/build.js'
    ]);
  });

  it('should build entry points correctly if output path is defined', () => {
    var config = webpackBuilder.getConfig();
    var entry = config.entry;

    expect(entry).to.eql({
      'js/build': [
        './test/test-resources/src/vendor/v_a.js',
        './test/test-resources/src/vendor/v_b.js',
        'events',
        './test/test-resources/src/app/deps/d_a.js',
        './test/test-resources/src/app/a_a.js',
        './test/test-resources/src/app/a_b.js'
      ]
    });
  });

  it('should build entry points correctly if output path not is defined', () => {
    var config = webpackBuilderWithChunks.getConfig();
    var entry = config.entry;

    expect(entry).to.eql({
      'js/build': [
        './test/test-resources/src/vendor/v_a.js',
        './test/test-resources/src/vendor/v_b.js',
        'events',
        './test/test-resources/src/app/deps/d_a.js',
        './test/test-resources/src/app/a_a.js',
        './test/test-resources/src/app/a_b.js'
      ]
    });
  });

  it('should build webpack\'s output correctly if output path is not defined', () => {
    var config = webpackBuilder.getConfig();
    var output = config.output;

    expect(output.path).to.eql(resolvedDest);
    expect(output.filename).to.eql('[name].js');
  });

  it('should build webpack\'s output correctly if output path is defined', () => {
    var config = webpackBuilderWithChunks.getConfig();
    var output = config.output;

    expect(output.path).to.eql(resolvedDestWithChunks);
    expect(output.filename).to.eql('[name].js');
  });


  it('should build resolve aliases and modules directories correctly', () => {
    var config = webpackBuilder.getConfig();
    var resolve = config.resolve;

    expect(resolve).to.eql({
      alias: {
        yo: 'events',
        A: 'app/a_a'
      },
      modulesDirectories: [
        'bower_components'
      ]
    });
  });
});
