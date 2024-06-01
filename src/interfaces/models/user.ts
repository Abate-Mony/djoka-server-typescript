import { Schema } from "mongoose";
import { USER_ROLES } from "../../utils/constant.js";
export type UserroleTypes = "admin" | "student" | "proffessour";
type CreatedBy = {
  userId: typeof Schema.ObjectId;
  user: string;
};
type Role = (typeof USER_ROLES)[number];
export interface IUser {
  firstName: string;
  lastName: string;
  password: string;
  isVerified: any;
  createdBy: CreatedBy;
  avatarPublicId?: string;
  avatar?: string;
  role: Role;
  email: string;
  sex: string;
  readonly userId: number;
  phoneNumber: number;
  otp: {
    expiresAt: Date;
    value: string;
  };
}
