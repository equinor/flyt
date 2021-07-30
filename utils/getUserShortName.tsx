export const getUserShortName = (account: { username: string }): string =>
  account.username.split("@")[0];
