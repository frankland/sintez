import expect from 'expect.js';

import { resolve, join } from '../src/utils/path';
import Sintez from '../src/sintez';

describe('Sintez mutators', () => {
  it('get/parse', () => {
    let path = join(__dirname, './configs/a.yml');
    let sintez = Sintez.fromPath(path);


    let js = sintez.get('resource:js');
    console.log(js.getSrc());
    //console.log(js.getSrc());
    //console.log(js.getName());
  });
});

