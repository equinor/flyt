import { Button, Scrim } from "@equinor/eds-core-react";
import React, { useState } from "react";

import FilterLabelBox from "./FilterLabelBox";

export default function FilterLabelButton(): JSX.Element {
  const [visibleScrim, setVisibleScrim] = useState(false);
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
        Filter by label
      </Button>
      <Scrim
        open={visibleScrim}
        onClose={() => setVisibleScrim(false)}
        isDismissable
      >
        <FilterLabelBox handleClose={() => setVisibleScrim(false)} />
      </Scrim>
    </>
  );
}
