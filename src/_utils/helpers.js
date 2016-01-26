import path  from 'path';

export var toUnifiedPath = path => path.replace(/[\\\/]+/g, '/');
export var sep = path.sep === '/' ? '\\x2f' : '\\x5c';


export var joinUrl = (...agrs) => agrs.join('/')
  .replace(/[\/]+/g, '/')
  .replace(/\/\?/g, '?')
  .replace(/\/\#/g, '#')
  .replace(/\:\//g, '://');
