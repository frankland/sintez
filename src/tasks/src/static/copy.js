import gulp from 'gulp';
import { join } from 'path';
import mergeStreams from 'merge-stream';
import rename from 'gulp-rename';

import gutil from 'gulp-util';

import { assets as logger } from '../../../components/log';


import Base from '../../base-task';

export default class StaticCopy extends Base {
  getResources() {
    return this.env.getResources();
  }

  getDefaultTaskName() {
    return 'static:copy';
  }

  copy(key) {
    var resources = this.getResources();

    var mask = resources.getMask(key);
    var dest = resources.getTarget(key);

    var options = resources.getOptions(key);

    var stream = gulp.src(mask, options);

    var toPath = dest;
    if (resources.hasDestName(key)) {
      var name = resources.getDestName(key);
      stream.pipe(rename(name));
      toPath = join(dest, name);
    }

    stream.pipe(gulp.dest(dest))
      .on('end', () => {
        logger.updated({
          src: mask,
          dest: toPath
        });
      });

    return stream;
  }

  exportCopy(key) {
    return this.copy.bind(this, key);
  }

  run() {
    var copy = this.env.get('copy') || [];

    var streams = null;

    for (var key of copy) {
      var stream = this.copy(key);

      if (!streams) {
        streams = mergeStreams(stream);
      } else {
        streams.add(stream);
      }
    }

    return streams;
  }
}
