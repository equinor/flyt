import { DurationComponent } from "./DurationComponent";
import { QIPSection } from "./QIPSection";
import React from "react";
import { TextField } from "@equinor/eds-core-react";
import dynamic from "next/dynamic";
import { vsmObject } from "../interfaces/VsmObject";
import { vsmObjectTypes } from "../types/vsmObjectTypes";
const MarkdownEditor = dynamic(() => import("components/MarkdownEditor"), {
  ssr: false,
});

export function SideBarBody(props: {
  selectedObject: vsmObject;
  onChangeName: (event: { target: { value: string } }) => void;
  onChangeRole: (event: { target: { value: string } }) => void;
  onChangeTime: (e: { time: number; unit: string }) => void;
  setShowNewTaskSection: (boolean) => void;
  canEdit: boolean;
}): JSX.Element {
  const { selectedObject, setShowNewTaskSection } = props;
  const labelDescription = props.canEdit ? "Add description" : "Description";

  switch (selectedObject?.vsmObjectType?.pkObjectType) {
    case vsmObjectTypes.process:
      return (
        <TextField
          disabled={!props.canEdit}
          label={"Add title"}
          multiline
          rows={4}
          variant={"default"}
          defaultValue={selectedObject.name || ""}
          onChange={props.onChangeName}
          id={"vsmObjectDescription"}
        />
      );
    case vsmObjectTypes.supplier:
      return (
        <>
          <TextField
            disabled={!props.canEdit}
            label={"Add supplier(s)"}
            multiline
            rows={4}
            variant={"default"}
            defaultValue={selectedObject.name || ""}
            onChange={props.onChangeName}
            id={"vsmObjectDescription"}
          />
          <QIPSection
            canEdit={props.canEdit}
            object={selectedObject}
            onClickNewTask={() => setShowNewTaskSection(true)}
          />
        </>
      );
    case vsmObjectTypes.input:
      return (
        <>
          <TextField
            disabled={!props.canEdit}
            label={"Add input(s)"}
            multiline
            rows={4}
            variant={"default"}
            defaultValue={selectedObject.name || ""}
            onChange={props.onChangeName}
            id={"vsmObjectDescription"}
          />
          <QIPSection
            canEdit={props.canEdit}
            object={selectedObject}
            onClickNewTask={() => setShowNewTaskSection(true)}
          />
        </>
      );
    case vsmObjectTypes.output:
      return (
        <>
          <TextField
            disabled={!props.canEdit}
            label={"Add output(s)"}
            multiline
            rows={4}
            variant={"default"}
            defaultValue={selectedObject.name || ""}
            onChange={props.onChangeName}
            id={"vsmObjectDescription"}
          />
          <QIPSection
            canEdit={props.canEdit}
            object={selectedObject}
            onClickNewTask={() => setShowNewTaskSection(true)}
          />
        </>
      );
    case vsmObjectTypes.customer:
      return (
        <>
          <TextField
            disabled={!props.canEdit}
            label={"Add customer(s)"}
            multiline
            rows={4}
            variant={"default"}
            defaultValue={selectedObject.name || ""}
            onChange={props.onChangeName}
            id={"vsmObjectDescription"}
          />
          <QIPSection
            canEdit={props.canEdit}
            object={selectedObject}
            onClickNewTask={() => setShowNewTaskSection(true)}
          />
        </>
      );
    case vsmObjectTypes.mainActivity:
      return (
        <>
          <MarkdownEditor
            id={"vsmObjectDescription"}
            label={labelDescription}
            //onChange={props.onChangeName}
            canEdit={props.canEdit}
            value={selectedObject.name || ""}
          />
          <TextField
            disabled={!props.canEdit}
            label={"Add description"}
            multiline
            rows={4}
            variant={"default"}
            defaultValue={selectedObject.name || ""}
            onChange={props.onChangeName}
            id={"vsmObjectDescription"}
          />
          <QIPSection
            canEdit={props.canEdit}
            object={selectedObject}
            onClickNewTask={() => setShowNewTaskSection(true)}
          />
        </>
      );
    case vsmObjectTypes.subActivity:
      return (
        <>
          <TextField
            disabled={!props.canEdit}
            label={labelDescription}
            multiline
            rows={4}
            variant={"default"}
            defaultValue={selectedObject.name || ""}
            onChange={props.onChangeName}
            id={"vsmObjectDescription"}
          />
          <div style={{ paddingTop: 12 }}>
            <TextField
              disabled={!props.canEdit}
              label={"Role(s)"}
              variant={"default"}
              defaultValue={selectedObject.role?.toString()}
              id={"vsmObjectRole"}
              onChange={props.onChangeRole}
            />
            <div style={{ padding: 8 }} />
            <DurationComponent
              disabled={!props.canEdit}
              onChangeTime={props.onChangeTime}
              selectedObject={selectedObject}
            />
          </div>
          <QIPSection
            canEdit={props.canEdit}
            object={selectedObject}
            onClickNewTask={() => setShowNewTaskSection(true)}
          />
        </>
      );
    case vsmObjectTypes.waiting:
      return (
        <>
          <DurationComponent
            disabled={!props.canEdit}
            {...props}
            selectedObject={selectedObject}
          />
          <QIPSection
            canEdit={props.canEdit}
            object={selectedObject}
            onClickNewTask={() => setShowNewTaskSection(true)}
          />
        </>
      );
    case vsmObjectTypes.choice:
      return (
        <TextField
          disabled={!props.canEdit}
          label={"Define choice"}
          multiline
          rows={4}
          variant={"default"}
          defaultValue={selectedObject.name}
          onChange={props.onChangeName}
          id={"vsmObjectDescription"}
        />
      );
    default:
      return <p>Invalid process type</p>;
  }
}
