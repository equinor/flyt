export const getUserName = (account: { username: string }): string =>
  account.username.split("@")[0];
