import {Application, MongoClient, Router, helpers, send, subHours} from './deps.ts';
import type { Document, RouterContext} from './deps.ts';

import config from '../config/config.ts';

const client = new MongoClient();
await client.connect(`mongodb://${config.mongoHost}:${config.mongoPort}`);

interface TempSchema {
    _id: { $oid: string };
    date: Date;
    temperature: number;
}

const db = client.database('pipool');
const poolTemperatureReadings = db.collection<TempSchema>('poolTemp');
const outsideTemperatureReadings = db.collection<TempSchema>('outsideTemp');

const getFilter = (context: RouterContext): Document => {
	const qs = helpers.getQuery(context);
	const rangeToDisplay = qs.rangeToDisplay || '3days';
	let filter: Document;
	if (rangeToDisplay.includes('hours')) {
		filter = {date: {$gte: subHours(new Date(), Number(rangeToDisplay.replace('hours', '')))}};
	} else if (rangeToDisplay.includes('days')) {
		filter = {date: {$gte: subHours(new Date(), Number(rangeToDisplay.replace('days', '')) * 24)}};
	} else {
		filter = {}
	}
	return filter;
}

const router = new Router();
router
    .get("/data/outside", async (context: RouterContext) => {
        const data = await outsideTemperatureReadings.find(getFilter(context)).toArray();
        context.response.body = data.map(x => {
            return [x.date.getTime(), x.temperature];
        });
    })
    .get("/data/pool", async (context) => {
        const data = await poolTemperatureReadings.find(getFilter(context)).toArray();
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
