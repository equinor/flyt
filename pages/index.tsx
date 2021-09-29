import { Typography } from "@equinor/eds-core-react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import commonStyles from "../styles/common.module.scss";

export default function DummyPage(): JSX.Element {
  const router = useRouter();
  useEffect(() => {
    router.push("/projects?orderBy=modified");
  });
  return (
    <div className={commonStyles.main}>
      <Typography variant={"h2"}>Redirecting you to the front page.</Typography>
    </div>
  );
}
