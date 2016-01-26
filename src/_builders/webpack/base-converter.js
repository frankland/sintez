export default class BaseConverter {
  constructor(src, dest) {
    this.src = src;
    this.dest = dest;
  }

  convert() {
    throw new Error('@convert method should be implemented');
  }
}
