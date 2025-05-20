import { NodeDataCommon } from "../types/NodeData";
import { Autocomplete, TextField } from "@equinor/eds-core-react";
import {
  getTimeDefinitionDisplayName,
  getTimeDefinitionValue,
  getTimeDefinitionDisplayNames,
} from "@/utils/unitDefinitions";
import { ChangeEvent, useEffect, useState } from "react";
import { sortSearch } from "@/utils/sortSearch";

type DurationComponent = {
  selectedNode: NodeDataCommon;
  onChangeDuration: (e: {
    duration?: number | null;
    unit?: string | null;
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
  };

  const handleUnitChange = (unit: string) => {
    setUnitSearchInput(unit);
    const value = getTimeDefinitionValue(unit);
    setUnit(value);
    onChangeDuration({ unit: value });
  };

  const handleOnBlurDuration = () => {
    onChangeDuration({ duration });
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
        onBlur={handleOnBlurDuration}
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
