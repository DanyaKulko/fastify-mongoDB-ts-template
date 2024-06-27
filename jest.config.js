module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
    roots: ['./tests'],
    setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
    moduleNameMapper: {
        '@src/(.*)': '<rootDir>/src/$1',
        '@projectTypes/(.*)': '<rootDir>/src/types/$1',
        '@authModule/(.*)': '<rootDir>/src/modules/auth/$1',
        '@userModule/(.*)': '<rootDir>/src/modules/user/$1',
        '@config': '<rootDir>/src/config/index.ts',
        '@errors/(.*)': '<rootDir>/src/errors/$1',
    },
};
