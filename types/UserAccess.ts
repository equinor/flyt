export type userAccessRole = "Owner" | "Admin" | "Contributor" | "Reader";

export type userAccess = {
  accessId: number;
  role: userAccessRole;
  user: string;
};
