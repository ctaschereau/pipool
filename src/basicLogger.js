const { createLogger, format, transports } = require('winston');

const consoleTransport = new transports.Console();
const myWinstonOptions = {
	transports: [consoleTransport],
	format: format.combine(
		format.colorize(),
		format.timestamp({
			format: 'YYYY-MM-DD HH:mm:ss'
		}),
		format.printf(info => `${info.timestamp} [${info.level}] ${info.message}`)
	),
};
module.exports = new createLogger(myWinstonOptions);
