import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import config from '@config';
import User from '@userModule/user.model';
import { AuthorizedFastifyRequest } from '@projectTypes/requests';
import { UserRole } from '@projectTypes/models';
import { UnauthorizedError, ForbiddenError } from '@errors/AuthErrors';

const authPlugin = async (fastify: FastifyInstance) => {
    fastify.register(import('@fastify/jwt'), {
        secret: config.JWT_SECRET,
        sign: {
            expiresIn: '1h',
        },
    });

    fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
        const decoded: { id: string } = await request.jwtVerify();
        const user = await User.findById(decoded.id).lean();
        if (!user) {
            reply.code(401).send({ message: 'Unauthorized' });
            throw new UnauthorizedError();
        }
        request.user = user;
    });

    fastify.decorate('checkRoles', (roles: UserRole[]) => async (request: AuthorizedFastifyRequest) => {
        if (!roles.includes(request.user.role)) {
            throw new ForbiddenError();
        }
    });
};

export default fp(authPlugin);
