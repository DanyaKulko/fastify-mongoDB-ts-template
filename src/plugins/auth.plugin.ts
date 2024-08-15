import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import config from "@config";
import User, { type UserRole } from "@userModule/user.model";
import HttpError from "@errors/HttpError";

const authPlugin = async (fastify: FastifyInstance) => {
	fastify.register(import("@fastify/jwt"), {
		secret: config.JWT_SECRET,
		sign: {
			expiresIn: "1h",
		},
	});

	fastify.decorate(
		"authenticate",
		async (request: FastifyRequest, reply: FastifyReply) => {
			const decoded: { id: string } = await request.jwtVerify();
			const user = await User.findById(decoded.id).lean();
			if (!user) {
				throw new HttpError(401, "Unauthorized");
			}
			request.user = user;
		},
	);

	fastify.decorate(
		"checkRoles",
		(roles: UserRole[]) => async (request: FastifyRequest) => {
			if (!roles.includes(request.user.role)) {
				throw new HttpError(403, "Forbidden");
			}
		},
	);
};

export default fp(authPlugin, {
	name: "auth",
	dependencies: ["logger"],
});
