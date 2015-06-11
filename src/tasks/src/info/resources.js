import Table from 'cli-table';
import gutil from 'gulp-util';
import { join } from 'path';

import Base from '../../base';

import helpers from '../../../utils/helpers';

export default class ResourcesInfo extends Base {

  run() {
    var resources = this.env.getResources();
    var config = resources.getConfig();
    var copy = this.env.get('copy') || [];

    var InfoTable = new Table({
      head: ['Resource', 'Src', 'Mask', 'Dest', 'Copy', 'Url']
    });

    for (var key of Object.keys(config)) {
      var item = [
        gutil.colors.green(key)
      ];

      if (resources.hasSrc(key)) {
        item.push(resources.getSrc(key));
      } else {
        item.push('-');
      }

      if (resources.hasMask(key)) {
        item.push(resources.getMask(key));
      } else {
        item.push('-');
      }

      if (resources.hasDest(key)) {
        item.push(resources.getDest(key));
      } else {
        item.push('-');
      }

      if (copy.indexOf(key) != -1) {
        item.push('yes');
      } else {
        item.push('no');
      }

      if (resources.hasDest(key)) {
        var mask = resources.getMask(key);
        var path = null;
        if (resources.getDestName(key)) {
          path = join(resources.getUrl(key));
        } else {
          path = join(resources.getUrl(key), '/', mask);
        }

        item.push(helpers.toUnifiedPath(path));
      } else {
        item.push('-');
      }

      InfoTable.push(item);
    }

    return () => console.log(InfoTable.toString());
  }
}
