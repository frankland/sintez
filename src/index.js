import { resolve } from 'path';
import { argv } from 'yargs';

import Environment from './components/environment';
import sintez from './configs/sintez-config';

var configName = sintez.get('env-configs.default-name');
var cliName = argv[sintez.get('env-configs.cli-arg')];

if (cliName) {
  configName = cliName;
}

var configPath = resolve(`${configName}.yml`);

export default Environment.fromPath(configPath);
