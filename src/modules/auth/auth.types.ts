export interface SignupUserBody {
    email: string;
    username: string;
    password: string;
}

export interface LoginUserBody {
    email: string;
    password: string;
}

export interface SignupUserRequest {
    Body: SignupUserBody;
}

export interface LoginUserRequest {
    Body: LoginUserBody;
}
