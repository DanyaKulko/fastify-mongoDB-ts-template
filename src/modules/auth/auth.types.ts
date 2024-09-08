import type { RouteGenericInterface } from "fastify";

type Implements<T, U extends T> = U;

export type SignupUserRequest = Implements<
	RouteGenericInterface,
	{
		Body: {
			email: string;
			username: string;
			password: string;
		};
	}
>;

export type LoginUserRequest = Implements<
	RouteGenericInterface,
	{
		Body: {
			email: string;
			password: string;
		};
	}
>;
