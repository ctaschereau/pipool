import config from 'config';

export default class TempUtils {
	static async getPoolTemp(): Promise<number> {
		const response = await fetch(config.tempServerUrl);
		const data = await response.json();
		return data.temp;
	}

	static async getOutsideTemp(): Promise<number> {
		const response = await fetch(`https://weather.gc.ca/rss/city/${config.cityIDForWeatherService}_e.xml`);
		const junkRssFeed = await response.text();
		const regex = /<b>Temperature:<\/b>\s*(\d*\.?\d*)&deg;[cfCF]/;
		const matches = junkRssFeed.match(regex);
		if (matches && matches[1]) {
			return parseFloat(matches[1]);
		}
		throw new Error('No temp today!');
	}
}
