import fastify from 'fastify';

import cors from '@fastify/cors';
import helmet from '@fastify/helmet';

import config from '@config';

import swaggerPlugin from './plugins/swagger.plugin';
import errorHandlerPlugin from './plugins/errorHandler.plugin';
import mongooseConnectorPlugin from './plugins/mongooseConnector.plugin';
import authPlugin from './plugins/auth.plugin';
import loggerPlugin from './plugins/logger.plugin';

import authRoutes from '@authModule/auth.route';
import userRoutes from '@userModule/user.route';

const server = fastify({ logger: false });

async function main() {
    try {
        server.register(cors, {
            origin: config.origin,
        });
        server.register(helmet);

        server.register(loggerPlugin);
        server.register(mongooseConnectorPlugin);
        server.register(authPlugin);
        server.register(errorHandlerPlugin);

        if (config.NODE_ENV !== 'production') {
            server.register(swaggerPlugin);
        }

        server.register(userRoutes, { prefix: 'api/users' });
        server.register(authRoutes, { prefix: 'api/auth' });

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
