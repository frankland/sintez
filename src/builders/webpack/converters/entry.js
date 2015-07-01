import BaseConverter from '../base-converter';

export default class EntryConverter extends BaseConverter {
  getConfig(src, output) {
    var bundle = output.split('.')[0];
    return {
      [bundle]: src
    };
  }
}
