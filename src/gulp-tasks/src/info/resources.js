import isArray from 'lodash/lang/isArray';

import { argv } from 'yargs';

import pretty from 'prettyjson';

import Table from 'cli-table';
import gutil from 'gulp-util';
import { join } from '../../../utils/path';

import Base from '../../base-task';

import { toUnifiedPath } from '../../../utils/helpers';

var selected = argv['r'];
export default class ResourcesInfo extends Base {
  getDefaultTaskName() {
    return 'info:resources';
  }

  run() {
    var resources = this.sintez.getResources();
    var config = resources.getConfig();
    var copy = this.sintez.get('copy') || [];

    var table = new Table({
      head: ['Resource', 'Src', 'Mask', 'Dest', 'Copy', 'Url', 'Options']
    });

    for (var key of Object.keys(config)) {
      if (selected && selected != key) {
        continue;
      }

      var item = [
        gutil.colors.green(key)
      ];

      var resource = resources.get(key);

      // ----- src -------
      var src = resource.getSrc();
      var resourceSrc = pretty.render(src);
      item.push(resourceSrc);

      // ----- mask -------
      var mask = resource.getMask();
      var resourceMask = pretty.render(mask);
      item.push(resourceMask);

      // ----- dest -------
      var dest = resource.getDest();
      var resourceDest = pretty.render(dest);
      item.push(resourceDest);

      // ----- copy -------
      item.push(copy.indexOf(key) != -1 ? '+': '-');

      // ----- url -------
      var resourceUrl = null;
      if (resource.hasUrl()) {
        var url = resource.getUrl();
        resourceUrl =  pretty.render(url);
      } else {
        resourceUrl = '-';
      }
      item.push(resourceUrl);

      // ----- options -------
      var resourceOptions = null;
      var options = resource.getOptions();
      if (Object.keys(options).length) {
        resourceOptions = pretty.render(options);
      } else {
        resourceOptions = '-';
      }
      item.push(resourceOptions);

      table.push(item);
    }

    var outputTable = new Table({
      head: ['Scripts', 'Styles']
    });

    var scripts = this.sintez.getOutputScripts();
    var styles = this.sintez.getOutputStyles();

    outputTable.push([
      pretty.render(scripts),
      pretty.render(styles)
    ]);

    console.log(table.toString());
    console.log(outputTable.toString());
  }
}
