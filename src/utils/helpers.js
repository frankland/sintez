import path  from 'path';

export var toUnifiedPath = path => path.replace(/[\\\/]+/g, '/');git
export var sep = path.sep === '/' ? '\\x2f' : '\\x5c';
