import { NodeData } from "../types/NodeData";
import { Autocomplete, TextField } from "@equinor/eds-core-react";
import {
  getTimeDefinitionDisplayName,
  getTimeDefinitionValue,
  getTimeDefinitionValues,
} from "@/types/unitDefinitions";
import { ChangeEvent, useEffect, useState } from "react";

type DurationComponent = {
  selectedNode: NodeData;
  onChangeDuration: (e: {
    duration: number | null;
    unit: string | null;
  }) => void;
  disabled: boolean;
};

export function DurationComponent({
  selectedNode,
  onChangeDuration,
  disabled,
}: DurationComponent) {
  const [duration, setDuration] = useState<number | null>(
    selectedNode.duration
  );
  const [unit, setUnit] = useState<string | null>(selectedNode.unit);

  useEffect(() => {
    setDuration(selectedNode.duration);
    setUnit(selectedNode.unit);
  }, [selectedNode]);

  const parseValue = (value: string) =>
    value === "" ? null : parseFloat(value);

  const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseValue(event.target.value);
    setDuration(value);
    onChangeDuration({
      duration: value,
      unit: unit,
    });
  };

  const handleUnitChange = (event: string) => {
    const value = getTimeDefinitionValue(event);
    setUnit(value);
    onChangeDuration({ duration, unit: value });
  };

  return (
    <div style={{ display: "flex" }}>
      <TextField
        disabled={disabled}
        label={"Duration"}
        type={"number"}
        id={"vsmObjectTime"}
        min={0}
        value={`${duration === null ? "" : duration}`}
        onChange={handleDurationChange}
      />
      <div style={{ padding: 8 }} />
      <Autocomplete
        disabled={disabled}
        options={getTimeDefinitionValues()}
        onInputChange={handleUnitChange}
        selectedOptions={[
          unit ? getTimeDefinitionDisplayName(unit) : undefined,
        ]}
        label="Unit"
      />
    </div>
  );
}
