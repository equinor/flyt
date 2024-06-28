import { userAccessRole } from "./UserAccessRole";

export type userAccess = {
  accessId: number;
  role: userAccessRole;
  user: string;
  fullName: string | null;
};
