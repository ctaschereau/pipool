/*
import config from './config/config.ts';
import { isBefore } from 'https://deno.land/x/date_fns/index.js';

const cutoffDate = new Date('2020-07-01 15:30:00');

const cleanupFn = async (dataFilePath: string):Promise<void> => {
    let fileContent = await Deno.readTextFile(dataFilePath);
    let temperatureData = JSON.parse(fileContent);
    temperatureData = temperatureData.filter((x:any) => {
        return !isBefore(new Date(x[0]), cutoffDate);
    });
    await Deno.writeTextFile(dataFilePath, JSON.stringify(temperatureData, null, 4));
}


await cleanupFn(config.dataOutsideFilePath);
await cleanupFn(config.dataPoolFilePath);
*/