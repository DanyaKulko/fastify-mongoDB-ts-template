import { Schema, model } from "mongoose";

export type UserRole = "user" | "admin" | "manager";

export interface IUser {
	_id: string;
	username: string;
	email: string;
	password: string;
	role: UserRole;
	createdAt: Date;
}

const UserSchema = new Schema<IUser>(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: ["user", "admin", "manager"],
			default: "user",
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ versionKey: false },
);

export default model<IUser>("User", UserSchema);
