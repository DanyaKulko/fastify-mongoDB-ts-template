import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import logger from '../utils/logger';
import config from '@config';

const loggerPlugin: FastifyPluginAsync = async (fastify) => {
    fastify.addHook('onRequest', async (request) => {
        request.logger = logger;
    });

    if (config.NODE_ENV !== 'production') {
        fastify.addHook('onResponse', async (request, reply) => {
            fastify.logger.info(
                `Request: ${request.method} ${request.url} from ${request.ip} - Response time: ${reply.elapsedTime.toFixed(2)} ms`,
            );
        });
    }
    fastify.decorate('logger', logger);
};

export default fp(loggerPlugin, {
    name: 'logger',
});
