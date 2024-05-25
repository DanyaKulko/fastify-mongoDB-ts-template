import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
    path: path.join(__dirname, '..', '..', `.env.${process.env.NODE_ENV || 'development'}`),
});

interface Config {
    PORT: number;
    JWT_SECRET: string;
    MONGODB_URI: string;
}

const config: Config = {
    PORT: +(process.env.PORT || '3000'),
    JWT_SECRET: process.env.JWT_SECRET || 'secret',
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/fastify_template',
};

export default config;
