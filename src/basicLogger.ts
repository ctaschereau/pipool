import * as log from "https://deno.land/std@0.95.0/log/mod.ts";

await log.setup({
	handlers: {
		console: new log.handlers.ConsoleHandler("DEBUG", {
			formatter: "{datetime} [{levelName}] - {msg}",
		}),
		file: new log.handlers.FileHandler("DEBUG", {
			filename: "./log.txt",
			formatter: "{datetime} [{levelName}] - {msg}",
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
