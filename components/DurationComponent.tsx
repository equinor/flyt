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
import { useStoreActions, useStoreState } from "easy-peasy";

type DurationComponent = {
  selectedNode: NodeDataCommon;
  onChangeDuration: (
    value: string | number | null,
    field: typeof Duration | typeof Unit
  ) => void;
  disabled: boolean;
  lastUpdatedDuration: number;
  lastUpdatedUnit: string;
};

export function DurationComponent({
  selectedNode,
  onChangeDuration,
  disabled,
  lastUpdatedDuration,
  lastUpdatedUnit,
}: DurationComponent) {
  const [duration, setDuration] = useState<number | null>(
    selectedNode.duration
  );
  const [unit, setUnit] = useState<string | null>(selectedNode.unit);
  const [unitSearchInput, setUnitSearchInput] = useState("");

  const timeDefinitionDisplayNames = getTimeDefinitionDisplayNames();
  const undoRedoSynced = useStoreState((s: any) => s.undoRedoSynced) as boolean;
  const setUndoRedoSynced = useStoreActions((a: any) => a.setUndoRedoSynced);

  useEffect(() => {
    if (undoRedoSynced) {
      setDuration(selectedNode.duration);
      setUnit(selectedNode.unit);
      setUndoRedoSynced(false);
      return;
    }
    if (lastUpdatedDuration !== selectedNode.duration)
      setDuration(selectedNode.duration);
    if (lastUpdatedUnit !== selectedNode.unit) setUnit(selectedNode.unit);
  }, [selectedNode]);

  const parseValue = (value: string) =>
    value === "" ? null : parseFloat(value);

  const handleDurationChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseValue(event.target.value);
    setDuration(value);
    onChangeDuration(value, Duration);
  };

  const handleUnitChange = (unitObj: { selectedItems: string[] }) => {
    const unitVal = unitObj?.selectedItems[0] || "";
    setUnitSearchInput(unitVal);
    const value = getTimeDefinitionValue(unitVal);
    if (value === unit) return;
    setUnit(value);
    onChangeDuration(value, Unit);
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
        onOptionsChange={handleUnitChange}
        selectedOptions={unit ? [getTimeDefinitionDisplayName(unit)] : []}
        optionsFilter={() => true}
        label="Unit"
        autoWidth
      />
    </div>
  );
}
