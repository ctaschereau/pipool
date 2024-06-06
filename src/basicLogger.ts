import winston from "winston";

/*
const myFormatter = (logRecord: any) => {
	return `${logRecord.datetime.toISOString()} [${logRecord.levelName}] - ${logRecord.msg}`;
};
*/

const logger = winston.createLogger({
	level: 'info',
	format: winston.format.combine(
		winston.format.timestamp({
			format: 'YYYY-MM-DD HH:mm:ss'
		}),
		winston.format.printf(info => `${info["timestamp"]} [${info.level}] : ${info.message}`+(info["splat"]!==undefined?`${info["splat"]}`:" "))
	),
	// defaultMeta: { service: 'user-service' },
	transports: [
		new winston.transports.File({ filename: 'pipool.log' }),
		new winston.transports.Console({}),
	],
});

export default logger;
