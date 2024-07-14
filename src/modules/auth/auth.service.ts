import UserRepository from "@userModule/user.repository";
import type { LoginUserBody, SignupUserBody } from "@authModule/auth.types";
import bcrypt from "bcrypt";
import { PasswordIncorrectError, UserExistsError, UserNotFoundError } from "@errors/AuthErrors";

class AuthService {
	async registerUser({ email, username, password }: SignupUserBody) {
		const userExists = await UserRepository.checkUserExistsByEmailOrUsername(email, username);

		if (userExists) {
			throw new UserExistsError();
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		return await UserRepository.createUser(username, email, hashedPassword);
	}

	async loginUser({ email, password }: LoginUserBody) {
		const user = await UserRepository.findUserByEmail(email);
		if (!user) {
			throw new UserNotFoundError();
		}

		const isPasswordCorrect = await bcrypt.compare(password, user.password);

		if (!isPasswordCorrect) {
			throw new PasswordIncorrectError();
		}

		return user;
	}
}

export default new AuthService();
