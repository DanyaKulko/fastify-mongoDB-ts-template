import type { FastifyInstance } from "fastify";
import {
	getUserHandler,
	loginUserHandler,
	registerUserHandler,
} from "./auth.controller";
import {
	authGetMeSchema,
	authLoginSchema,
	authSignupSchema,
} from "./auth.schema";
import type { LoginUserRequest, SignupUserRequest } from "./auth.types";

async function authRoutes(server: FastifyInstance) {
	server.post<LoginUserRequest>(
		"/login",
		{
			schema: authLoginSchema,
		},
		loginUserHandler,
	);

	server.post<SignupUserRequest>(
		"/signup",
		{
			schema: authSignupSchema,
		},
		registerUserHandler,
	);

	server.get(
		"/me",
		{
			preValidation: [server.authenticate],
			schema: authGetMeSchema,
		},
		getUserHandler,
	);
}

export default authRoutes;
