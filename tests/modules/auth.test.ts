import buildServer from "@src/index";
import type { FastifyInstance } from "fastify";
import { faker } from "@faker-js/faker";

describe("Authorization module", () => {
	let server: FastifyInstance;

	beforeAll(async () => {
		server = await buildServer();
	});

	afterAll(async () => {
		await server.close();
	});

	test("Signup should fail with existing email", async () => {
		const userData = {
			email: faker.internet.email(),
			username: faker.internet.userName(),
			password: faker.internet.password(),
		};

		await server.inject({
			method: "POST",
			url: "/api/auth/signup",
			payload: userData,
		});

		const response = await server.inject({
			method: "POST",
			url: "/api/auth/signup",
			payload: userData,
		});

		expect(response.statusCode).toBe(400);
		expect(response.json()).toHaveProperty("message");
	});

	test("Login should fail with incorrect password", async () => {
		const email = faker.internet.email();
		const username = faker.internet.userName();
		const password = faker.internet.password();

		await server.inject({
			method: "POST",
			url: "/api/auth/signup",
			payload: {
				email: email,
				username: username,
				password: password,
			},
		});

		const response = await server.inject({
			method: "POST",
			url: "/api/auth/login",
			payload: {
				email: email,
				password: faker.internet.password(),
			},
		});

		expect(response.statusCode).toBe(400);
		expect(response.json()).toHaveProperty("message");
	});

	test("Login should fail with non-existent user", async () => {
		const response = await server.inject({
			method: "POST",
			url: "/api/auth/login",
			payload: {
				email: faker.internet.email(),
				password: faker.internet.password(),
			},
		});

		expect(response.statusCode).toBe(404);
		expect(response.json()).toHaveProperty("message");
	});

	test("Successful signup", async () => {
		const response = await server.inject({
			method: "POST",
			url: "/api/auth/signup",
			payload: {
				email: faker.internet.email(),
				username: faker.internet.userName(),
				password: faker.internet.password(),
			},
		});
		const jsonResponse = response.json();
		expect(jsonResponse).toHaveProperty("token");
		expect(typeof jsonResponse.token).toBe("string");
	});

	test("Successful login", async () => {
		const email = faker.internet.email();
		const username = faker.internet.userName();
		const password = faker.internet.password();

		await server.inject({
			method: "POST",
			url: "/api/auth/signup",
			payload: {
				email: email,
				username: username,
				password: password,
			},
		});

		const loginResponse = await server.inject({
			method: "POST",
			url: "/api/auth/login",
			payload: {
				email: email,
				password: password,
			},
		});

		const loginJsonResponse = loginResponse.json();
		expect(loginJsonResponse).toHaveProperty("token");
		expect(typeof loginJsonResponse.token).toBe("string");
	});
});
