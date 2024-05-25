import { FastifyReply, FastifyRequest } from 'fastify';
import { LoginUserRequest, SignupUserRequest } from '../auth/auth.types';
import { AuthorizedFastifyRequest } from '@projectTypes/requests';
import AuthService from '@authModule/auth.service';

export async function registerUserHandler(request: FastifyRequest<SignupUserRequest>, reply: FastifyReply) {
    const { username, email, password } = request.body;
    try {
        const user = await AuthService.registerUser({ email, username, password });
        request.logger.info(`User ${user.username} registered successfully`);
        const token = request.server.jwt.sign({ id: user._id });
        reply.send({ token });
    } catch (error) {
        if (error instanceof Error) {
            reply.code(400).send({ message: error.message });
        }
    }
}

export async function loginUserHandler(request: FastifyRequest<LoginUserRequest>, reply: FastifyReply) {
    const { email, password } = request.body;
    try {
        const user = await AuthService.loginUser({ email, password });
        const token = request.server.jwt.sign({ id: user._id });
        reply.send({ token });
    } catch (error) {
        if (error instanceof Error) {
            reply.code(400).send({ message: error.message });
        }
    }
}

export const getUserHandler = async (request: AuthorizedFastifyRequest, reply: FastifyReply) => {
    reply.send({ ...request.user });
};
