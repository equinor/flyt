import { Project } from "@/types/Project";
import { getMyAccess } from "@/utils/getMyAccess";
import router from "next/router";
import { useUserAccount } from "./useUserAccount";

export const useAccess = (project: Project) => {
  const { version } = router.query;
  const account = useUserAccount();
  const myAccess = getMyAccess(project, account);
  const userCanEdit = !version && myAccess !== "Reader";
  const isAdmin = myAccess === "Admin" || myAccess === "Owner";

  return {
    myAccess,
    userCanEdit,
    isAdmin,
  };
};
