import { expect } from 'chai';
import { join } from 'path';

import sintez from '../test-resources/test-sintez';
import { NotValid, NotExisting } from '../test-resources/test-sintez';

describe('Environment class', () => {
  it('should be cool :)', () => {

    expect(sintez.getSrc()).to.be.equal('test/test-resources/src/');
    expect(sintez.getDest()).to.be.equal('test/test-resources/dest/default/');
  });

  it('should throw exception if config is not valid config', () => {
    expect(() => NotValid()).to.throw(Error);
  });

  it('should throw exception if config does not exist', () => {
    expect(() => NotExisting()).to.throw(Error);
  });
});

