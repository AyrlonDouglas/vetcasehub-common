import type UserEmail from "../valueObjects/UserEmail";
import { type UserName } from "../valueObjects/UserName";

export interface UserDomainProps {
  email: UserEmail;
  username: UserName;
  firstName: string;
  lastName: string;
  status: UserStatusType;
  password: string;
}

export const USER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export type UserStatusType = (typeof USER_STATUS)[keyof typeof USER_STATUS];

export interface UserPrepareToCreateProps {
  id?: string;
  email: string;
  username: string;
  status: string;
  firstName: string;
  lastName: string;
  password: string;
}
