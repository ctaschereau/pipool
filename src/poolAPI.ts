import express from 'express';
import fs from 'fs';

const poolTemperatureReadingsFile = `poolTemp_${new Date().getFullYear()}.csv`;
const outsideTemperatureReadingsFile = `outsideTemp_${new Date().getFullYear()}.csv`;

/*
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
};
*/

const getAndReturnTemperatureReadings = async (forOutside: boolean, res: any) => {
	const file = forOutside ? outsideTemperatureReadingsFile : poolTemperatureReadingsFile;
	// const data = await outsideTemperatureReadings.find(getFilter(context)).toArray();
	const data = await fs.promises.readFile(file, 'utf8');
	res.json(data.trim().split('\n').map(x => {
		const [date, temperature] = x.split(',');
		return [Number(date), Number(temperature)];
	}));
};

const initPoolAPI = (app) => {
	app.get("/data/outside", async (req, res) => {
		await getAndReturnTemperatureReadings(true, res);
	});

	app.get("/data/pool", async (req, res) => {
		await getAndReturnTemperatureReadings(false, res);
	});

	app.use(express.static('public'))
};

export default initPoolAPI;
