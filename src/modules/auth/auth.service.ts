import UserRepository from '@userModule/user.repository';
import { LoginUserBody, SignupUserBody } from '@authModule/auth.types';
import bcrypt from 'bcrypt';

class AuthService {
    async registerUser({ email, username, password }: SignupUserBody) {
        const userExists = await UserRepository.checkUserExistsByEmailOrUsername(email, username);

        if (userExists) {
            throw new Error('User with that email or username already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        return await UserRepository.createUser(username, email, hashedPassword);
    }

    async loginUser({ email, password }: LoginUserBody) {
        const user = await UserRepository.findUserByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            throw new Error('Password is incorrect');
        }

        return user;
    }
}

export default new AuthService();
