import {Application, MongoClient, Router, send, subDays} from './deps.ts';

import config from '../config/config.ts';

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

const router = new Router();
router
    .get("/data/outside", async (context) => {
        const filter = {date: {$gte: subDays(new Date(), config.maxDaysForSamples)}};
        const data = await outsideTemperatureReadings.find(filter).toArray();
        context.response.body = data.map(x => {
            return [x.date.getTime(), x.temperature];
        });
    })
    .get("/data/pool", async (context) => {
        const filter = {date: {$gte: subDays(new Date(), config.maxDaysForSamples)}};
        const data = await poolTemperatureReadings.find(filter).toArray();
        context.response.body = data.map(x => {
            return [x.date.getTime(), x.temperature];
        });
    })
;

const initPoolAPI = (app: Application) => {
    app.use(router.routes());
    app.use(router.allowedMethods());

    // Static resources
    app.use(async (context) => {
        await send(context, context.request.url.pathname, {
            root: `${Deno.cwd()}/public`,
            index: 'index.html'
        });
    });
};

export default initPoolAPI;
