import { DurationComponent } from "./DurationComponent";
import { QIPSection } from "./QIPSection";
import { TextField } from "@equinor/eds-core-react";
import dynamic from "next/dynamic";
import { vsmObject } from "../types/VsmObject";
import { vsmObjectTypes } from "types/vsmObjectTypes";
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
    case vsmObjectTypes.root:
      return (
        <MarkdownEditor
          canEdit={props.canEdit}
          defaultText={selectedObject.description || ""}
          label={"Title"}
          onChange={props.onChangeDescription}
        />
      );
    case vsmObjectTypes.supplier:
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
    case vsmObjectTypes.input:
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
    case vsmObjectTypes.output:
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
    case vsmObjectTypes.customer:
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
    case vsmObjectTypes.mainActivity:
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
    case vsmObjectTypes.subActivity:
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
          defaultText={selectedObject.description || ""}
          label={"Define choice"}
          onChange={props.onChangeDescription}
        />
      );
    default:
      return <p>Invalid process type</p>;
  }
}
