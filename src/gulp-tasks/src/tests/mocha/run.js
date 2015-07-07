import mergeStreams from 'merge-stream';

import Server from '../../server';

import HtmlCompile from './copmile-html';
import TestResources from './test-resources';
import Build from './build';

import Base from '../../../base-task';


export default class RunTests extends Base {
  constructor(gulp ,sintez) {
    super(gulp, sintez);
  }

  getDefaultTaskName() {
    return 'tests';
  }

  run(done) {
    var testResources = new TestResources(this.gulp, this.sintez);

    var htmlCompile = new HtmlCompile(this.gulp, this.sintez);
    var build = new Build(this.gulp, this.sintez);

    var tests = this.sintez.getTests();
    var config = tests.getConfig();

    htmlCompile.run();
    testResources.run();

    var builder = build.createBuilder();

    var server = this.sintez.createServer({
      dest: config.tests.getTestDest(),
      builder
    });

    var serverTask = new Server(this.gulp, this.sintez);
    serverTask.start(builder, server);
  }
}
