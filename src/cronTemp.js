const config = require('config');
const fs = require('fs-extra');
const CronJob = require('cron').CronJob;

const logger = require('./basicLogger');
const tempUtils = require('./tempUtils');

class CronTemp {
	constructor() {
		this.job = new CronJob(config.samplingIntervalCron, this.getAndWriteNewTemperatureSample);
	}

	start() {
		this.job.start();
	}

	async getAndWriteNewTemperatureSample() {
		let temperature;
		try {
			temperature = await tempUtils.getTemp();
		} catch (err) {
			logger.error(`Could not get temperature reading because of : ${err.message}`);
			return;
		}

		let temperatureData;
		try {
			let fileContent = await fs.readFile(config.dataFilePath, 'utf-8');
			temperatureData = JSON.parse(fileContent);
		} catch (err) {
			logger.error(`Could not read or parse content of file ${config.dataFilePath}`);
			temperatureData = [];
		}
		temperatureData.push([new Date().getTime(), temperature]);
		// TODO : prune data this older than config.maxDaysForSamples

		await fs.writeFile(config.dataFilePath, JSON.stringify(temperatureData, null, 4));

		logger.debug(`Just logged this temp : ${temperature}`);
	}
}
module.exports = CronTemp;
