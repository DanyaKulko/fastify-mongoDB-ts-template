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

### Scripts

- `npm run dev`: Start the server in development mode
- `npm run build`: Build the project
- `npm start`: Start the server in production mode
- `npm run lint`: Lint the project
- `npm run test`: Run tests

There is also generate-module.sh script that can be used to generate new module with all necessary files.

```bash
./bin/generate-module.sh <module-name>
```

## Testing

Jest is used for testing. To isolate tests from the main application, a separate MongoDB instance is created for testing.

To run tests:
```bash
npm run test
```

## Commit Message Guidelines

### We follow the Conventional Commits specification for our commit messages. Here are the key types of commits we use:

- `feat`: A new feature.
- `fix`: A bug fix.
- `docs`: Documentation only changes.
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc).
- `refactor`: A code change that neither fixes a bug nor adds a feature.
- `test`: Adding missing or correcting existing tests.
- `chore`: Changes to the build process or auxiliary tools and libraries such as documentation generation.

#### Examples:

```bash
git commit -m "feat: add user authentication"
git commit -m "fix: resolve issue with login form validation"
git commit -m "docs: update API documentation"
git commit -m "style: format code with Prettier"
git commit -m "refactor: simplify the user service logic"
git commit -m "test: add tests for user authentication"
git commit -m "chore: update npm dependencies"
```

## Additional Information

1. Husky is used to run staged linting using pre-commit hooks. Prettier is used to format the code.
2. Swagger is available in development mode at `http://localhost:3000/docs`.

Also, don't forget to change the .env file with your own values and delete the tracking of the .env file in the .gitignore file.

## Folder Structure

```text
├── src
│   ├── config
│   │   └── index.ts
│   ├── errors
│   │   └── HttpError.ts
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
│   │       ├── user.schema.ts
│   │       ├── user.types.ts
│   │       └── user.service.ts
│   ├── types
│   │   └── fastify
│   │       └── index.d.ts
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
