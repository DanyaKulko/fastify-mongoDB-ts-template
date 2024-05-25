import { FastifyRequest } from 'fastify';
import { IUser } from './models';

export interface AuthorizedFastifyRequest extends FastifyRequest {
    user: IUser;
}
