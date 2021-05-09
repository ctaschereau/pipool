import defaultConfig from './default.ts';
// TODO : How to handle if I don't have a local file???
import localConfig from './local.ts';

let config = {
    ...defaultConfig,
    ...localConfig,
};

export default config;
