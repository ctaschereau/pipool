import config from 'config';

import logger from './basicLogger.ts';

export default class TempUtils {
	static async getPoolTemp(): Promise<number> {
		const url = config.tempServerUrl;
		logger.debug(`getPoolTemp: fetching ${url}`);
		const response = await fetch(url);
		logger.debug(`getPoolTemp: response status ${response.status}`);
		const data: any = await response.json();
		logger.debug(`getPoolTemp: response body ${JSON.stringify(data)}`);
		if (data.temp && typeof data.temp === 'number'){
			return data.temp;
		}
		throw new Error('No pool temp today!');
	}

	static async getOutsideTemp(): Promise<number> {
		const url = `https://api.weather.gc.ca/collections/citypageweather-realtime/items/${config.cityIDForWeatherService}?f=json`;
		logger.debug(`getOutsideTemp: fetching ${url}`);
		const response = await fetch(url);
		logger.debug(`getOutsideTemp: response status ${response.status}`);
		if (!response.ok) {
			throw new Error(`Weather API returned ${response.status}`);
		}
		const data = await response.json() as {
			properties?: {
				currentConditions?: {
					temperature?: { value?: { en?: number } };
				};
			};
		};
		const temp = data.properties?.currentConditions?.temperature?.value?.en;
		logger.debug(`getOutsideTemp: parsed temperature ${temp}`);
		if (typeof temp === 'number') {
			return temp;
		}
		throw new Error('No outside temp today!');
	}
}
