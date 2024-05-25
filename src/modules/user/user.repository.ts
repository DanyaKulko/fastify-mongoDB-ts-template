import User from './user.model';
import { IUser } from '@projectTypes/models';

class UserRepository {
    async createUser(username: string, email: string, password: string): Promise<IUser> {
        return await User.create({ username, email, password });
    }

    async checkUserExistsByEmailOrUsername(email: string, username: string) {
        return User.exists({ $or: [{ email }, { username }] });
    }

    async findUserById(id: string): Promise<IUser | null> {
        return User.findById(id).lean();
    }

    async findUserByEmail(email: string): Promise<IUser | null> {
        return User.findOne({ email }).lean();
    }
}

export default new UserRepository();
