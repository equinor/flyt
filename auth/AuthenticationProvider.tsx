import React, { useEffect } from 'react';
import { MsalProvider, useMsal, useAccount, useIsAuthenticated } from '@azure/msal-react';
import msalInstance from './msalHelpers';

const AuthHandler = props => {
  const { instance, accounts, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const account = useAccount(accounts[0] || {});
  useEffect(() => {
    if (isAuthenticated) {
      instance.setActiveAccount(account);
    }
  }, [isAuthenticated]);

  return <>{props.children}</>;
};

const AuthenticationProvider = props => {
  return (
    <MsalProvider instance={msalInstance}>
      <AuthHandler {...props} />
    </MsalProvider>
  );
};

export default AuthenticationProvider;
export { msalInstance };
