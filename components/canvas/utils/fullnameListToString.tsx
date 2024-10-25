import { userAccess } from "@/types/UserAccess";

export const fullNameListToString = (userAccesses: userAccess[]) =>
  userAccesses
    .map((userAccess) => userAccess.fullName || userAccess.user)
    .join(", ");
