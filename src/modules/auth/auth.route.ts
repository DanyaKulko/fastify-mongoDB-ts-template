import { getUserHandler, loginUserHandler, registerUserHandler } from './auth.controller';
import { FastifyInstance } from 'fastify';
import { SignupUserRequest, LoginUserRequest } from './auth.types';
import { authGetMeSchema, authLoginSchema, authSignupSchema } from './auth.schema';

async function authRoutes(server: FastifyInstance) {
    server.post<LoginUserRequest>(
        '/login',
        {
            schema: authLoginSchema,
        },
        loginUserHandler,
    );

    server.post<SignupUserRequest>(
        '/signup',
        {
            schema: authSignupSchema,
        },
        registerUserHandler,
    );

    server.get(
        '/me',
        {
            preValidation: [server.authenticate],
            schema: authGetMeSchema,
        },
        getUserHandler,
    );
}

export default authRoutes;
