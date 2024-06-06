import config from 'config';
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

	// respond with 500 "Internal Server Error".
	res.status(500);
	res.json({ message: "Internal Server Error : " + message, status, stack })
});

// @ts-ignore
const port: number = config.port;

app.listen(port, () => {
	// logger.info(`Listening on: ${secure ? "https://" : "http://"}${hostname ?? "localhost"}:${port}`);
	logger.info(`Listening on: http://localhost:${port}`);
})