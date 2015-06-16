import path  from 'path';

export var toUnifiedPath = path => path.replace(/[\\\/]+/g, '/');
export var sep = path.sep === '/' ? '\\x2f' : '\\x5c';
