import { Typography } from "@equinor/eds-core-react";
import React, { useEffect } from "react";
import styles from "../styles/common.module.scss";
import { useRouter } from "next/router";

const NotAuthenticatedMessage = () => {
  const { asPath: redirectUrl } = useRouter();
  const router = useRouter();

  /**
   * Automatically navigate to login-page
   * Login-page will show an error-message if we couldn't login.
   */
  useEffect(() => {
    router.push(`/login?redirect=${redirectUrl}`);
  }, []);

  return (
    <main className={styles.main}>
      <Typography variant="h1">You must be logged in to see that...</Typography>
    </main>
  );
};
export default NotAuthenticatedMessage;
