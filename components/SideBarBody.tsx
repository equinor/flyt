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

  switch (selectedObject?.vsmObjectType?.pkObjectType) {
    case vsmObjectTypes.process:
      return (
        <MarkdownEditor
          canEdit={props.canEdit}
          defaultText={selectedObject.name || ""}
          label={"Title"}
          onChange={props.onChangeName}
        />
      );
    case vsmObjectTypes.supplier:
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
    case vsmObjectTypes.input:
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
    case vsmObjectTypes.output:
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
    case vsmObjectTypes.customer:
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
    case vsmObjectTypes.mainActivity:
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
    case vsmObjectTypes.subActivity:
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
        <MarkdownEditor
          canEdit={props.canEdit}
          defaultText={selectedObject.name || ""}
          label={"Define choice"}
          onChange={props.onChangeName}
        />
      );
    default:
      return <p>Invalid process type</p>;
  }
}
