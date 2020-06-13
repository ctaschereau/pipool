export default {
	port: 3028,
	tempServerUrl: 'http://192.168.1.140:5000/',
	cityIDForWeatherService: 'qc-136',
	dataPoolFilePath: 'public/poolTemp.json',
	dataOutsideFilePath: 'public/outsideTemp.json',
	samplingIntervalCron: '0 */10 * * * *',
	maxDaysForSamples: 21,
};
