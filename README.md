# Fastify Mongodb TypeScript Modular Template

## This template includes:

- Fastify (5.x) 
- Mongoose
- Winston + Winston logrotate
- Biome (instead of Eslint + Prettier)
- Jest
- Husky
- Swagger in development mode
- JWT authentication + role based access control


## Getting Started

To get started, clone the repository and install the dependencies.

```bash
git clone https://github.com/DanyaKulko/fastify-mongoDB-ts-template
cd fastify-mongoDB-ts-template
npm install
npm run dev
```

That's it! By default, server should be running on `http://localhost:3000`.

## Testing

Jest is used for testing. To isolate tests from the main application, a separate MongoDB instance is created for testing. 

To run tests:
```bash
npm run test
```

### Scripts

- `npm run dev`: Start the server in development mode
- `npm run build`: Build the project
- `npm start`: Start the server in production mode
- `npm run lint`: Lint the project
- `npm run test`: Run tests



## Additional Information

1. Husky is used to run staged linting using pre-commit hooks. Prettier is used to format the code.
2. Swagger is available in development mode at `http://localhost:3000/docs`.

## Folder Structure

```text
├── src
│   ├── config
│   │   └── index.ts
│   ├── errors
│   │   ├── AuthError.ts
│   │   └── BaseError.ts
│   ├── modules
│   │   ├── auth
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.route.ts
│   │   │   ├── auth.schema.ts
│   │   │   ├── auth.types.ts
│   │   │   └── auth.service.ts
│   │   └── user
│   │       ├── user.controller.ts
│   │       ├── user.model.ts
│   │       ├── user.route.ts
│   │       ├── user.repository.ts
│   │       ├── user.schema.ts
│   │       ├── user.types.ts
│   │       └── user.service.ts
│   ├── types
│   │   ├── fastify
│   │   │   └── index.d.ts
│   │   ├── models.ts
│   │   └── request.ts
│   ├── plugins
│   │   ├── auth.plugin.ts
│   │   ├── errorHandler.plugin.ts
│   │   ├── mongooseConnector.plugin.ts
│   │   ├── logger.plugin.ts
│   │   └── swagger.plugin.ts
│   ├── utils
│   │   └── logger.ts
│   └── index.ts
└── test
    ├── modules
    │   └── auth.test.ts
    └── setup.ts
```
