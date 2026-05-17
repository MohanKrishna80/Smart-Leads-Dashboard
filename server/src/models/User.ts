import mongoose, { Schema, type HydratedDocument } from "mongoose";
import { userRoles, type UserRole } from "../types/domain.js";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<IUser>;

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: userRoles, default: "sales", required: true }
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
