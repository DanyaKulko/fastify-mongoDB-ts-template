import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

const swaggerPlugin = async (fastify: FastifyInstance) => {
    fastify.register(import('@fastify/swagger'), {
        openapi: {
            openapi: '3.0.0',
            info: {
                title: 'Test swagger',
                description: 'Testing the Fastify swagger API',
                version: '0.1.0',
            },
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                    },
                },
            },
            security: [
                {
                    bearerAuth: [],
                },
            ],
        },
    });
    fastify.register(import('@fastify/swagger-ui'), { routePrefix: '/docs' });
};

export default fp(swaggerPlugin);
