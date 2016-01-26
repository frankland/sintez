import { resolve, join } from 'path';

import Sintez from '../../src/components/sintez';

var notValidConfigPath = join(__dirname, './configs/not-valid.yml');
var notExistingConfigPath = join(__dirname, './configs/not-existing.yml');

var defaultConfigPath = join(__dirname, './configs/default.yml');
var defaultChunksConfigPath = join(__dirname, './configs/default-chunks.yml');



export var NotValid = () => Sintez.fromPath(notValidConfigPath);
export var NotExisting = () => Sintez.fromPath(notExistingConfigPath);

export default Sintez.fromPath(defaultConfigPath);
export var withChunks =  Sintez.fromPath(defaultChunksConfigPath);


