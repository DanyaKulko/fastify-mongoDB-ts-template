import {
	type Logger,
	addColors,
	createLogger,
	format,
	transports,
} from "winston";
import "winston-daily-rotate-file";
import * as path from "node:path";
import config from "@config";

const rootDir = path.join(__dirname, "..", "..");

const errorLogFilePath = path.join(rootDir, "logs", "errors-%DATE%.log");
const infoLogFilePath = path.join(rootDir, "logs", "info-%DATE%.log");

const timestampFormat = format.timestamp({
	format: "YYYY-MM-DD HH:mm:ss",
});

addColors({
	info: "cyan",
	error: "red bold",
	warn: "yellow",
	debug: "cyan",
});

const consoleFormat = format.combine(
	timestampFormat,
	format((info) => ({
		...info,
		level: info.level.toUpperCase(),
		label: info.label ? ` -> ${info.label.toUpperCase()}` : "",
	}))(),
	format.colorize({ all: true }),
	format.printf(({ level, message, timestamp, label }) => {
		const labelString = label ? ` -> ${label}` : "";
		return `${timestamp} | [ ${level}${labelString} ]: ${message}`;
	}),
);

const fileFormat = format.combine(
	format.simple(),
	timestampFormat,
	format((info) => ({
		...info,
		level: info.level.toUpperCase(),
		label: info.label ? ` -> ${info.label.toUpperCase()}` : "",
	}))(),
	format.printf(({ level, message, timestamp, label }) => {
		const outputMessage =
			typeof message === "object" ? JSON.stringify(message) : message;
		const labelString = label ? ` -> ${label}` : "";
		return `${timestamp} | [ ${level}${labelString} ]: ${outputMessage}`;
	}),
);

const rotateOptions = {
	datePattern: "YYYY-MM-DD",
	zippedArchive: true,
	maxSize: "20m",
	maxFiles: "14d",
};

const logger: Logger = createLogger({
	transports: [
		new transports.DailyRotateFile({
			filename: infoLogFilePath,
			format: fileFormat,
			...rotateOptions,
		}),
		new transports.DailyRotateFile({
			filename: errorLogFilePath,
			format: fileFormat,
			level: "error",
			...rotateOptions,
		}),
	],
});

if (!config.PROD) {
	logger.add(new transports.Console({ format: consoleFormat }));
}

export default logger;
