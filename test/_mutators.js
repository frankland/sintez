import expect from 'expect.js';

import { resolve, join } from '../src/utils/path';
import Sintez from '../src/sintez';
import Resource from '../src/mutators/resources/resource';


class FooTransformer {
  constructor(config) {
    this.config = config;
  }

  getA() {
    return this.config.a;
  }

  getB() {
    return this.config.b;
  }

  getJs() {
    return this.config.js;
  }
}

describe('Sintez mutators', () => {
  it('mutate(ket, section) should throw exception if mutator is not exists ', () => {
    let path = join(__dirname, './configs/a.yml');
    let sintez = Sintez.fromPath(path);

    expect(() => {
      sintez.transform('unexisting-mutator');
    }).to.throwError();
  });

  it('addMutator() - add and transform with custom mutator. If mutators dependencies are not defined - use mutator name as key', () => {
    let path = join(__dirname, './configs/a.yml');
    let sintez = Sintez.fromPath(path);

    sintez.addMutator('simple', (config) => {
      let simple = config.simple;
      return simple.b + 10;
    });

    let mutator = sintez.mutate('simple');
    expect(mutator).to.be.equal(11);
  });


  it('mutate with custom added mutator + sintez.collect(mutatorKey)', () => {
    let path = join(__dirname, './configs/a.yml');
    let sintez = Sintez.fromPath(path);

    sintez.addMutator('foo', (config) => {
      return new FooTransformer(config);
    });

    let mutator = sintez.mutate('foo');

    expect(mutator.config.applicationSrc).to.be.equal(sintez.getSrc());
    expect(mutator.config.applicationDest).to.be.equal(sintez.getDest());

    expect(mutator.getA()).to.be.eql({
      b: 1
    });

    expect(mutator.getB()).to.be.equal(2);
    expect(mutator.getJs()).to.be.a(Resource);
  });

  it('overriding mutator\'s dependencies', () => {
    let path = join(__dirname, './configs/a.yml');
    let sintez = Sintez.fromPath(path);

    sintez.addMutator('foo', (config) => {
      return new FooTransformer(config);
    });

    let mutator = sintez.mutate('foo', {
      a: {
        b: 10
      },
      b: 20
    });

    expect(mutator.config.applicationSrc).to.be.equal(sintez.getSrc());
    expect(mutator.config.applicationDest).to.be.equal(sintez.getDest());

    expect(mutator.getA()).to.be.eql({
      b: 10
    });

    expect(mutator.getB()).to.be.equal(20);
    expect(mutator.getJs()).to.be.a(Resource);
  });

  it('collect(mutatorKey) should throw exception if mutator is not defined but getter exists', () => {
    let path = join(__dirname, './configs/a.yml');
    let sintez = Sintez.fromPath(path);

    sintez.addMutator('bar', (config) => {
      return config.bar;
    });

    expect(() => {
      sintez.mutate('bar');
    }).to.throwException(/mutator "c.a" does not exists but getArgument is described/);
  });

  it('collect(mutatorKey) should throw exception if mutatorKey is not String', () => {
    let path = join(__dirname, './configs/a.yml');
    let sintez = Sintez.fromPath(path);

    sintez.addMutator('bar', (config) => {
      return config.bar;
    });

    expect(() => {
      sintez.mutate([]);
    }).to.throwException(/Mutator key should be a String./);

    expect(() => {
      sintez.collect([]);
    }).to.throwException(/Mutator key should be a String./);
  });

  it('collect(mutatorKey) should throw exception if mutator value has wrong format', () => {
    let path = join(__dirname, './configs/a.yml');
    let sintez = Sintez.fromPath(path);

    sintez.addMutator('baz', (config) => {
      return config.bar;
    });

    expect(() => {
      sintez.mutate('baz');
    }).to.throwException(/Wrong mutator\'s dependency config "a"/);
  });

  it('collect(mutatorKey) should throw exception if getter is defined but mutator is not', () => {
    let path = join(__dirname, './configs/a.yml');
    let sintez = Sintez.fromPath(path);

    sintez.addMutator('foo', (config) => {
      return config;
    });

    sintez.addMutator('daz', (config) => {
      return config.daz;
    });

    expect(() => {
      sintez.mutate('daz');
    }).to.throwException(/mutator "foo" does not support getters/);
  });

  it('mutate(mutatorKey) custom section', () => {
    let path = join(__dirname, './configs/a.yml');
    let sintez = Sintez.fromPath(path);

    sintez.addMutator('simple', (config) => {
      return config.simple;
    });

    let mutated = sintez.mutate('simple:complex');
    expect(mutated).to.be.eql({
      a: {
        b: 2
      }
    })
  });
});

