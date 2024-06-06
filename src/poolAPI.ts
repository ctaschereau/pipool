import express, {type Express, type Request, type Response} from 'express';
import fs from 'fs';

const poolTemperatureReadingsFile = `poolTemp_${new Date().getFullYear()}.csv`;
const outsideTemperatureReadingsFile = `outsideTemp_${new Date().getFullYear()}.csv`;

type TemperatureReading = {
	dateInMs: Number,
	temp: number,
};

const readCsvToJSON = async (file: string): Promise<Array<TemperatureReading>> => {
	const data = await fs.promises.readFile(file, 'utf8');
	return data.trim().split('\n').map((x: string) => {
		const [date, temperature] = x.split(',');
		return {
			dateInMs: Number(date),
			temp: Number(temperature),
		};
	})
}

const filterData = (data: Array<TemperatureReading>, rangeToDisplay: string): Array<TemperatureReading> => {
	return data.filter((x: TemperatureReading) => {
		if (rangeToDisplay.includes('hours')) {
			// filter = {date: {$gte: subHours(new Date(), Number(rangeToDisplay.replace('hours', '')))}};
			return x;
		} else if (rangeToDisplay.includes('days')) {
			// filter = {date: {$gte: subHours(new Date(), Number(rangeToDisplay.replace('days', '')) * 24)}};
			return x;
		} else {
			// filter = {}
			return x;
		}
	});
};



const getAndReturnTemperatureReadings = async (forOutside: boolean, res: any, rangeToDisplay?: string) => {
	const file = forOutside ? outsideTemperatureReadingsFile : poolTemperatureReadingsFile;
	let data = await readCsvToJSON(file);
	if (rangeToDisplay)	{
		data = filterData(data, rangeToDisplay);
	}

	res.json(data);
};

const initPoolAPI = (app: Express) => {
	app.get("/data/outside", async (_req: Request, res: Response) => {
		await getAndReturnTemperatureReadings(true, res);
	});

	app.get("/data/pool", async (req: Request, res: Response) => {
		const rangeToDisplay: string | undefined = req.query["rangeToDisplay"] ? (String) (req.query["rangeToDisplay"]) : undefined;
		await getAndReturnTemperatureReadings(false, res, rangeToDisplay);
	});

	app.use(express.static('public'))
};

export default initPoolAPI;
