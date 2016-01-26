import mergeStreams from 'merge-stream';

import StaticCopy from '../../static/copy';

import Base from '../../../base-task';



export default class Tests extends Base {
  constructor(gulp ,sintez) {
    super(gulp, sintez);
  }

  getDefaultTaskName() {
    return 'test:mocha:resources';
  }

  run() {
    var tests = this.sintez.getTests();
    var config = tests.getConfig();

    var staticCopy = new StaticCopy(this.gulp, this.sintez);

    var streams = mergeStreams();

    var cssCopyStream = staticCopy.copy(config.css);
    streams.add(cssCopyStream);

    var jsCopyStream = staticCopy.copy(config.js);
    streams.add(jsCopyStream);

    return streams;
  }
}
