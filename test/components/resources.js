import { expect } from 'chai';

import sintez from '../test-resources/test-sintez';

var resources = sintez.getResources();


describe('Resources component', () => {

  it('should throw error resource is not defined', () => {
    expect(() => resources.get('less-unexisting')).to.throw(Error);
  });

  it('should throw error if no src', () => {
    expect(() => resources.get('less-without-src')).to.throw(Error);
  });

  // -------------- SRC -------------------

  it('should return valid source and original source paths', () => {
    var less = resources.get('less');

    expect(less.getSrc()).to.eql([
      './test/test-resources/src/less/index.less'
    ]);
    expect(less.getOriginalSrc()).to.eql('less/index.less');
  });

  it('should return valid source and original source paths if src is array', () => {
    var less = resources.get('less-array');

    expect(less.getSrc()).to.eql([
      './test/test-resources/src/less/index.less',
      './test/test-resources/src/less/grid.less'
    ]);
    expect(less.getOriginalSrc()).to.eql([
      'less/index.less',
      'less/grid.less'
    ]);
  });

  // -------------- DEST -------------------

  it('should throw error is dest is not string', () => {
    expect(() => resources.get('less-invalid-dest')).to.throw(Error);
  });

  it('should calc dest automatically if no dest and src is string', () => {
    var less = resources.get('less-without-dest');

    expect(less.getDest()).to.eql('test/test-resources/dest/default/less/index.less');
  });

  it('should throw error if no dest and src is array', () => {
    expect(() => resources.get('less-array-without-dest')).to.throw(Error);
  });

  // -------------- MASK -------------------

  it('should calculate mask automatically', () => {
    var less = resources.get('less');
    expect(less.getMask()).to.be.eql('test/test-resources/src/less/index.less');
  });

  it('should calculate mask automatically if src is array', () => {
    var less = resources.get('less-array');

    expect(less.getMask()).to.be.eql([
      'test/test-resources/src/less/index.less',
      'test/test-resources/src/less/grid.less'
    ]);
  });

  it('should return correct mask', () => {
    var less = resources.get('less-with-mask');
    expect(less.getMask()).to.be.eql('test/test-resources/src/less/**/*.less');
  });

  it('should return correct mask if mask described as array', () => {
    var less = resources.get('less-with-array-mask');
    expect(less.getMask()).to.be.eql([
      'test/test-resources/src/less/**/*.less',
      'test/test-resources/src/less-grid/**/*.less'
    ]);
  });

  // -------------- NAME -------------------

  it('should return correct name', () => {
    var less = resources.get('less');
    expect(less.getName()).to.be.eql('index.less');
  });

  it('should return null if dest without filename', () => {
    var less = resources.get('less-dirs');
    expect(less.getName()).to.be.eql(null);
  });

  it('should return correct name if src is array', () => {
    var less = resources.get('less-array');
    expect(less.getName()).to.be.eql([
      'index.less',
      'grid.less'
    ]);
  });

  // -------------- DEST NAME -------------------
  it('should return correct destination name', () => {
    var less = resources.get('less');
    expect(less.getDestName()).to.be.eql('index.css');
  });

  it('should return null if destination without filename', () => {
    var less = resources.get('less-dirs');
    expect(less.getDestName()).to.be.eql(null);
  });

  // -------------- LOCATION -------------------

  it('should return correct location', () => {
    var less = resources.get('less');
    expect(less.getLocation()).to.be.eql('test/test-resources/src/less/');
  });

  it('should return correct relative location', () => {
    var less = resources.get('less');
    expect(less.getRelativeLocation()).to.be.eql('less/');
  });

  it('should return correct location if src is array', () => {
    var less = resources.get('less-array');
    expect(less.getLocation()).to.be.eql([
      'test/test-resources/src/less/'
    ]);
  });

  it('should return correct relative location if src is array', () => {
    var less = resources.get('less-array');
    expect(less.getRelativeLocation()).to.be.eql([
      'less/'
    ]);
  });

  // -------------- TARGET -------------------

  it('should return correct target', () => {
    var less = resources.get('less');
    expect(less.getTarget()).to.be.eql('test/test-resources/dest/default/ui/');
  });

  it('should return correct relative target', () => {
    var less = resources.get('less');
    expect(less.getRelativeTarget()).to.be.eql('ui/');
  });

  // -------------- URL -------------------

  it('should return correct url', () => {
    var less = resources.get('less');
    expect(less.getUrl()).to.be.eql('/ui/index.css');
  });

  it('should check if url is available', () => {
    var less = resources.get('less-dirs');
    expect(less.hasUrl()).to.be.eql(false);
  });
});

