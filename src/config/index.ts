import dotenv from "dotenv";
import path from "node:path";

const NODE_ENV = process.env.NODE_ENV || "development";

dotenv.config({
	path: path.join(__dirname, "..", "..", `.env.${NODE_ENV}`),
});

interface Config {
	PORT: number;
	JWT_SECRET: string;
	MONGODB_URI: string;
	NODE_ENV: string;
	PROD: boolean;
	DEV: boolean;
	origin: string;
}

const config: Config = {
	PORT: +(process.env.PORT || "3000"),
	JWT_SECRET: process.env.JWT_SECRET || "secret",
	MONGODB_URI:
		process.env.MONGODB_URI || "mongodb://localhost:27017/fastify_template",
	NODE_ENV,
	PROD: NODE_ENV === "production",
	DEV: NODE_ENV === "development",
	origin: process.env.ALLOWED_ORIGIN || "*",
};

export default config;
