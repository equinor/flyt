import { Button, Scrim } from "@equinor/eds-core-react";
import { useState } from "react";

import { FilterUserBox } from "./FilterUserBox";
import { numberOfQueryParams } from "utils/numberOfQueryParams";
import { useRouter } from "next/router";

export function FilterUserButton(): JSX.Element {
  const [visibleScrim, setVisibleScrim] = useState(false);
  const router = useRouter();
  const numberOfSelectedUsers = numberOfQueryParams(router.query.user);

  return (
    <>
      <Button
        color="primary"
        variant="ghost"
        style={{
          fontSize: "14px",
          fontWeight: "normal",
          marginRight: "8px",
        }}
        onClick={() => setVisibleScrim(true)}
      >
        Filter by users
        {numberOfSelectedUsers ? ` (${numberOfSelectedUsers})` : ""}
      </Button>
      <Scrim
        onClose={() => setVisibleScrim(false)}
        isDismissable
        open={visibleScrim}
      >
        <FilterUserBox handleClose={() => setVisibleScrim(false)} />
      </Scrim>
    </>
  );
}
