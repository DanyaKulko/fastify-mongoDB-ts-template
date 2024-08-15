import type { LoginUserBody, SignupUserBody } from "@authModule/auth.types";
import bcrypt from "bcrypt";
import HttpError from "@errors/HttpError";
import User from "@userModule/user.model";

class AuthService {
	async registerUser({ email, username, password }: SignupUserBody) {
		const userExists = await User.exists({
			$or: [{ email }, { username }],
		});

		if (userExists) {
			throw new HttpError(404, "User not found");
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		return await User.create({ username, email, password: hashedPassword });
	}

	async loginUser({ email, password }: LoginUserBody) {
		const user = await User.findOne({ email }).lean();
		if (!user) {
			throw new HttpError(404, "User not found");
		}

		const isPasswordCorrect = await bcrypt.compare(password, user.password);

		if (!isPasswordCorrect) {
			throw new HttpError(400, "Password incorrect");
		}

		return user;
	}
}

export default new AuthService();
