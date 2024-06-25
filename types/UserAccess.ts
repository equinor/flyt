export type userAccessRole = "Owner" | "Admin" | "Contributor" | "Reader";

export type userAccess = {
  accessId: number;
  role: userAccessRole;
  user: string;
  fullName: string | null;
};

export type UserAccessSearch = {
  shortName: string;
  email: string;
  displayName: string;
};
