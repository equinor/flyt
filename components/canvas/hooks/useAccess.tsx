import { Project } from "@/types/Project";
import { getMyAccess } from "@/utils/getMyAccess";
import router from "next/router";
import { useUserAccount } from "./useUserAccount";
import { accessRoles } from "@/types/AccessRoles";

export const useAccess = (project: Project) => {
  const { version } = router.query;
  const { Contributor, Reader } = accessRoles;
  const account = useUserAccount();
  const myAccess = getMyAccess(project, account);
  const userCanEdit = !version && myAccess !== Reader;
  const isAdmin = myAccess === Contributor;
  return {
    myAccess,
    userCanEdit,
    isAdmin,
  };
};
