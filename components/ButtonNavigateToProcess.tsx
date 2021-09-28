import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Button, Icon, Tooltip } from "@equinor/eds-core-react";
import { arrow_back_ios } from "@equinor/eds-icons";

export function ButtonNavigateToProcess(): JSX.Element {
  const router = useRouter();
  const { id } = router.query;

  function navigateToCanvas() {
    router.push(`/projects/${id}`);
  }

  useEffect(() => {
    const handleKeyboard = (event) => {
      if (event.code === "Escape") navigateToCanvas();
    };
    document.addEventListener("keydown", handleKeyboard);
    return () => document.removeEventListener("keydown", handleKeyboard);
  }, []);

  return (
    <Tooltip title={"Go to the process overview. - [Escape]"}>
      <Button variant={"ghost"} onClick={() => navigateToCanvas()}>
        <Icon data={arrow_back_ios} color={"#007079"} />
        Back to Process
      </Button>
    </Tooltip>
  );
}
