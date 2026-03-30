import { users } from "../../../db/schema";

export type IUser = typeof users.$inferSelect;
export type ICreateUserInput = Pick<IUser, "name" | "email" | "password_hash">;
export type IUpdateUserInput = Pick<IUser, "name" | "email" | "password_hash">;
export type IAdminCreateUserInput = Pick<IUser, "name" | "email" | "password_hash" | "role">;
export type IUpdateUserByAdminInput = Pick<IUser, "name" | "email" | "role">;
