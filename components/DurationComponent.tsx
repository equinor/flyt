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
    props.onChangeTime({ time: time, unit });
  }, [time, unit]);

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
        value={`${time}`}
        onChange={(event) => setTime(parseFloat(event.target.value))}
      />
      <div style={{ padding: 8 }} />
      <SingleSelect
        disabled={props.disabled}
        items={getTimeDefinitionValues()}
        handleSelectedItemChange={(i) => {
          const apiValue = getTimeDefinitionValue(i.selectedItem);
          setUnit(apiValue);
        }}
        value={getTimeDefinitionDisplayName(unit)}
        label="Unit"
      />
    </div>
  );
}
