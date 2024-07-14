import { BaseError } from "./BaseError";

export class UserNotFoundError extends BaseError {
	constructor() {
		super("UserNotFoundError", "User not found", 404);
	}
}

export class UserExistsError extends BaseError {
	constructor() {
		super(
			"UserExistsError",
			"User with that email or username already exists",
			400,
		);
	}
}

export class PasswordIncorrectError extends BaseError {
	constructor() {
		super("PasswordIncorrectError", "Password is incorrect", 400);
	}
}

export class UnauthorizedError extends BaseError {
	constructor() {
		super("UnauthorizedError", "Unauthorized", 401);
	}
}

export class ForbiddenError extends BaseError {
	constructor() {
		super("ForbiddenError", "Forbidden", 403);
	}
}
