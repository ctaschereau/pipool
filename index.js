const express = require('express')
const axios = require('axios')

const app = express()
const port = 3028

app.get('/', (req, res) => {
	axios.get('http://192.168.1.140:5000/')
		.then(response => {
			res.send('La piscine est à ' + response.data.temp + 'C')
		})
		.catch(error => {
			console.error(error)
		})
})


app.listen(port, () => console.log(`Pool app listening on port ${port}!`))
