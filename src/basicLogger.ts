import * as log from "https://deno.land/std@0.95.0/log/mod.ts";

const myFormatter = (logRecord: any) => {
	return `${logRecord.datetime.toISOString()} [${logRecord.levelName}] - ${logRecord.msg}`;
};

await log.setup({
	handlers: {
		console: new log.handlers.ConsoleHandler("DEBUG", {
			formatter: myFormatter,
		}),
		file: new log.handlers.FileHandler("DEBUG", {
			filename: "./log.txt",
			formatter: myFormatter,
		}),
	},

	loggers: {
		default: {
			level: "DEBUG",
			handlers: ["console", "file"],
		},
	},
});

const logger = log.getLogger();
export default logger;
