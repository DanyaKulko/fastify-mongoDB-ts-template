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

async function authRoutes(server: FastifyInstance) {
	server.post(
		"/login",
		{
			schema: authLoginSchema,
		},
		loginUserHandler,
	);

	server.post(
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
