import config from '../config/config.ts';
import { cron } from 'https://deno.land/x/deno_cron@v1.0.0/cron.ts';

import logger from './basicLogger.ts';
import tempUtils from './tempUtils.ts';

const getAndWriteNewPoolTemperatureSample = async function():Promise<void> {
    await _getAndWriteNewTemperatureSample(config.dataPoolFilePath, false);
};

const getAndWriteNewOutsideTemperatureSample = async function():Promise<void> {
    await _getAndWriteNewTemperatureSample(config.dataOutsideFilePath, true);
};

const _getAndWriteNewTemperatureSample = async function(dataFilePath: string, forOutside: boolean):Promise<void> {
    //logger.debug('getAndWriteNewTemperatureSample start');
    let newTempReading;
    try {
        if (forOutside) {
            newTempReading = await tempUtils.getOutsideTemp();
        } else {
            newTempReading = await tempUtils.getPoolTemp();
        }
    } catch (err) {
        logger.error(`Could not get temperature reading because of : ${err.message}`);
        return;
    }

    let temperatureData = [];
    try {
        let fileContent = await Deno.readTextFile(dataFilePath);
        temperatureData = JSON.parse(fileContent);
    } catch (err) {
        if (err.name === Deno.errors.NotFound.name) {
            await Deno.create(dataFilePath);
        } else {
            logger.error(`Could not read or parse content of file because of ${err.message}`);
            return;
        }
    }
    temperatureData.push([new Date().getTime(), newTempReading]);

    await Deno.writeTextFile(dataFilePath, JSON.stringify(temperatureData, null, 4));
    //logger.debug(`Just logged this temp : ${temperature1}`);
};

export let start = () => {
    cron(config.samplingIntervalCron, async () => {
        await getAndWriteNewPoolTemperatureSample();
        await getAndWriteNewOutsideTemperatureSample();
    });
}

