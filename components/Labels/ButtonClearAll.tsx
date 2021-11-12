import { Button } from "@equinor/eds-core-react";
import { useRouter } from "next/router";
import React from "react";
import { getQueryObject } from "utils/getQueryObject";

export default function ButtonClearAll(): JSX.Element {
  const router = useRouter();

  const handleClearClick = () => {
    router.query.rl = [];
    const queryObject = getQueryObject(router.query);
    router.replace({
      pathname: router.pathname,
      query: { ...queryObject },
    });
  };

  return (
    <Button
      color="primary"
      variant="ghost"
      onClick={() => handleClearClick()}
      style={{ minWidth: "90px" }}
    >
      Clear all
    </Button>
  );
}
