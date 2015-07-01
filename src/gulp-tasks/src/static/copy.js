//import gulp from 'gulp';
import plumber from 'gulp-plumber';

import mergeStreams from 'merge-stream';
import rename from 'gulp-rename';

import { join } from '../../../utils/path';
import Base from '../../base-task';

export default class StaticCopy extends Base {
  getDefaultTaskName() {
    return 'static:copy';
  }

  copy(key) {
    var resources = this.getResources();
    var resource = resources.get(key);

    var mask = resource.getMask();
    var dest = resource.getTarget();

    var options = resource.getOptions();

    var stream = this.gulp.src(mask, options)
      .pipe(plumber());

    var toPath = dest;

    var destName = resource.getDestName();

    if (destName) {
      stream.pipe(rename(destName));
      toPath = join(dest, destName);
    }

    stream.pipe(this.gulp.dest(dest))
      .on('end', () => {
        this.logger.updated({
          src: mask,
          dest: toPath
        });
      });

    return stream;
  }


  run() {
    var copy = this.sintez.get('copy') || [];

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
