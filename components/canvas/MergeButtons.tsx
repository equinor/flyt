import { Checkbox, Button } from "@equinor/eds-core-react";
import React, { useEffect, useState } from "react";
import { ChoiceButton } from "./ChoiceButton";
import { MergeButton } from "./MergeButton";
import { SubActivityButton } from "./SubActivityButton";
import { WaitingButton } from "./WaitingButton";
import { vsmObjectTypes } from "types/vsmObjectTypes";

export const MergeButtons = (props) => {
  const [selectedButton, setSelectedButton] = useState<string>(null);
  const { handleClickCancelMerge, handleClickConfirmMerge, mergeInitiator } =
    props;

  useEffect(() => {
    setSelectedButton(null);
  }, [mergeInitiator]);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          alignItems: "center",
        }}
      >
        <Checkbox checked readOnly onClick={() => handleClickCancelMerge()} />
        <MergeButton onClick={() => handleClickCancelMerge()} active />
      </div>
      <SubActivityButton
        onClick={() => setSelectedButton(vsmObjectTypes.subActivity)}
        active={selectedButton === vsmObjectTypes.subActivity}
      />
      <ChoiceButton
        onClick={() => setSelectedButton(vsmObjectTypes.choice)}
        active={selectedButton === vsmObjectTypes.choice}
      />
      <WaitingButton
        onClick={() => setSelectedButton(vsmObjectTypes.waiting)}
        active={selectedButton === vsmObjectTypes.waiting}
      />
      <Button
        onClick={() => handleClickConfirmMerge(selectedButton)}
        disabled={!selectedButton}
      >
        MERGE
      </Button>
    </>
  );
};
