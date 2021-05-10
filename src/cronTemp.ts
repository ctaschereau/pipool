import config from '../config/config.ts';
import { cron, MongoClient } from './deps.ts';

import logger from './basicLogger.ts';
import tempUtils from './tempUtils.ts';

const client = new MongoClient();
await client.connect(`mongodb://${config.mongoHost}:${config.mongoPort}`);

interface TempSchema {
    _id: { $oid: string };
    date: Date;
    temperature: Number;
}

const db = client.database('pipool');
const poolTemperatureReadings = db.collection<TempSchema>('poolTemp');
const outsideTemperatureReadings = db.collection<TempSchema>('outsideTemp');


const getAndWriteNewPoolTemperatureSample = async function():Promise<void> {
    await _getAndWriteNewTemperatureSample(false);
};

const getAndWriteNewOutsideTemperatureSample = async function():Promise<void> {
    await _getAndWriteNewTemperatureSample(true);
};

const _getAndWriteNewTemperatureSample = async function(forOutside: boolean):Promise<void> {
    //logger.debug('getAndWriteNewTemperatureSample start');
    let newTempReading, collection;
    try {
        if (forOutside) {
            newTempReading = await tempUtils.getOutsideTemp();
            collection = outsideTemperatureReadings;
        } else {
            newTempReading = await tempUtils.getPoolTemp();
            collection = poolTemperatureReadings;
        }
    } catch (err) {
        logger.error(`Could not get temperature reading because of : ${err.message}`);
        return;
    }

    try {
        await collection.insertOne({
            date: new Date(),
            temperature: newTempReading,
        });
    } catch (err) {
        logger.error(`Could not write new temperature reading because of : ${err.message}`);
        return;
    }

    //logger.debug(`Just logged this temp : ${temperature1}`);
};

export let start = () => {
    cron(config.samplingIntervalCron, async () => {
        await getAndWriteNewPoolTemperatureSample();
        await getAndWriteNewOutsideTemperatureSample();
    });
}

