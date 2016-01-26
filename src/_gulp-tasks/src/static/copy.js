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

  copy(resource) {
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
    var resources = this.getResources();

    var streams = null;
    for (var key of copy) {
      var resource = resources.get(key);
      var stream = this.copy(resource);

      if (!streams) {
        streams = mergeStreams(stream);
      } else {
        streams.add(stream);
      }
    }

    return streams;
  }
}
