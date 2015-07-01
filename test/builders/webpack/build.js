import { expect } from 'chai';
import { join, resolve } from 'path';
import { sync as rm } from 'rimraf';

import sintez from '../../test-resources/test-sintez';
import { withChunks as sintezWithChunks } from '../../test-resources/test-sintez';


var builder = sintez.getBuilder();
var webpackBuilder = builder.getApplicationBuilder();

var builderWithChunks = sintezWithChunks.getBuilder();
var webpackBuilderWithChunks = builderWithChunks.getApplicationBuilder();

describe('Webpack build', () => {
  it('should build correct scripts', (done) => {
    var dest = sintez.getDest();
    rm(dest);

    webpackBuilder.run(err => done(err));
  });

  it('should build correct splitted scripts', (done) => {
    var dest = sintezWithChunks.getDest();
    rm(dest);

    webpackBuilderWithChunks.run(err => done(err));
  });
});
