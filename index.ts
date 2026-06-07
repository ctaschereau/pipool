import config from 'config';
import os from 'os';
import fs from 'fs';
import http from 'http';
import https from 'https';
import path from 'path';
import express, {type Request, type Response} from 'express';
import logger from './src/basicLogger.ts';
import { start as startCron } from './src/cronTemp.ts';
import initPoolAPI from './src/poolAPI.ts';

logger.info(`Starting pipool (logLevel=${config.logLevel}, port=${config.port}, cron="${config.samplingIntervalCron}")`);
startCron();

const app = express();

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

initPoolAPI(app);

app.use((err: any, _req: Request, res: Response, _next: Function) => {
	const { message, status, stack } = err;
	logger.error(err.stack ?? err.message ?? err);

	res.status(500);
	res.json({ message: "Internal Server Error : " + message, status, stack })
});

const port: number = config.port;

const hostname = os.hostname().replace('.local', '');
let server, isSecure = false;
// if the hostname starts with "laptop0072", then use the local cert and key to create a secure server. Otherwise, create a non-secure server.
if (hostname.startsWith("laptop0072")) {
	const options = {
		key: fs.readFileSync('my_key.key'),
		cert: fs.readFileSync('my_cert.cer')
	};
	server = https.createServer(options, app)
	isSecure = true;
} else {
	server = http.createServer(app)
}

server.listen(port, () => {
	logger.info(`Listening on: ${isSecure ? "https://" : "http://"}${hostname ?? "localhost"}:${port}`);
});