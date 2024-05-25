import fastify, { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import config from '@config';
import logger from './utils/logger';
import swaggerPlugin from './plugins/swagger.plugin';
import mongooseConnector from './plugins/mongooseConnector.plugin';
import auth from './plugins/auth.plugin';
import authRoutes from '@authModule/auth.route';
import userRoutes from '@userModule/user.route';

const server = fastify({ logger: false });

server.addHook('onRequest', async (request) => {
    request.startTime = process.hrtime.bigint();
    request.logger = server.logger;
});

server.addHook('onResponse', async (request) => {
    const responseTime = Number(process.hrtime.bigint() - request.startTime) / 1e6;
    server.logger.info(
        `Request: ${request.method} ${request.url} from ${request.ip} - Response time: ${responseTime.toFixed(2)} ms`,
    );
});

async function main() {
    try {
        server.decorate('logger', logger);
        server.register(mongooseConnector);
        server.register(auth);

        if (process.env.NODE_ENV !== 'production') {
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

        if (process.env.NODE_ENV !== 'production') {
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
