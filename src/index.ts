import fastify, { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import config from '@config';
import logger from './utils/logger';
import swaggerPlugin from './plugins/swagger.plugin';
import mongooseConnector from './plugins/mongooseConnector.plugin';
import auth from './plugins/auth.plugin';
import authRoutes from '@authModule/auth.route';
import userRoutes from '@userModule/user.route';

const server = fastify({ logger: false });

server.addHook('onRequest', async (request) => {
    request.logger = logger;
});

server.addHook('onResponse', async (request, reply) => {
    server.logger.info(
        `Request: ${request.method} ${request.url} from ${request.ip} - Response time: ${reply.elapsedTime.toFixed(2)} ms`,
    );
});

async function main() {
    try {
        server.decorate('logger', logger);
        server.register(cors, {
            origin: config.origin,
        });
        server.register(helmet);

        server.register(mongooseConnector);
        server.register(auth);

        if (config.NODE_ENV !== 'production') {
            server.register(swaggerPlugin);
        }

        server.register(userRoutes, { prefix: 'api/users' });
        server.register(authRoutes, { prefix: 'api/auth' });

        server.setErrorHandler(async (err: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
            request.logger.error({ err: err.message });
            if (err.validation) {
                return reply.code(403).send({ message: err.message });
            }
            reply.code(err.statusCode || 500).send({ message: err.message });
        });

        server.setNotFoundHandler((_request: FastifyRequest, reply: FastifyReply) => {
            reply.code(404).send({ message: 'Route not found' });
        });

        await server.listen({ port: config.PORT });
        server.logger.info(`Server listening at http://localhost:${config.PORT}`);

        if (config.NODE_ENV !== 'production') {
            server.logger.info(`Swagger UI available at http://localhost:${config.PORT}/docs`);
        }
    } catch (error) {
        server.logger.error({ error });
    }
}

main();

['SIGINT', 'SIGTERM'].forEach((signal) => {
    process.on(signal, async () => {
        server.logger.error(`Received ${signal}, closing server.`);
        await server.close();
        process.exit(0);
    });
});
