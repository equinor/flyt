import { NodeDataCommon } from "@/types/NodeData";
import { NodeProps } from "reactflow";
import { ProjectCard } from "../Card/ProjectCard";
import { SourceHandle } from "./SourceHandle";
import { TargetHandle } from "./TargetHandle";

export const ProjectNode = ({
  data: { linkedProjectData, shapeHeight, shapeWidth },
  selected,
  sourcePosition,
  targetPosition,
}: NodeProps<NodeDataCommon>) => (
  <>
    <div style={{ width: shapeWidth, height: shapeHeight }}>
      {linkedProjectData && (
        <ProjectCard project={linkedProjectData} readOnly selected={selected} />
      )}
    </div>
    <SourceHandle position={sourcePosition} />
    <TargetHandle position={targetPosition} hidden />
  </>
);
