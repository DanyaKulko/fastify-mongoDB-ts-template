import config from "@config";
import HttpError from "@errors/HttpError";
import logger from "@utils/logger";
import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

const errorHandlerPlugin: FastifyPluginAsync = async (fastify) => {
	fastify.setErrorHandler(async (err, request, reply) => {
		logger.error({ err: err.message });

		if (err instanceof HttpError) {
			return reply.code(err.statusCode).send({ message: err.message });
		}

		if (err.validation) {
			return reply.code(403).send({ message: err.message });
		}

		const errorMessage = config.PROD
			? "Internal server error"
			: err.message;

		reply.code(err.statusCode || 500).send({ message: errorMessage });
	});

	fastify.setNotFoundHandler((_request, reply) => {
		reply.code(404).send({ message: "Route not found" });
	});
};

export default fp(errorHandlerPlugin, {
	name: "errorHandler",
});
