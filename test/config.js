import { expect } from 'chai';

import config from '../src/sintez-config';

describe('Sintez config', () => {
  it('should have keys', () => {

    expect(config).to.be.an('object');
    expect(config.has('env-configs.default-name')).to.be.equal(true);
    expect(config.has('env-configs.dir')).to.be.equal(true);
    expect(config.has('env-configs.cli-arg')).to.be.equal(true);
    expect(config.has('webpack')).to.be.equal(true);
  });
});

