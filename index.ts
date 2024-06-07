import config from 'config';
import os from 'os';
import fs from 'fs';
import http from 'http';
import https from 'https';
import express, {type Request, type Response} from 'express';
import logger from './src/basicLogger.ts';
import { start as startCron } from './src/cronTemp.ts';
import initPoolAPI from './src/poolAPI.ts';

startCron();

const app = express();

initPoolAPI(app);

app.use((err: any, _req: Request, res: Response, _next: Function) => {
	const { message, status, stack } = err;
	console.error(err.stack);

	res.status(500);
	res.json({ message: "Internal Server Error : " + message, status, stack })
});

// @ts-ignore
const port: number = config.port;

const hostname = os.hostname().replace('.local', '');
let server, isSecure = false;
// if the hostname starts with "laptop0072", then use the cert my_borealis_cert.cer to create a secure server. Otherwise, create a non-secure server.
if (hostname.startsWith("laptop0072")) {
	const options = {
		key: fs.readFileSync('my_borealis_key.key'),
		cert: fs.readFileSync('my_borealis_cert.cer')
	};
	server = https.createServer(options, app)
	isSecure = true;
} else {
	server = http.createServer(app)
}

server.listen(port, () => {
	logger.info(`Listening on: ${isSecure ? "https://" : "http://"}${hostname ?? "localhost"}:${port}`);
});