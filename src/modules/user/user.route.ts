import { FastifyInstance } from 'fastify';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function userRoutes(server: FastifyInstance) {
    // TODO: userRoutes
    // server.get('/user', {
    //     preValidation: [server.authenticate, server.checkRoles(["admin"])],
    // }, async (request, reply) => {
    //     return {message: 'User route'};
    // })
}

export default userRoutes;
