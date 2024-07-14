import type { FastifyRequest } from "fastify";
import type { IUser } from "./models";

export interface AuthorizedFastifyRequest extends FastifyRequest {
	user: IUser;
}
