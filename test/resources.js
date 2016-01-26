import expect from 'expect.js';

import { resolve, join } from '../src/utils/path';
import Sintez from '../src/sintez';

describe('Resources', () => {
  it('getResources(key) should return correct resource instance', () => {
    let path = join(__dirname, './configs/a.yml');
    let sintez = Sintez.fromPath(path);

    let resources = sintez.get('resources');
  });
});

