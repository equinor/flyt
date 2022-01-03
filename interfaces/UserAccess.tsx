export interface userAccess {
  accessId: number;
  user: string;
  role: "Owner" | "Admin" | "Contributor" | "Reader";
}
