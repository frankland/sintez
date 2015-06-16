'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var toUnifiedPath = function toUnifiedPath(path) {
  return path.replace(/[\\\/]+/g, '/');
};

exports.toUnifiedPath = toUnifiedPath;
// hm..
var sep = _path2['default'].sep === '/' ? '\\x2f' : '\\x5c';
exports.sep = sep;