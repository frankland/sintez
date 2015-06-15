import gutil from 'gulp-util';

var colors = new Map();

colors.set('red', gutil.colors.red);
colors.set('green', gutil.colors.green);
colors.set('yellow', gutil.colors.yellow);
colors.set('blue', gutil.colors.blue);
colors.set('magenta', gutil.colors.magenta);
colors.set('cyan', gutil.colors.cyan);
colors.set('white', gutil.colors.white);


var max = 10;
var isEnabled = true;

export default class Log {
  constructor(namespace, color) {
    if (namespace.length > 10) {
      throw new Error(`Invalid namespace "${namespace}". Length should be less than 10 :)`);
    }

    this.namespace = namespace;

    var n = max - this.namespace.length;
    var space = (new Array(n > 0 ? n : 0)).join(' ');

    this.title = `${this.namespace.toUpperCase()} ${space}`;

    if (color && colors.has(color)) {
      this.coloring = colors.get(color);
    } else {
      this.coloring = colors.get('white');
    }
  }

  log(message) {
    if (isEnabled) {
      var coloring = this.coloring;
      gutil.log(`${coloring(this.title)} ${message}`);
    }
  }

  updated(options) {
    var coloring = this.coloring;
    var info = '';
    if (options.src) {
      info = coloring(options.src);
    }

    if (options.dest) {
      info += ` -> ${coloring(options.dest)}`;
    }

    this.log(`updated. ${info}`);
  }

  static enable() {
    isEnabled = true;
  }

  static disable() {
    isEnabled = false;
  }
}

export const js = new Log('js', 'cyan');
export const html = new Log('html', 'yellow');
export const less = new Log('less', 'blue');
export const server = new Log('server', 'green');
export const assets = new Log('assets', 'magenta');

