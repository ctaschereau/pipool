import config from 'config';
import fs from 'fs';
import { CronJob } from 'cron';

import logger from './basicLogger.ts';
import tempUtils from './tempUtils.ts';

const poolTemperatureReadingsFile = `poolTemp_${new Date().getFullYear()}.csv`;
const outsideTemperatureReadingsFile = `outsideTemp_${new Date().getFullYear()}.csv`;


const getAndWriteNewPoolTemperatureSample = async function():Promise<void> {
    logger.debug('getAndWriteNewPoolTemperatureSample called');
    await _getAndWriteNewTemperatureSample(false);
};

const getAndWriteNewOutsideTemperatureSample = async function():Promise<void> {
    logger.debug('getAndWriteNewOutsideTemperatureSample called');
    await _getAndWriteNewTemperatureSample(true);
};

const _getAndWriteNewTemperatureSample = async function(forOutside: boolean):Promise<void> {
    const sampleType = forOutside ? 'outside' : 'pool';
    logger.debug(`getAndWriteNewTemperatureSample start (${sampleType})`);
    let newTempReading, csvFile;
    try {
        if (forOutside) {
            logger.debug(`Fetching outside temperature from weather API (cityID=${config.cityIDForWeatherService})`);
            newTempReading = await tempUtils.getOutsideTemp();
            csvFile = outsideTemperatureReadingsFile;
        } else {
            logger.debug(`Fetching pool temperature from ${config.tempServerUrl}`);
            newTempReading = await tempUtils.getPoolTemp();
            csvFile = poolTemperatureReadingsFile;
        }
        logger.debug(`Received ${sampleType} temperature reading: ${newTempReading}`);
    } catch (err: any) {
        logger.error(`Could not get ${sampleType} temperature reading because of : ${err.message}`);
        return;
    }

    const line = `${new Date().getTime()},${newTempReading}\n`;
    try {
        logger.debug(`Appending to ${csvFile}: ${line.trim()}`);
        await fs.promises.appendFile(csvFile, line);
        logger.debug(`Successfully wrote ${sampleType} temperature ${newTempReading} to ${csvFile}`);
    } catch (err: any) {
        logger.error(`Could not write new ${sampleType} temperature reading to ${csvFile} because of : ${err.message}`);
        return;
    }

    logger.debug(`Just logged this temp : ${newTempReading}`);
};

export const start = () => {
    logger.info(`Starting temperature sampling cron (expression="${config.samplingIntervalCron}")`);
    logger.debug(`CSV files: pool=${poolTemperatureReadingsFile}, outside=${outsideTemperatureReadingsFile}`);

    const job = new CronJob(
        config.samplingIntervalCron,
        async () => {
            logger.debug(`Cron tick fired at ${new Date().toISOString()}`);
            try {
                await getAndWriteNewPoolTemperatureSample();
                await getAndWriteNewOutsideTemperatureSample();
                logger.debug('Cron tick completed successfully');
            } catch (err: any) {
                logger.error(`Cron tick failed: ${err.message}`);
            }
        },
        null,
        true,
    );

    logger.info(`Temperature sampling cron started (next run: ${job.nextDate().toISO()})`);
}
