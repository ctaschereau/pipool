const express = require('express')
const axios = require('axios')
const fs = require('fs')

const app = express()
const port = 3028

const SAMPLING_INTERVAL = 15 * 60 * 1000; // in ms

// TODO : Add some error handling everywhere :P

let getTemp = async () => {
	//TODO : Mega hack
	//TODO : Mega hack
	//TODO : Mega hack
	//TODO : Mega hack
	return 22;
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
	let temp = await getTemp()
	// TODO : read public/data.json
	// TODO : append data in it
	// TODO : prune data older than 2 weeks
	// TODO : write file
	let time = new Date().toISOString()
	console.log(`${time} : ${temp}°C`)
}, SAMPLING_INTERVAL);

app.listen(port, () => console.log(`Pool app listening on port ${port}!`))

