import type { FastifyPluginAsync } from "fastify";
import { BaseError } from "@errors/BaseError";
import fp from "fastify-plugin";

const errorHandlerPlugin: FastifyPluginAsync = async (fastify) => {
	fastify.setErrorHandler(async (err, request, reply) => {
		request.logger.error({ err: err.message });

		if (err instanceof BaseError) {
			return reply.code(err.statusCode).send({ message: err.message });
		}

		if (err.validation) {
			return reply.code(403).send({ message: err.message });
		}

		reply.code(err.statusCode || 500).send({ message: err.message });
	});

	fastify.setNotFoundHandler((_request, reply) => {
		reply.code(404).send({ message: "Route not found" });
	});
};

export default fp(errorHandlerPlugin, {
	name: "errorHandler",
	dependencies: ["logger"],
});
