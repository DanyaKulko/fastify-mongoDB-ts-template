import config from "@config";
import logger from "@utils/logger";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import mongoose from "mongoose";

const mongooseConnectorPlugin = async (fastify: FastifyInstance) => {
	const connect = async () => {
		try {
			const db = await mongoose.connect(config.MONGODB_URI);
			logger.info("MongoDB connected");

			db.connection.on("error", (error) => {
				logger.error(
					"MongoDB connection error. Reconnect in 5 seconds. Error: ",
					error,
				);
				setTimeout(connect, 5000);
			});
		} catch (error) {
			logger.error(
				"MongoDB connection error. Reconnect in 5 seconds. Error: ",
				error,
			);
			setTimeout(connect, 5000);
		}
	};

	connect();

	fastify.addHook("onClose", async () => {
		logger.info("Disconnecting Mongoose");
		await mongoose.disconnect().catch((error) => {
			logger.error("Error disconnecting Mongoose: ", error);
		});
	});
};

export default fp(mongooseConnectorPlugin, {
	name: "mongooseConnector",
});
