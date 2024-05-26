import { Logger } from 'winston';
import 'fastify';
import 'fastify-jwt';
import { UserRole } from '@projectTypes/models';

declare module 'fastify' {
    export interface FastifyInstance {
        logger: Logger;
        authenticate: FastifyMiddleware;
        checkRoles: (roles: UserRole[]) => FastifyMiddleware;
    }

    export interface FastifyRequest {
        logger: Logger;
    }
}

declare module '@fastify/jwt' {
    interface FastifyJWT {
        payload: PayloadType;
    }
}
