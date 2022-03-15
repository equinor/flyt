export type userAccessRole = "Owner" | "Admin" | "Contributor" | "Reader";

export interface userAccess {
  accessId: number;
  user: string;
  role: userAccessRole;
}
