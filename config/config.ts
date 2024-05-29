import { Config } from '../src/deps.ts';

const config = await Config.load({
    file: './default.ts'
})
if (!config) {
    console.log("config is 'undefined' when no config files were found")
}

/*
await Config.load({
    file: 'fileName'
    searchDir: Deno.cwd()
})
*/

export default config;

/*
import defaultConfig from './default.ts';
// TODO : How to handle if I don't have a local file???
import localConfig from './local.ts';

let config = {
    ...defaultConfig,
    ...localConfig,
};

export default config;

*/