import { resolve } from 'path';
import { argv } from 'yargs';

import Sintez from './components/sintez';

var configName = 'sintez';
var cliName = argv['cong'];

if (cliName) {
  configName = cliName;
}

var configPath = resolve(`${configName}.yml`);

export default Sintez.fromPath(configPath);
