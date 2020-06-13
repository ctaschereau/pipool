import { Application, Router , send, isHttpError } from 'https://deno.land/x/oak/mod.ts';

import config from './config/config.ts';
import logger from './src/basicLogger.ts';
import { start as startCron } from './src/cronTemp.ts';

startCron();

const app = new Application();

// Logger
app.use(async (ctx, next) => {
	await next();
	const rt = ctx.response.headers.get("X-Response-Time");
	console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

// Timing
app.use(async (ctx, next) => {
	const start = Date.now();
	await next();
	const ms = Date.now() - start;
	ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

// Logger for when started
app.addEventListener("listen", ({ hostname, port, secure }) => {
	logger.info(`Listening on: ${secure ? "https://" : "http://"}${hostname ?? "localhost"}:${port}`);
});



// Error handler
app.use(async (context, next) => {
	try {
		await next();
	} catch (err) {
		if (isHttpError(err)) {
			context.response.status = err.status;
			const { message, status, stack } = err;
			if (context.request.accepts("json")) {
				context.response.body = { message, status, stack };
				context.response.type = "json";
			} else {
				context.response.body = `${status} ${message}\n\n${stack ?? ""}`;
				context.response.type = "text/plain";
			}
		} else {
			throw err;
		}
	}
});

// Static resources
app.use(async (context) => {
	await send(context, context.request.url.pathname, {
		root: `${Deno.cwd()}/public`,
		index: 'index.html'
	});
});

await app.listen({ port: config.port });

