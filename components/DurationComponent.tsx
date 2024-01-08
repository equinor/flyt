import { vsmObject } from "../interfaces/VsmObject";
import { Autocomplete, TextField } from "@equinor/eds-core-react";
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
          setTime(parseFloat(event.target.value));
          props.onChangeTime({
            time: parseFloat(event.target.value),
            unit: unit,
          });
        }}
      />
      <div style={{ padding: 8 }} />
      <Autocomplete
        disabled={props.disabled}
        options={getTimeDefinitionValues()}
        onInputChange={(i) => {
          const apiValue = getTimeDefinitionValue(i);
          setUnit(apiValue);
          props.onChangeTime({ time: time, unit: apiValue });
        }}
        selectedOptions={[getTimeDefinitionDisplayName(unit)]}
        label="Unit"
      />
    </div>
  );
}
