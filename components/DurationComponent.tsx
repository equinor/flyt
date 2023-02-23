import { vsmObject } from "../interfaces/VsmObject";
import { SingleSelect, TextField } from "@equinor/eds-core-react";
import {
  getTimeDefinitionDisplayName,
  getTimeDefinitionValue,
  getTimeDefinitionValues,
} from "../types/timeDefinitions";
import React, { useEffect, useState } from "react";

export function DurationComponent(props: {
  selectedObject: vsmObject;
  onChangeTime: (e: { time: number; unit: string }) => void;
  disabled: boolean;
}): JSX.Element {
  const [time, setTime] = useState(props.selectedObject.time);
  const [unit, setUnit] = useState(props.selectedObject.timeDefinition);

  useEffect(() => {
    setTime(props.selectedObject.time);
    setUnit(props.selectedObject.timeDefinition);
  }, [props.selectedObject]);

  return (
    <div style={{ display: "flex" }}>
      <TextField
        disabled={props.disabled}
        label={"Duration"}
        type={"number"}
        id={"vsmObjectTime"}
        min={0}
        value={`${time}`}
        onChange={(event) => {
          const newTime = event.target.value
            ? parseFloat(event.target.value)
            : 0;
          setTime(newTime);
          props.onChangeTime({
            time: newTime,
            unit: unit,
          });
        }}
      />
      <div style={{ padding: 8 }} />
      <SingleSelect
        disabled={props.disabled}
        label="Unit"
        value={getTimeDefinitionDisplayName(unit)}
        items={getTimeDefinitionValues()}
        handleSelectedItemChange={(i) => {
          const selectedUnit = i.selectedItem
            ? getTimeDefinitionValue(i.selectedItem)
            : "";
          setUnit(selectedUnit);
          props.onChangeTime({
            time: time,
            unit: selectedUnit,
          });
        }}
      />
    </div>
  );
}
