import config from 'config';

export default class TempUtils {
	static async getPoolTemp(): Promise<number> {
		const response = await fetch(config.tempServerUrl);
		const data: any = await response.json();
		if (data.temp && typeof data.temp === 'number'){
			return data.temp;
		}
		throw new Error('No pool temp today!');
	}

	static async getOutsideTemp(): Promise<number> {
		const url = `https://api.weather.gc.ca/collections/citypageweather-realtime/items/${config.cityIDForWeatherService}?f=json`;
		const response = await fetch(url);
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
		if (typeof temp === 'number') {
			return temp;
		}
		throw new Error('No outside temp today!');
	}
}
