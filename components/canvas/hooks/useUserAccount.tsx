import { useAccount, useMsal } from "@azure/msal-react";

export const useUserAccount = () => {
  const { accounts } = useMsal();
  return useAccount(accounts[0] || {});
};
