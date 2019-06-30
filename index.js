const express = require('express')
const axios = require('axios')
const fs = require('fs')

const app = express()
const port = 3028

const SAMPLING_INTERVAL = 30 * 1000; // in ms

// TODO : Add some error handling everywhere :P

let getTemp = async () => {
	let response = await axios.get('http://192.168.1.140:5000/')
	return response.data.temp
}
let oldTempData = [];

app.use(express.static('public'))

app.get('/', (req, res) => {
	getTemp()
		.then(temp => {
			// TODO : don't do this like this :P !!!! Use React.js or something like that.
			let viewContent = fs.readFileSync('./views/index.html', 'utf-8')
			viewContent = viewContent.replace('"result_container">', `"result_container">La piscine est à ${temp}°C`)
			viewContent = viewContent.replace('"chart_container">', `"chart_container"><pre>${JSON.stringify(oldTempData, null, 4)}</pre>`)
			res.send(viewContent)
		})
		.catch(error => {
			console.error(error)
		})
})

setInterval(async () => {
	let temp = await getTemp()
	let time = new Date().toISOString()
	console.log(`${time} : ${temp}°C`)
	oldTempData.unshift({time, temp})
}, SAMPLING_INTERVAL);

app.listen(port, () => console.log(`Pool app listening on port ${port}!`))

