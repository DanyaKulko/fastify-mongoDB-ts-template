# Fastify Mongodb TypeScript Modular Template

Modular template for Fastify with MongoDB and TypeScript. Winston logger with logrotate module is used for logging.


## This template includes:

- Fastify (5.x) 
- Mongoose
- Winston + Winston logrotate
- Eslint
- Prettier
- Swagger in development mode
- JWT authentication + role based access control


This template is open for contributions and suggestions. Feel free to open an issue or pull request.

## Ideas to Implement

- [ ] Add tests
- [ ] Add docker and docker-compose configuration
- [ ] Add GitHub actions
- [ ] Add husky for pre-commit hooks

## Getting Started

### Scripts

- `npm run dev`: Start the server in development mode
- `npm run build`: Build the project
- `npm start`: Start the server in production mode
- `npm run lint`: Lint the project

### Environment Variables

- `PORT`: Port number for the server
- `MONGODB_URI`: MongoDB connection URI
- `JWT_SECRET`: Secret key for JWT
- `ALLOWED_ORIGIN`: Allowed origin for CORS


## Folder Structure

```text
src
├── config
│   ├── index.ts
│   └── logger.ts
├── errors
│   ├── AuthError.ts
│   └── BaseError.ts
├── modules
│   ├── auth
│   │   ├── auth.controller.ts
│   │   ├── auth.route.ts
│   │   ├── auth.schema.ts
│   │   ├── auth.types.ts
│   │   └── auth.service.ts
│   └── user
│       ├── user.controller.ts
│       ├── user.model.ts
│       ├── user.route.ts
│       ├── user.repository.ts
│       ├── user.schema.ts
│       ├── user.types.ts
│       └── user.service.ts
├── types
│   ├── fastify
│   │   └── index.d.ts
│   ├── models.ts
│   └── request.ts
├── plugins
│   └── auth.plugin.ts
│   └── errorHandler.plugin.ts
│   └── prismaConnector.plugin.ts
│   └── swagger.plugin.ts
├── utils
│   └── logger.ts
└── app.ts
```
