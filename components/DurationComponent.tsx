import { NodeDataApi } from "../types/NodeDataApi";
import { Autocomplete, TextField } from "@equinor/eds-core-react";
import {
  getTimeDefinitionDisplayName,
  getTimeDefinitionValue,
  getTimeDefinitionValues,
} from "../types/unitDefinitions";
import { useEffect, useState } from "react";

export function DurationComponent(props: {
  selectedNode: NodeDataApi;
  onChangeDuration: (e: { duration: number; unit: string }) => void;
  disabled: boolean;
}): JSX.Element {
  const [duration, setDuration] = useState(props.selectedNode.duration);
  const [unit, setUnit] = useState(props.selectedNode.unit);

  useEffect(() => {
    setDuration(props.selectedNode.duration);
    setUnit(props.selectedNode.unit);
  }, [props.selectedNode]);

  return (
    <div style={{ display: "flex" }}>
      <TextField
        disabled={props.disabled}
        label={"Duration"}
        type={"number"}
        id={"vsmObjectTime"}
        min={0}
        value={`${duration}`}
        onChange={(event) => {
          setDuration(parseFloat(event.target.value));
          props.onChangeDuration({
            duration: parseFloat(event.target.value),
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
          props.onChangeDuration({ duration, unit: apiValue });
        }}
        selectedOptions={[getTimeDefinitionDisplayName(unit)]}
        label="Unit"
      />
    </div>
  );
}
