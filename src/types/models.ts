export type UserRole = 'user' | 'admin' | 'manager';

export interface IUser {
    _id: string;
    username: string;
    email: string;
    password: string;
    role: UserRole;
    createdAt: Date;
}

// example of a post model
export interface IPost {
    _id: string;
    title: string;
    content: string;
    author: string | IUser;
}
