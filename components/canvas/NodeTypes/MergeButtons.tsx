import { Checkbox, Button } from "@equinor/eds-core-react";
import React, { useEffect, useState } from "react";
import { ChoiceButton } from "./ChoiceButton";
import { MergeButton } from "./MergeButton";
import { SubActivityButton } from "./SubActivityButton";
import { WaitingButton } from "./WaitingButton";

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
        onClick={() => setSelectedButton("SubActivity")}
        active={selectedButton === "SubActivity"}
      />
      <ChoiceButton
        onClick={() => setSelectedButton("Choice")}
        active={selectedButton === "Choice"}
      />
      <WaitingButton
        onClick={() => setSelectedButton("Waiting")}
        active={selectedButton === "Waiting"}
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
