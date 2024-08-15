import "fastify";
import "fastify-jwt";
import type { IUser, UserRole } from "@userModule/user.model";
import type { Logger } from "winston";

declare module "fastify" {
	export interface FastifyInstance {
		logger: Logger;
		authenticate: FastifyMiddleware;
		checkRoles: (roles: UserRole[]) => FastifyMiddleware;
	}

	export interface FastifyRequest {
		logger: Logger;
		user: IUser;
	}
}

declare module "@fastify/jwt" {
	interface FastifyJWT {
		payload: PayloadType;
	}
}
