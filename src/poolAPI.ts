import express, {type Express, type Request, type Response} from 'express';
import fs from 'fs';
import config from "config";

const poolTemperatureReadingsFile = `poolTemp_${new Date().getFullYear()}.csv`;
const outsideTemperatureReadingsFile = `outsideTemp_${new Date().getFullYear()}.csv`;

type TemperatureReading = {
	dateInMs: number,
	temp: number,
};

type RangeToDisplay = '4hours' | '8hours' | '24hours' | '3days' | '7days' | 'all';

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

const hourInMs = 60 * 60 * 1000;
const filterData = (data: Array<TemperatureReading>, rangeToDisplay: RangeToDisplay): Array<TemperatureReading> => {
	return data.filter((x: TemperatureReading) => {
		const readingDate = new Date(x.dateInMs);
		const now = new Date();
		const diff = now.getTime() - readingDate.getTime();
		switch (rangeToDisplay) {
			case '4hours':
				return diff <= 4 * hourInMs;
			case '8hours':
				return diff <= 8 * hourInMs;
			case '24hours':
				return diff <= 24 * hourInMs;
			case '3days':
				return diff <= 3 * 24 * hourInMs;
			case '7days':
				return diff <= 7 * 24 * hourInMs;
			default:
				return true;
		}
	});
};



const getAndReturnTemperatureReadings = async (forOutside: boolean, res: any, rangeToDisplay?: RangeToDisplay) => {
	const file = forOutside ? outsideTemperatureReadingsFile : poolTemperatureReadingsFile;
	let data = await readCsvToJSON(file);
	if (rangeToDisplay)	{
		data = filterData(data, rangeToDisplay);
	}

	res.json(data);
};

function getRangeToDisplay(req: Request) {
	let rangeToDisplay: RangeToDisplay | undefined;
	const querystringRangeToDisplay = req.query["rangeToDisplay"];

	if (typeof querystringRangeToDisplay === 'string' && ['4hours', '8hours', '24hours', '3days', '7days', 'all'].includes(querystringRangeToDisplay)) {
		rangeToDisplay = querystringRangeToDisplay as RangeToDisplay;
	}
	return rangeToDisplay;
}

const initPoolAPI = (app: Express) => {
	app.get("/data/outside", async (req: Request, res: Response) => {
		const rangeToDisplay: RangeToDisplay | undefined = getRangeToDisplay(req);
		await getAndReturnTemperatureReadings(true, res, rangeToDisplay);
	});

	app.get("/data/pool", async (req: Request, res: Response) => {
		const rangeToDisplay: RangeToDisplay | undefined = getRangeToDisplay(req);
		await getAndReturnTemperatureReadings(false, res, rangeToDisplay);
	});

	app.use(express.static('public'));

	app.get('/', (_req: Request, res) => {
		res.render('index', { notificationIntervalInMs: config.notificationIntervalInMs });
	});
};

export default initPoolAPI;
