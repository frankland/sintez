import { osSep } from 'path';

export var toUnifiedPath = path => path.replace(/[\\\/]+/g, '/');
export var sep = osSep === '/' ? '\\x2f' : '\\x5c';
