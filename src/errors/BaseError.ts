export class BaseError extends Error {
	public readonly statusCode: number;

	constructor(name: string, message: string, statusCode: number) {
		super(message);
		this.name = name;
		this.statusCode = statusCode;
	}
}
