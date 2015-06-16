'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _path = require('path');

var toUnifiedPath = function toUnifiedPath(path) {
  return path.replace(/[\\\/]+/g, '/');
};
exports.toUnifiedPath = toUnifiedPath;
var sep = _path.osSep === '/' ? '\\x2f' : '\\x5c';
exports.sep = sep;