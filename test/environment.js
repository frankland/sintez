import { expect } from 'chai';
import { join } from 'path';

import Environment from '../src/environment';

var configArrayEntries = join(__dirname, './configs/array-entries.yml');
var notValidConfigPath = join(__dirname, './configs/not-valid.yml');
var notExistingConfigPath = join(__dirname, './configs/not-existing.yml');

var env = Environment.fromPath(configArrayEntries);

describe('Environment class', () => {
  it('should be cool :)', () => {
    var env = Environment.fromPath(configArrayEntries);

    expect(env.get('src')).to.be.equal('test/src/');
    expect(env.get('dest')).to.be.equal('test/dest-array-entries/');
  });

  it('not valid config', () => {
    var env = Environment.fromPath(notValidConfigPath);
  });

  it('not existing config', () => {
    expect(() => new Environment.fromPath(notExistingConfigPath)).to.throw(Error);
  });

  it('resources components', () => {
    expect(env.getResources()).to.be.an('object');
  });
});

