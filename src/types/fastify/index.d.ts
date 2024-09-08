import "fastify";
import "fastify-jwt";
import type { IUser, UserRole } from "@userModule/user.model";

declare module "fastify" {
	export interface FastifyInstance {
		authenticate: FastifyMiddleware;
		checkRoles: (roles: UserRole[]) => FastifyMiddleware;
	}

	export interface FastifyRequest {
		user: IUser;
	}
}

declare module "@fastify/jwt" {
	interface FastifyJWT {
		payload: PayloadType;
	}
}
