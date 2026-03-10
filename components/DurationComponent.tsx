import { NodeDataCommon } from "../types/NodeData";
import { Autocomplete, TextField } from "@equinor/eds-core-react";
import {
  getTimeDefinitionDisplayName,
  getTimeDefinitionValue,
  getTimeDefinitionDisplayNames,
} from "@/utils/unitDefinitions";
import { ChangeEvent, useEffect, useState } from "react";
import { sortSearch } from "@/utils/sortSearch";
import { Duration, Unit } from "@/types/NodeInput";

type DurationComponent = {
  selectedNode: NodeDataCommon;
  onChangeDuration: (value: string | number | null, field: string) => void;
  onBlurDuration: (field: "duration" | "unit", value?: string | null) => void;
  disabled: boolean;
};

export function DurationComponent({
  selectedNode,
  onChangeDuration,
  onBlurDuration,
  disabled,
}: DurationComponent) {
  const [duration, setDuration] = useState<number | null>(
    selectedNode.duration
  );
  const [unit, setUnit] = useState<string | null>(selectedNode.unit);
  const [unitSearchInput, setUnitSearchInput] = useState("");

  const timeDefinitionDisplayNames = getTimeDefinitionDisplayNames();

  useEffect(() => {
    setDuration(selectedNode.duration);
    setUnit(selectedNode.unit);
  }, [selectedNode]);

  const parseValue = (value: string) =>
    value === "" ? null : parseFloat(value);

  const handleDurationChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseValue(event.target.value);
    setDuration(value);
    onChangeDuration(value, Duration);
  };

  const handleUnitChange = (unit: string) => {
    setUnitSearchInput(unit);
    const value = getTimeDefinitionValue(unit);
    setUnit(value);
    onChangeDuration(value, Unit);
    onBlurDuration(Unit, value);
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
        onBlur={() => onBlurDuration(Duration)}
      />
      <div style={{ padding: 8 }} />
      <Autocomplete
        disabled={disabled}
        options={sortSearch(timeDefinitionDisplayNames, unitSearchInput)}
        onInputChange={handleUnitChange}
        selectedOptions={[
          unit ? getTimeDefinitionDisplayName(unit) : undefined,
        ]}
        optionsFilter={() => true}
        label="Unit"
        autoWidth
      />
    </div>
  );
}
