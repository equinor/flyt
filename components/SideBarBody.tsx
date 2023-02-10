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
  onChangeName: (value?: string) => void;
  onChangeRole: (event: { target: { value: string } }) => void;
  onChangeTime: (e: { time: number; unit: string }) => void;
  setShowNewTaskSection: (boolean) => void;
  canEdit: boolean;
}): JSX.Element {
  const { selectedObject, setShowNewTaskSection } = props;

  switch (selectedObject?.type) {
    case "Process":
      return (
        <MarkdownEditor
          canEdit={props.canEdit}
          defaultText={selectedObject.name || ""}
          label={"Title"}
          onChange={props.onChangeName}
        />
      );
    case "Supplier":
      return (
        <>
          <MarkdownEditor
            canEdit={props.canEdit}
            defaultText={selectedObject.name || ""}
            label={"Supplier(s)"}
            onChange={props.onChangeName}
          />
          <QIPSection
            canEdit={props.canEdit}
            object={selectedObject}
            onClickNewTask={() => setShowNewTaskSection(true)}
          />
        </>
      );
    case "Input":
      return (
        <>
          <MarkdownEditor
            canEdit={props.canEdit}
            defaultText={selectedObject.name || ""}
            label={"Input(s)"}
            onChange={props.onChangeName}
          />
          <QIPSection
            canEdit={props.canEdit}
            object={selectedObject}
            onClickNewTask={() => setShowNewTaskSection(true)}
          />
        </>
      );
    case "Output":
      return (
        <>
          <MarkdownEditor
            canEdit={props.canEdit}
            defaultText={selectedObject.name || ""}
            label={"Output(s)"}
            onChange={props.onChangeName}
          />
          <QIPSection
            canEdit={props.canEdit}
            object={selectedObject}
            onClickNewTask={() => setShowNewTaskSection(true)}
          />
        </>
      );
    case "Customer":
      return (
        <>
          <MarkdownEditor
            canEdit={props.canEdit}
            defaultText={selectedObject.name || ""}
            label={"Customer(s)"}
            onChange={props.onChangeName}
          />
          <QIPSection
            canEdit={props.canEdit}
            object={selectedObject}
            onClickNewTask={() => setShowNewTaskSection(true)}
          />
        </>
      );
    case "MainActivity":
      return (
        <>
          <MarkdownEditor
            canEdit={props.canEdit}
            defaultText={selectedObject.name || ""}
            label={"Description"}
            onChange={props.onChangeName}
          />
          <QIPSection
            canEdit={props.canEdit}
            object={selectedObject}
            onClickNewTask={() => setShowNewTaskSection(true)}
          />
        </>
      );
    case "SubActivity":
      return (
        <>
          <MarkdownEditor
            canEdit={props.canEdit}
            defaultText={selectedObject.name || ""}
            label={"Description"}
            onChange={props.onChangeName}
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
    case "Waiting":
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
    case "Choice":
      return (
        <MarkdownEditor
          canEdit={props.canEdit}
          defaultText={selectedObject.name || ""}
          label={"Define choice"}
          onChange={props.onChangeName}
        />
      );
    default:
      console.log(selectedObject);
      return <p>Invalid process type</p>;
  }
}
