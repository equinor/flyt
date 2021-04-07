import { vsmObject } from "../interfaces/VsmObject";
import { vsmObjectTypes } from "../types/vsmObjectTypes";
import { TextField } from "@equinor/eds-core-react";
import { QIPSection } from "./QIPSection";
import { DurationComponent } from "./DurationComponent";
import React from "react";

export function SideBarBody(props: {
  selectedObject: vsmObject;
  onChangeName: (event: { target: { value: string } }) => void;
  onChangeRole: (event: { target: { value: string } }) => void;
  onChangeTime: (event: { target: { value: string } }) => void;
  onChangeTimeDefinition: (timeDefinition: string) => void;
  setShowNewTaskSection: (boolean) => void;
}): JSX.Element {
  const { selectedObject, setShowNewTaskSection } = props;

  switch (selectedObject.vsmObjectType.pkObjectType) {
    case vsmObjectTypes.process:
      return (
        <TextField
          label={"Add title"}
          multiline
          rows={4}
          variant={"default"}
          value={selectedObject.name || ""}
          onChange={props.onChangeName}
          id={"vsmObjectDescription"}
        />
      );
    case vsmObjectTypes.supplier:
      return (
        <>
          <TextField
            label={"Add supplier(s)"}
            multiline
            rows={4}
            variant={"default"}
            value={selectedObject.name || ""}
            onChange={props.onChangeName}
            id={"vsmObjectDescription"}
          />
          <QIPSection
            object={selectedObject}
            onClickNewTask={() => setShowNewTaskSection(true)}
          />
        </>
      );
    case vsmObjectTypes.input:
      return (
        <>
          <TextField
            label={"Add input(s)"}
            multiline
            rows={4}
            variant={"default"}
            value={selectedObject.name || ""}
            onChange={props.onChangeName}
            id={"vsmObjectDescription"}
          />
          <QIPSection
            object={selectedObject}
            onClickNewTask={() => setShowNewTaskSection(true)}
          />
        </>
      );
    case vsmObjectTypes.output:
      return (
        <>
          <TextField
            label={"Add output(s)"}
            multiline
            rows={4}
            variant={"default"}
            value={selectedObject.name || ""}
            onChange={props.onChangeName}
            id={"vsmObjectDescription"}
          />
          <QIPSection
            object={selectedObject}
            onClickNewTask={() => setShowNewTaskSection(true)}
          />
        </>
      );
    case vsmObjectTypes.customer:
      return (
        <>
          <TextField
            label={"Add customer(s)"}
            multiline
            rows={4}
            variant={"default"}
            value={selectedObject.name || ""}
            onChange={props.onChangeName}
            id={"vsmObjectDescription"}
          />
          <QIPSection
            object={selectedObject}
            onClickNewTask={() => setShowNewTaskSection(true)}
          />
        </>
      );
    case vsmObjectTypes.mainActivity:
      return (
        <TextField
          label={"Add description"}
          multiline
          rows={4}
          variant={"default"}
          value={selectedObject.name || ""}
          onChange={props.onChangeName}
          id={"vsmObjectDescription"}
        />
      );
    case vsmObjectTypes.subActivity:
      return (
        <>
          <TextField
            label={"Add description"}
            multiline
            rows={4}
            variant={"default"}
            value={selectedObject.name || ""}
            onChange={props.onChangeName}
            id={"vsmObjectDescription"}
          />
          <div style={{ paddingTop: 12 }}>
            <TextField
              label={"Role(s)"}
              variant={"default"}
              value={selectedObject.role?.toString()}
              id={"vsmObjectRole"}
              onChange={props.onChangeRole}
            />
            <div style={{ padding: 8 }} />
            <DurationComponent
              onChangeTime={props.onChangeTime}
              onChangeTimeDefinition={props.onChangeTimeDefinition}
              selectedObject={selectedObject}
            />
          </div>
          <QIPSection
            object={selectedObject}
            onClickNewTask={() => setShowNewTaskSection(true)}
          />
        </>
      );
    case vsmObjectTypes.waiting:
      return (
        <>
          <DurationComponent {...props} selectedObject={selectedObject} />
          <QIPSection
            object={selectedObject}
            onClickNewTask={() => setShowNewTaskSection(true)}
          />
        </>
      );
    case vsmObjectTypes.choice:
      return (
        <TextField
          label={"Define choice"}
          multiline
          rows={4}
          variant={"default"}
          value={selectedObject.name}
          onChange={props.onChangeName}
          id={"vsmObjectDescription"}
        />
      );
    default:
      return <p>Invalid process type</p>;
  }
}
