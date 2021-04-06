import { vsmObject } from "../interfaces/VsmObject";
import { SingleSelect, TextField } from "@equinor/eds-core-react";
import {
  getTimeDefinitionDisplayName,
  getTimeDefinitionValue,
  getTimeDefinitionValues,
} from "../types/timeDefinitions";
import React from "react";

export function DurationComponent(props: {
  selectedObject: vsmObject;
  onChangeTime: (event: { target: { value: string } }) => void;
  onChangeTimeDefinition: (timeDefinition: string) => void;
}): JSX.Element {
  return (
    <div style={{ display: "flex" }}>
      <TextField
        label={"Duration"}
        type={"number"}
        value={props.selectedObject.time?.toString()}
        id={"vsmObjectTime"}
        onChange={props.onChangeTime}
      />
      <div style={{ padding: 8 }} />
      <SingleSelect
        items={getTimeDefinitionValues()}
        handleSelectedItemChange={(i) => {
          const apiValue = getTimeDefinitionValue(i.selectedItem);
          props.onChangeTimeDefinition(apiValue);
        }}
        initialSelectedItem={getTimeDefinitionDisplayName(
          props.selectedObject.timeDefinition
        )}
        label="Unit"
      />
    </div>
  );
}
