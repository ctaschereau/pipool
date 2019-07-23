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
	if (process.env.NOT_IN_HOME_NETWORK) {
		renderPage('N/A');
		return;
	}
	tempUtils.getTemp()
		.then(temp => {
			renderPage(temp);
		})
		.catch(error => {
			logger.error(error);
			renderPage('N/A');
		});
});

// TODO : use https -> https://certbot.eff.org/
// https://pimylifeup.com/raspberry-pi-ssl-lets-encrypt/
// https://demos.creative-tim.com/material-kit-react/#/
// TODO : Highcharts - Allow holes in data?

if (!process.env.NOT_IN_HOME_NETWORK) {
	new cronTemp().start();
}

app.listen(config.port, () =>  logger.info(`Server running on port : ${config.port}`));

