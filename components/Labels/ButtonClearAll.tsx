import { Button } from "@equinor/eds-core-react";
import { useRouter } from "next/router";
import React from "react";

export default function ButtonClearAll(): JSX.Element {
  const router = useRouter();

  const handleClearClick = () => {
    router.replace({
      query: { ...router.query, rl: [] },
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
