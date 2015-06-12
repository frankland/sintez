import { expect } from 'chai';

import sintez from '../test-resources/test-sintez';

var resources = sintez.getResources();


describe('Resources component', () => {
  it('should return or throw error if resource does not exists', () => {
    expect(resources.getResource('less')).to.be.an('object');
    expect(() => resources.getResource('x')).to.throw(Error);
  });

  it('should has destination', () => {
    expect(resources.hasDest('less')).to.be.equal(true);
    expect(resources.hasDest('favicon')).to.be.equal(true);
    expect(resources.hasDest('index')).to.be.equal(true);
  });

  it('should return relative destination', () => {
    expect(resources.getRelativeDest('less')).to.be.equal('ui/index.css');
    expect(resources.getRelativeDest('favicon')).to.be.equal('favicon.ico');
    expect(resources.getRelativeDest('index')).to.be.equal('index.html');
  });

  it('should return destination', () => {
    expect(resources.getDest('less')).to.be.equal('test/test-resources/dest/default/ui/index.css');
    expect(resources.getDest('favicon')).to.be.equal('test/test-resources/dest/default/favicon.ico');
    expect(resources.getDest('index')).to.be.equal('test/test-resources/dest/default/index.html');
  });

  it('should return relative target', () => {
    expect(resources.getRelativeTarget('less')).to.be.equal('ui/');
    expect(resources.getRelativeTarget('favicon')).to.be.equal('');
    expect(resources.getRelativeTarget('index')).to.be.equal('');
  });

  it('should return target', () => {
    expect(resources.getTarget('less')).to.be.equal('test/test-resources/dest/default/ui/');
    expect(resources.getTarget('favicon')).to.be.equal('test/test-resources/dest/default/');
    expect(resources.getTarget('index')).to.be.equal('test/test-resources/dest/default/');
  });

  it('should return dest name', () => {
    expect(resources.getDestName('less')).to.be.equal('index.css');
    expect(resources.getDestName('favicon')).to.be.equal('favicon.ico');
    expect(resources.getDestName('index')).to.be.equal('index.html');
    expect(resources.getDestName('specific-image')).to.be.equal('my-logo.png');
  });

  // -----------
  it('should has src', () => {
    expect(resources.hasSrc('less')).to.be.equal(false);
    expect(resources.hasSrc('favicon')).to.be.equal(true);
    expect(resources.hasSrc('index')).to.be.equal(true);
  });

  it('should return relative src', () => {
    expect(resources.getRelativeSrc('specific-image')).to.be.equal('assets/1.png');
    expect(resources.getRelativeSrc('favicon')).to.be.equal('favicon.ico');
    expect(resources.getRelativeSrc('index')).to.be.equal('index.html');
  });

  it('should return src', () => {
    expect(resources.getSrc('specific-image')).to.be.equal('test/test-resources/src/assets/1.png');
    expect(resources.getSrc('favicon')).to.be.equal('test/test-resources/src/favicon.ico');
    expect(resources.getSrc('index')).to.be.equal('test/test-resources/src/index.html');
  });

  it('should return relative location', () => {
    expect(resources.getRelativeLocation('specific-image')).to.be.equal('assets/');
    expect(resources.getRelativeLocation('favicon')).to.be.equal('');
    expect(resources.getRelativeLocation('index')).to.be.equal('');
  });

  it('should return location', () => {
    expect(resources.getLocation('specific-image')).to.be.equal('test/test-resources/src/assets/');
    expect(resources.getLocation('favicon')).to.be.equal('test/test-resources/src/');
    expect(resources.getLocation('index')).to.be.equal('test/test-resources/src/');
  });

  it('should return name', () => {
    expect(resources.getName('specific-image')).to.be.equal('1.png');
    expect(resources.getName('favicon')).to.be.equal('favicon.ico');
    expect(resources.getName('index')).to.be.equal('index.html');
  });

  it('should return mask', () => {
    expect(resources.getMask('less')).to.be.equal('test/test-resources/src/less/**/*.less');
    expect(resources.getMask('favicon')).to.be.equal('test/test-resources/src/favicon.ico');
    expect(resources.getMask('index')).to.be.equal('test/test-resources/src/index.html');
  });

  it('should return url', () => {
    expect(resources.getUrl('less')).to.be.equal('/ui/index.css');
    expect(resources.getUrl('favicon')).to.be.equal('/favicon.ico');
    expect(resources.getUrl('index')).to.be.equal('/index.html');
  });
});

