export type userAccessRole = "Owner" | "Admin" | "Contributor" | "Reader";

export type userAccess = {
  accessId: number;
  role: userAccessRole;
  user: string;
};

export type UserAccessSearch = {
  displayName: string;
  email: string;
  shortName: string;
};
