import fastify, { type FastifyInstance } from "fastify";

import cors from "@fastify/cors";
import helmet from "@fastify/helmet";

import config from "@config";

import authPlugin from "./plugins/auth.plugin";
import errorHandlerPlugin from "./plugins/errorHandler.plugin";
import loggerPlugin from "./plugins/logger.plugin";
import mongooseConnectorPlugin from "./plugins/mongooseConnector.plugin";
import swaggerPlugin from "./plugins/swagger.plugin";

import authRoutes from "@authModule/auth.route";
import userRoutes from "@userModule/user.route";
import logger from "@utils/logger";

async function buildServer(): Promise<FastifyInstance> {
	const server = fastify({ logger: false });

	await registerPlugins(server);
	await registerRoutes(server);

	for (const signal of ["SIGINT", "SIGTERM"]) {
		process.on(signal, async () => {
			logger.error(`Received ${signal}, closing server.`);
			await server.close();
			process.exit(0);
		});
	}

	return server;
}

async function registerPlugins(server: FastifyInstance): Promise<void> {
	try {
		await server.register(cors, { origin: config.origin });
		await server.register(helmet);
		await server.register(loggerPlugin);
		if (config.NODE_ENV !== "test") {
			await server.register(mongooseConnectorPlugin);
		}
		await server.register(authPlugin);
		await server.register(errorHandlerPlugin);

		if (!config.PROD) {
			await server.register(swaggerPlugin);
		}
	} catch (error) {
		logger.error("Error registering plugins", error);
		throw error;
	}
}

async function registerRoutes(server: FastifyInstance): Promise<void> {
	try {
		await server.register(userRoutes, { prefix: "api/users" });
		await server.register(authRoutes, { prefix: "api/auth" });
	} catch (error) {
		logger.error("Error registering routes", error);
		throw error;
	}
}

buildServer().then(async (server) => {
	try {
		await server.ready();

		await server.listen({ port: config.PORT });
		logger.info(`Server listening at http://localhost:${config.PORT}`);

		if (!config.PROD) {
			logger.info(
				`Swagger UI available at http://localhost:${config.PORT}/docs`,
			);
		}
	} catch (error) {
		logger.error("Error starting server", error);
		process.exit(1);
	}
});

export default buildServer;
