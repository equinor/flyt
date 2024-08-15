import { DurationComponent } from "./DurationComponent";
import { QIPSection } from "./QIPSection";
import { TextField } from "@equinor/eds-core-react";
import dynamic from "next/dynamic";
import { NodeData } from "../types/NodeData";
import { NodeTypes } from "types/NodeTypes";
import { formatMinMaxTotalDuration } from "@/utils/unitDefinitions";

const MarkdownEditor = dynamic(() => import("components/MarkdownEditor"), {
  ssr: false,
});

export function SideBarBody(props: {
  selectedNode: NodeData;
  onChangeDescription: (value?: string) => void;
  onChangeRole: (event: { target: { value: string } }) => void;
  onChangeDuration: (e: {
    duration: number | null;
    unit: string | null;
  }) => void;
  setShowNewTaskSection: (arg0: boolean) => void;
  canEdit: boolean;
}) {
  const { selectedNode, setShowNewTaskSection } = props;

  switch (selectedNode?.type) {
    case NodeTypes.root:
      return (
        <MarkdownEditor
          canEdit={props.canEdit}
          defaultText={selectedNode.description || ""}
          label={"Title"}
          onChange={props.onChangeDescription}
        />
      );
    case NodeTypes.supplier:
      return (
        <>
          <MarkdownEditor
            canEdit={props.canEdit}
            defaultText={selectedNode.description || ""}
            label={"Supplier(s)"}
            onChange={props.onChangeDescription}
          />
          <QIPSection
            canEdit={props.canEdit}
            object={selectedNode}
            onClickNewTask={() => setShowNewTaskSection(true)}
          />
        </>
      );
    case NodeTypes.input:
      return (
        <>
          <MarkdownEditor
            canEdit={props.canEdit}
            defaultText={selectedNode.description || ""}
            label={"Input(s)"}
            onChange={props.onChangeDescription}
          />
          <QIPSection
            canEdit={props.canEdit}
            object={selectedNode}
            onClickNewTask={() => setShowNewTaskSection(true)}
          />
        </>
      );
    case NodeTypes.output:
      return (
        <>
          <MarkdownEditor
            canEdit={props.canEdit}
            defaultText={selectedNode.description || ""}
            label={"Output(s)"}
            onChange={props.onChangeDescription}
          />
          <QIPSection
            canEdit={props.canEdit}
            object={selectedNode}
            onClickNewTask={() => setShowNewTaskSection(true)}
          />
        </>
      );
    case NodeTypes.customer:
      return (
        <>
          <MarkdownEditor
            canEdit={props.canEdit}
            defaultText={selectedNode.description || ""}
            label={"Customer(s)"}
            onChange={props.onChangeDescription}
          />
          <QIPSection
            canEdit={props.canEdit}
            object={selectedNode}
            onClickNewTask={() => setShowNewTaskSection(true)}
          />
        </>
      );
    case NodeTypes.mainActivity:
      return (
        <>
          <MarkdownEditor
            canEdit={props.canEdit}
            defaultText={selectedNode.description || ""}
            label={"Description"}
            onChange={props.onChangeDescription}
          />
          <div style={{ paddingTop: 12 }} />
          <TextField
            disabled
            label={"Duration"}
            type={"string"}
            id={"vsmObjectTime"}
            value={formatMinMaxTotalDuration(selectedNode?.totalDurations)}
            helperText={"Duration is automatically calculated"}
          />
          <QIPSection
            canEdit={props.canEdit}
            object={selectedNode}
            onClickNewTask={() => setShowNewTaskSection(true)}
          />
        </>
      );
    case NodeTypes.subActivity:
      return (
        <>
          <MarkdownEditor
            canEdit={props.canEdit}
            defaultText={selectedNode.description || ""}
            label={"Description"}
            onChange={props.onChangeDescription}
          />
          <div style={{ paddingTop: 12 }}>
            <TextField
              disabled={!props.canEdit}
              label={"Role(s)"}
              defaultValue={selectedNode.role?.toString()}
              id={"vsmObjectRole"}
              onChange={props.onChangeRole}
            />
            <div style={{ padding: 8 }} />
            <DurationComponent
              disabled={!props.canEdit}
              onChangeDuration={props.onChangeDuration}
              selectedNode={selectedNode}
            />
          </div>
          <QIPSection
            canEdit={props.canEdit}
            object={selectedNode}
            onClickNewTask={() => setShowNewTaskSection(true)}
          />
        </>
      );
    case NodeTypes.waiting:
      return (
        <>
          <MarkdownEditor
            canEdit={props.canEdit}
            defaultText={selectedNode.description || ""}
            label={"Description"}
            onChange={props.onChangeDescription}
          />
          <div style={{ paddingTop: 12 }}>
            <DurationComponent
              disabled={!props.canEdit}
              {...props}
              selectedNode={selectedNode}
            />
          </div>
          <QIPSection
            canEdit={props.canEdit}
            object={selectedNode}
            onClickNewTask={() => setShowNewTaskSection(true)}
          />
        </>
      );
    case NodeTypes.choice:
      return (
        <MarkdownEditor
          canEdit={props.canEdit}
          defaultText={selectedNode.description || ""}
          label={"Define choice"}
          onChange={props.onChangeDescription}
        />
      );
    default:
      return <p>Invalid process type</p>;
  }
}
