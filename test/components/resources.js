import { expect } from 'chai';
import { join } from 'path';

import Environment from '../../src/components/environment';

var configArrayEntries = join(__dirname, '../configs/array-entries.yml');


var env = Environment.fromPath(configArrayEntries);
var resources = env.getResources();



describe('resources', () => {
  it('get resource', () => {
    expect(resources.getResource('less')).to.be.an('object');
    expect(() => resources.getResource('x')).to.throw(Error);
  });

  it('has destination', () => {
    expect(resources.hasDest('less')).to.be.equal(true);
    expect(resources.hasDest('favicon')).to.be.equal(true);
    expect(resources.hasDest('html')).to.be.equal(true);
    expect(resources.hasDest('yml')).to.be.equal(true);
  });

  it('get relative destination', () => {
    expect(resources.getRelativeDest('less')).to.be.equal('ui/app.css');
    expect(resources.getRelativeDest('favicon')).to.be.equal('favicon.ico');
    expect(resources.getRelativeDest('html')).to.be.equal('root/index.html');
  });

  it('get destination', () => {
    expect(resources.getDest('less')).to.be.equal('test/dest-array-entries/ui/app.css');
    expect(resources.getDest('favicon')).to.be.equal('test/dest-array-entries/favicon.ico');
    expect(resources.getDest('html')).to.be.equal('test/dest-array-entries/root/index.html');
  });

  it('get relative target', () => {
    expect(resources.getRelativeTarget('less')).to.be.equal('ui/');
    expect(resources.getRelativeTarget('favicon')).to.be.equal('');
    expect(resources.getRelativeTarget('html')).to.be.equal('root/');
  });

  it('get target', () => {
    expect(resources.getTarget('less')).to.be.equal('test/dest-array-entries/ui/');
    expect(resources.getTarget('favicon')).to.be.equal('test/dest-array-entries/');
    expect(resources.getTarget('html')).to.be.equal('test/dest-array-entries/root/');
  });

  it('get dest name', () => {
    expect(resources.getDestName('less')).to.be.equal('app.css');
    expect(resources.getDestName('favicon')).to.be.equal('favicon.ico');
    expect(resources.getDestName('html')).to.be.equal('index.html');
  });

  // -----------
  it('has src', () => {
    expect(resources.hasSrc('less')).to.be.equal(true);
    expect(resources.hasSrc('favicon')).to.be.equal(true);
    expect(resources.hasSrc('html')).to.be.equal(true);
  });

  it('get relative src', () => {
    expect(resources.getRelativeSrc('less')).to.be.equal('css/index.less');
    expect(resources.getRelativeSrc('favicon')).to.be.equal('favicon.ico');
    expect(resources.getRelativeSrc('html')).to.be.equal('index.jade');
  });

  it('get src', () => {
    expect(resources.getSrc('less')).to.be.equal('test/src/css/index.less');
    expect(resources.getSrc('favicon')).to.be.equal('test/src/favicon.ico');
    expect(resources.getSrc('html')).to.be.equal('test/src/index.jade');
  });

  it('get relative location', () => {
    expect(resources.getRelativeLocation('less')).to.be.equal('css/');
    expect(resources.getRelativeLocation('favicon')).to.be.equal('');
    expect(resources.getRelativeLocation('html')).to.be.equal('');
  });

  it('get location', () => {
    expect(resources.getLocation('less')).to.be.equal('test/src/css/');
    expect(resources.getLocation('favicon')).to.be.equal('test/src/');
    expect(resources.getLocation('html')).to.be.equal('test/src/');
  });

  it('get name', () => {
    expect(resources.getName('less')).to.be.equal('index.less');
    expect(resources.getName('favicon')).to.be.equal('favicon.ico');
    expect(resources.getName('html')).to.be.equal('index.jade');
  });

  it('get mask', () => {
    expect(resources.getMask('less')).to.be.equal('test/src/css/**/*.less');
    expect(resources.getMask('favicon')).to.be.equal('test/src/favicon.ico');
    expect(resources.getMask('html')).to.be.equal('test/src/index.jade');
  });

  it('get url', () => {
    expect(resources.getUrl('less')).to.be.equal('/ui/app.css');
    expect(resources.getUrl('favicon')).to.be.equal('/favicon.ico');
    expect(resources.getUrl('html')).to.be.equal('/root/index.html');
  });
});

