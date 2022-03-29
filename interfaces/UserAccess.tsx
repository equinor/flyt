export type userAccessRole = "Owner" | "Admin" | "Contributor" | "Reader";

export interface userAccess {
  accessId: number;
  role: userAccessRole;
  user: string;
}
