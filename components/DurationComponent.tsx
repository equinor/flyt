import { Autocomplete, TextField } from "@equinor/eds-core-react";
import {
  getTimeDefinitionDisplayName,
  getTimeDefinitionValue,
  getTimeDefinitionDisplayNames,
} from "@/utils/unitDefinitions";
import { ChangeEvent, useEffect, useState } from "react";
import { sortSearch } from "@/utils/sortSearch";

type DurationComponent = {
  durationValue: number | null;
  unitValue: string | null;
  onChangeDuration: (text: number | null) => void;
  onChangeUnit: (text: string | null) => void;
  disabled: boolean;
};

export function DurationComponent({
  durationValue,
  unitValue,
  onChangeDuration,
  onChangeUnit,
  disabled,
}: DurationComponent) {
  const [duration, setDuration] = useState<number | null>(
    Number(durationValue)
  );
  const [unit, setUnit] = useState<string | null>(unitValue);
  const [unitSearchInput, setUnitSearchInput] = useState("");

  const timeDefinitionDisplayNames = getTimeDefinitionDisplayNames();

  useEffect(() => {
    setDuration(Number(durationValue));
    setUnit(unitValue);
  }, [durationValue, unitValue]);

  const parseValue = (value: string) =>
    value === "" ? null : parseFloat(value);

  const handleDurationChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseValue(event.target.value);
    setDuration(value);
    onChangeDuration(value);
  };

  const handleUnitChange = (unit: string) => {
    setUnitSearchInput(unit);
    const value = getTimeDefinitionValue(unit);
    setUnit(value);
    onChangeUnit(value);
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
