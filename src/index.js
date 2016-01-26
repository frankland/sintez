import { resolve } from 'path';
import { argv } from 'yargs';

import Sintez from './sintez';

var configName = 'sintez';
var cliName = argv['conf'];

if (cliName) {
  configName = cliName;
}

var configPath = resolve(`${configName}.yml`);

//export default Sintez.fromPath(configPath);

module.exports = Sintez.fromPath(configPath);
