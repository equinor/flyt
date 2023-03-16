import { DurationComponent } from "./DurationComponent";
import { QIPSection } from "./QIPSection";
import React from "react";
import { TextField } from "@equinor/eds-core-react";
import dynamic from "next/dynamic";
import { vsmObject } from "../interfaces/VsmObject";
const MarkdownEditor = dynamic(() => import("components/MarkdownEditor"), {
  ssr: false,
});

export function SideBarBody(props: {
  selectedObject: vsmObject;
  onChangeDescription: (value?: string) => void;
  onChangeRole: (event: { target: { value: string } }) => void;
  onChangeDuration: (e: { duration: number; unit: string }) => void;
  setShowNewTaskSection: (boolean) => void;
  canEdit: boolean;
}): JSX.Element {
  const { selectedObject, setShowNewTaskSection } = props;

  switch (selectedObject?.type) {
    case "Process":
      return (
        <MarkdownEditor
          canEdit={props.canEdit}
          defaultText={selectedObject.description || ""}
          label={"Title"}
          onChange={props.onChangeDescription}
        />
      );
    case "Supplier":
      return (
        <>
          <MarkdownEditor
            canEdit={props.canEdit}
            defaultText={selectedObject.description || ""}
            label={"Supplier(s)"}
            onChange={props.onChangeDescription}
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
            defaultText={selectedObject.description || ""}
            label={"Input(s)"}
            onChange={props.onChangeDescription}
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
            defaultText={selectedObject.description || ""}
            label={"Output(s)"}
            onChange={props.onChangeDescription}
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
            defaultText={selectedObject.description || ""}
            label={"Customer(s)"}
            onChange={props.onChangeDescription}
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
            defaultText={selectedObject.description || ""}
            label={"Description"}
            onChange={props.onChangeDescription}
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
            defaultText={selectedObject.description || ""}
            label={"Description"}
            onChange={props.onChangeDescription}
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
              onChangeDuration={props.onChangeDuration}
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
          defaultText={selectedObject.description || ""}
          label={"Define choice"}
          onChange={props.onChangeDescription}
        />
      );
    default:
      return <p>Invalid process type</p>;
  }
}
