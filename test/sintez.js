import expect from 'expect.js';


import { resolve, join } from '../src/utils/path';
import Sintez from '../src/sintez';

describe('Sintez', () => {
  it('Sintez.fromPath() should return sintez instance', () => {
    let sintez = Sintez.fromPath('test/configs/a.yml');

    expect(sintez).to.be.a(Sintez);
  });

  it('getSrc() should return correct path', () => {
    let sintez = Sintez.fromPath('test/configs/a.yml');

    expect(sintez.getSrc()).to.be('test/src/');
  });

  it('getDest() should return correct path', () => {
    let sintez = Sintez.fromPath('test/configs/a.yml');

    expect(sintez.getDest()).to.be('test/dest/');
  });
});

