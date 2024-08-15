import type { FastifySchema } from "fastify";

export const authSignupSchema: FastifySchema = {
	tags: ["auth"],
	body: {
		type: "object",
		properties: {
			email: { type: "string", format: "email" },
			username: { type: "string", minLength: 4 },
			password: { type: "string", minLength: 6 },
		},
		required: ["email", "username", "password"],
	},
};

export const authLoginSchema: FastifySchema = {
	tags: ["auth"],
	body: {
		type: "object",
		properties: {
			email: { type: "string", format: "email" },
			password: { type: "string", minLength: 6 },
		},
		required: ["email", "password"],
	},
};

export const authGetMeSchema: FastifySchema = {
	tags: ["auth"],
	security: [
		{
			bearerAuth: [],
		},
	],
};
