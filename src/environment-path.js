import { load as JSONfromYml } from 'js-yaml';
import { readFileSync, existsSync } from 'fs';
import { resolve, join } from 'path';
import { argv } from 'yargs';
import gulpUtil from 'gulp-util';

import Environment from './environment';
import sintez from './sintez-config';


export default (configPath) => {
  if (!configPath) {
    configPath = getConfigPath();
  }

  if (!existsSync(configPath)) {
    throw new Error(`Environment config "${configPath}" does not exist"`);
  }

  if (!existsSync(configPath)) {
    throw new Error(`Environment config "${configPath}" does not exist"`);
  }

  var configYml = readFileSync(configPath);
  var environmentConfig = JSONfromYml(configYml);

  return new Environment(environmentConfig);
}

export function getConfigPath() {
  var name = sintez.get('env-configs.default-name');
  var cliConfigName = argv[sintez.get('env-configs.cli-arg')];

  if (cliConfigName) {
    name = cliConfigName;
  } else {
    gulpUtil.log('Using default config. To use custom add "--conf=%config%" argument');
  }

  var relativeConfigPath = join(sintez.get('env-configs.dir'), name + '.yml');
  return resolve(relativeConfigPath);
}
