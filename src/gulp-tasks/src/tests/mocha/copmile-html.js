import mergeStreams from 'merge-stream';

import HtmlCompile from '../../html/compile';
import StaticCopy from '../../static/copy';
import Server from '../../server';

import Base from '../../../base-task';


export default class Tests extends Base {
  constructor(gulp ,sintez) {
    super(gulp, sintez);
  }
  getDefaultTaskName() {
    return 'tests:mocha:index';
  }

  run(done) {
    var tests = this.sintez.getTests();
    var config = tests.getConfig();

    var htmlCompile = new HtmlCompile(this.gulp, this.sintez);

    var title = config.tests.getOptions('title') || 'Tests';

    var setupOptions = config.tests.getOptions('setup');
    var setup = null;
    if (setupOptions) {
      setup = setupOptions;
    } else {
      setup = 'bdd';
    }

    return htmlCompile.compile(config.index, {
      css: {
        src: config.css.getUrl(),
        tpl: '<link href="%s" rel="stylesheet"/>'
      },
      js: {
        src: config.js.getUrl(),
        tpl: '<script src="%s"></script>'
      },
      tests: {
        src: config.tests.getUrl(),
        tpl: '<script src="%s"></script>'
      },
      setup: {
        src: JSON.stringify(setup),
        tpl: '<script>mocha.setup(%s);</script>'
      },
      title
    });
  }
}
