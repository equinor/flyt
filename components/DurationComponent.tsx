import { NodeDataApi } from "../types/NodeDataApi";
import { SingleSelect, TextField } from "@equinor/eds-core-react";
import {
  getUnitDisplayName,
  getUnitValue,
  getUnitValues,
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
      <SingleSelect
        disabled={props.disabled}
        items={getUnitValues()}
        handleSelectedItemChange={(i) => {
          const apiValue = getUnitValue(i.selectedItem);
          setUnit(apiValue);
          props.onChangeDuration({ duration, unit: apiValue });
        }}
        value={getUnitDisplayName(unit)}
        label="Unit"
      />
    </div>
  );
}
