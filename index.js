const express = require('express');
const config = require('config');
const fs = require('fs-extra');

const logger = require('./src/basicLogger');
const tempUtils = require('./src/tempUtils');
const cronTemp = require('./src/cronTemp');

const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
	let renderPage = (temp) => {
		// TODO : fucking don't do this like this :P !!!! Use React.js or something like that.
		let viewContent = fs.readFileSync('./views/index.html', 'utf-8');
		viewContent = viewContent.replace('"result_container">', `"result_container">La piscine est à ${temp}°C`);
		res.send(viewContent)
	};
	tempUtils.getTemp()
		.then(temp => {
			renderPage(temp);
		})
		.catch(error => {
			logger.error(error);
			renderPage('N/A');
		});
});

new cronTemp().start();

app.listen(config.port, () =>  logger.info(`Server running on port : ${config.port}`));

