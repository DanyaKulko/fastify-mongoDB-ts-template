import AuthService from "@authModule/auth.service";
import type { FastifyRequest } from "fastify";
import type { LoginUserRequest, SignupUserRequest } from "../auth/auth.types";

export async function registerUserHandler(
	request: FastifyRequest<SignupUserRequest>,
) {
	const { username, email, password } = request.body;

	const user = await AuthService.registerUser(email, username, password);
	const token = request.server.jwt.sign({ id: user._id });

	return { token, user };
}

export async function loginUserHandler(
	request: FastifyRequest<LoginUserRequest>,
) {
	const { email, password } = request.body;

	const user = await AuthService.loginUser(email, password);
	const token = request.server.jwt.sign({ id: user._id });

	return { token, user };
}

export const getUserHandler = async (request: FastifyRequest) => {
	return { ...request.user };
};
