const express = require('express')
const axios = require('axios')
const fs = require('fs')

const app = express()
const port = 3028

const MINUTE_IN_MS = 60 * 1000;
const WEEK_IN_MS = 7 * 24 * 60 * MINUTE_IN_MS;
/////////////////const SAMPLING_INTERVAL = 15 * MINUTE_IN_MS; // in ms
const SAMPLING_INTERVAL = 1500; // in ms
const MAX_SAMPLES = 3 * WEEK_IN_MS / SAMPLING_INTERVAL; // Keep data for the last 3 weeks

const DATA_FILE_PATH = 'public/data.json';

// TODO : Add some error handling everywhere :P

let getTemp = async () => {
	let response = await axios.get('http://192.168.1.140:5000/')
	return response.data.temp
}

app.use(express.static('public'))

app.get('/', (req, res) => {
	getTemp()
		.then(temp => {
			// TODO : fucking don't do this like this :P !!!! Use React.js or something like that.
			let viewContent = fs.readFileSync('./views/index.html', 'utf-8')
			viewContent = viewContent.replace('"result_container">', `"result_container">La piscine est à ${temp}°C`)
			res.send(viewContent)
		})
		.catch(error => {
			console.error(error)
		})
})

setInterval(async () => {
	let temperature;
	try {
		temperature = await getTemp()
	} catch (err) {
		console.error(`Could not get temperature reading because of : ${err.message}`)
		return;
	}

	let temperatureData;
	try {
		let fileContent = await fs.readFile(DATA_FILE_PATH, 'utf-8')
		temperatureData = JSON.parse(fileContent)
	} catch (err) {
		console.error(`Could not read or parse content of file ${DATA_FILE_PATH}`)
		temperatureData = []
	}
	temperatureData.push([new Date().getTime(), temperature])
	while (temperatureData.length > MAX_SAMPLES) {
		temperatureData.shift()
	}
	
	await fs.writeFile(DATA_FILE_PATH, temperatureData)
}, SAMPLING_INTERVAL);

app.listen(port, () => console.log(`Pool app listening on port ${port}!`))

