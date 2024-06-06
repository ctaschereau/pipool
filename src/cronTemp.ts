import config from 'config';
import fs from 'fs';
import { CronJob } from 'cron';

import logger from './basicLogger.ts';
import tempUtils from './tempUtils.ts';

const poolTemperatureReadingsFile = `poolTemp_${new Date().getFullYear()}.csv`;
const outsideTemperatureReadingsFile = `outsideTemp_${new Date().getFullYear()}.csv`;


const getAndWriteNewPoolTemperatureSample = async function():Promise<void> {
    await _getAndWriteNewTemperatureSample(false);
};

const getAndWriteNewOutsideTemperatureSample = async function():Promise<void> {
    await _getAndWriteNewTemperatureSample(true);
};

const _getAndWriteNewTemperatureSample = async function(forOutside: boolean):Promise<void> {
    logger.debug('getAndWriteNewTemperatureSample start');
    let newTempReading, csvFile;
    try {
        if (forOutside) {
            newTempReading = await tempUtils.getOutsideTemp();
            csvFile = outsideTemperatureReadingsFile;
        } else {
            newTempReading = await tempUtils.getPoolTemp();
            csvFile = poolTemperatureReadingsFile;
        }
    } catch (err: any) {
        logger.error(`Could not get temperature reading because of : ${err.message}`);
        return;
    }

    try {
        await fs.promises.appendFile(csvFile, `${new Date().getTime()},${newTempReading}\n`);
    } catch (err: any) {
        logger.error(`Could not write new temperature reading because of : ${err.message}`);
        return;
    }

    logger.debug(`Just logged this temp : ${newTempReading}`);
};

export const start = () => {
    new CronJob(
        // @ts-ignore
        config.samplingIntervalCron,
        async () => {
            await getAndWriteNewPoolTemperatureSample();
            await getAndWriteNewOutsideTemperatureSample();
        },
        null,
        true,
    );
}

