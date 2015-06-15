//import gulp from 'gulp';
import { join } from 'path';
import mergeStreams from 'merge-stream';
import rename from 'gulp-rename';

//import gutil from 'gulp-util';

//import { assets as logger } from '../../../components/log';


import Base from '../../base-task';

export default class StaticCopy extends Base {
  getDefaultTaskName() {
    return 'static:copy';
  }

  copy(key) {
    var resources = this.getResources();

    var mask = resources.getMask(key);
    var dest = resources.getTarget(key);

    var options = resources.getOptions(key);

    var stream = this.gulp.src(mask, options);

    var toPath = dest;
    if (resources.hasDestName(key)) {
      var name = resources.getDestName(key);
      stream.pipe(rename(name));
      toPath = join(dest, name);
    }

    stream.pipe(this.gulp.dest(dest))

      .on('end', () => {
        //logger.updated({
        //  src: mask,
        //  dest: toPath
        //});
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
