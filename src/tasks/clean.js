"use strict";

var rimraf = require('rimraf');

module.exports = function(Env, Webpack) {
  var dist = Env.getDest();

  return function(done) {
    rimraf(dist, done);
  }
};
