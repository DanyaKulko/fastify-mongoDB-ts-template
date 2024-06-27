import fastify, { FastifyInstance } from 'fastify';

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

async function buildServer(): Promise<FastifyInstance> {
    const server = fastify({ logger: false });

    await registerPlugins(server);
    await registerRoutes(server);

    if (config.NODE_ENV !== 'test') {
        await server.listen({ port: config.PORT });
        server.logger.info(`Server listening at http://localhost:${config.PORT}`);
        if (config.NODE_ENV !== 'production') {
            server.logger.info(`Swagger UI available at http://localhost:${config.PORT}/docs`);
        }
    }

    ['SIGINT', 'SIGTERM'].forEach((signal) => {
        process.on(signal, async () => {
            server.logger.error(`Received ${signal}, closing server.`);
            await server.close();
            process.exit(0);
        });
    });

    return server;
}

async function registerPlugins(server: FastifyInstance): Promise<void> {
    try {
        await server.register(cors, { origin: config.origin });
        await server.register(helmet);
        await server.register(loggerPlugin);
        if (config.NODE_ENV !== 'test') {
            await server.register(mongooseConnectorPlugin);
        }
        await server.register(authPlugin);
        await server.register(errorHandlerPlugin);

        if (config.NODE_ENV !== 'production') {
            await server.register(swaggerPlugin);
        }
    } catch (error) {
        server.logger.error('Error registering plugins', error);
        throw error;
    }
}

async function registerRoutes(server: FastifyInstance): Promise<void> {
    try {
        await server.register(userRoutes, { prefix: 'api/users' });
        await server.register(authRoutes, { prefix: 'api/auth' });
    } catch (error) {
        server.logger.error('Error registering routes', error);
        throw error;
    }
}

buildServer();

export default buildServer;
