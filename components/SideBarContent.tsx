import { vsmObject } from "../interfaces/VsmObject";
import { vsmObjectTypes } from "../types/vsmObjectTypes";
import { SingleSelect, TextField } from "@equinor/eds-core-react";
import styles from "./VSMCanvas.module.scss";
import React from "react";
import {
  getTimeDefinitionDisplayName,
  getTimeDefinitionValue,
  getTimeDefinitionValues,
} from "../types/timeDefinitions";

function DurationComponent(props: {
  selectedObject: vsmObject;
  onChangeName: (event: { target: { value: string } }) => void;
  onChangeRole: (event: { target: { value: string } }) => void;
  onChangeTime: (event: { target: { value: string } }) => void;
  onChangeTimeDefinition: (timeDefinition: string) => void;
}) {
  return (
    <div style={{ display: "flex" }}>
      <TextField
        label={"Duration"}
        type={"number"}
        value={props.selectedObject.time?.toString()}
        id={"vsmObjectTime"}
        onChange={props.onChangeTime}
      />
      <div style={{ padding: 8 }} />
      <SingleSelect
        items={getTimeDefinitionValues()}
        handleSelectedItemChange={(i) => {
          const apiValue = getTimeDefinitionValue(i.selectedItem);
          props.onChangeTimeDefinition(apiValue);
        }}
        initialSelectedItem={getTimeDefinitionDisplayName(
          props.selectedObject.timeDefinition
        )}
        label="Unit"
      />
    </div>
  );
}

/**
 * Process specific content stuff
 * @param props
 * @constructor
 */
export function SideBarContent(props: {
  selectedObject: vsmObject;
  onChangeName: (event: { target: { value: string } }) => void;
  onChangeRole: (event: { target: { value: string } }) => void;
  onChangeTime: (event: { target: { value: string } }) => void;
  onChangeTimeDefinition: (timeDefinition: string) => void;
}) {
  switch (props.selectedObject.vsmObjectType.pkObjectType) {
    case vsmObjectTypes.process:
      return (
        <>
          <div style={{ paddingTop: 8 }}>
            <TextField
              label={"Add title"}
              multiline
              rows={4}
              variant={"default"}
              value={props.selectedObject.name || ""}
              onChange={props.onChangeName}
              id={"vsmObjectDescription"}
            />
          </div>
        </>
      );
    case vsmObjectTypes.supplier:
      return (
        <>
          <div style={{ paddingTop: 8 }}>
            <TextField
              label={"Add supplier(s)"}
              multiline
              rows={4}
              variant={"default"}
              value={props.selectedObject.name || ""}
              onChange={props.onChangeName}
              id={"vsmObjectDescription"}
            />
          </div>
        </>
      );

    case vsmObjectTypes.input:
      return (
        <>
          <div style={{ paddingTop: 8 }}>
            <TextField
              label={"Add input(s)"}
              multiline
              rows={4}
              variant={"default"}
              value={props.selectedObject.name || ""}
              onChange={props.onChangeName}
              id={"vsmObjectDescription"}
            />
          </div>
        </>
      );

    case vsmObjectTypes.output:
      return (
        <>
          <div style={{ paddingTop: 8 }}>
            <TextField
              label={"Add output(s)"}
              multiline
              rows={4}
              variant={"default"}
              value={props.selectedObject.name || ""}
              onChange={props.onChangeName}
              id={"vsmObjectDescription"}
            />
          </div>
        </>
      );
    case vsmObjectTypes.customer:
      return (
        <>
          <div style={{ paddingTop: 8 }}>
            <TextField
              label={"Add customer(s)"}
              multiline
              rows={4}
              variant={"default"}
              value={props.selectedObject.name || ""}
              onChange={props.onChangeName}
              id={"vsmObjectDescription"}
            />
          </div>
        </>
      );
    case vsmObjectTypes.mainActivity:
      return (
        <>
          <div style={{ paddingTop: 8 }}>
            <TextField
              label={"Add description"}
              multiline
              rows={4}
              variant={"default"}
              value={props.selectedObject.name || ""}
              onChange={props.onChangeName}
              id={"vsmObjectDescription"}
            />
          </div>
        </>
      );
    case vsmObjectTypes.subActivity:
      return (
        <>
          <div style={{ paddingTop: 8 }}>
            <TextField
              label={"Add description"}
              multiline
              rows={4}
              variant={"default"}
              value={props.selectedObject.name || ""}
              onChange={props.onChangeName}
              id={"vsmObjectDescription"}
            />
          </div>
          <div style={{ paddingTop: 12 }}>
            <TextField
              label={"Role(s)"}
              variant={"default"}
              value={props.selectedObject.role?.toString()}
              id={"vsmObjectRole"}
              onChange={props.onChangeRole}
            />
            <div style={{ padding: 8 }} />
            <DurationComponent {...props} />
          </div>
          <div className={styles.sideBarSectionHeader}>
            <p>Add problem, idea or question</p>
          </div>
          <SingleSelect
            disabled
            items={[
              "Problem",
              "Idea",
              "Question",
              "Existing Problem",
              "Existing Idea",
              "Existing Question",
            ]}
            handleSelectedItemChange={() => {
              console.log("Not yet implemented: changed selected item ");
            }}
            label="Select type"
          />
        </>
      );
    case vsmObjectTypes.waiting:
      return <DurationComponent {...props} />;
    case vsmObjectTypes.choice:
      return (
        <>
          <div style={{ paddingTop: 8 }}>
            <TextField
              label={"Define choice"}
              multiline
              rows={4}
              variant={"default"}
              value={props.selectedObject.name}
              onChange={props.onChangeName}
              id={"vsmObjectDescription"}
            />
          </div>
        </>
      );
    default:
      return <p>Invalid process type</p>;
  }
}
