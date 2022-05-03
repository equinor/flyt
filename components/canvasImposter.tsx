import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { getProject } from "../services/projectApi";
import React, { useMemo } from "react";
import { Graph, GraphNode } from "../utils/layoutEngine";
import { mockProcessGraph } from "../utils/createGraph";
import { vsmObjectTypes } from "../types/vsmObjectTypes";

export function getTypeColor(type: vsmObjectTypes) {
  switch (type) {
    case vsmObjectTypes.waiting:
      return "#FF8F00";
    case vsmObjectTypes.mainActivity:
      return "#52C0FF";
    case vsmObjectTypes.subActivity:
    case vsmObjectTypes.choice:
      return "#FDD835";
    case vsmObjectTypes.input:
    case vsmObjectTypes.output:
    case vsmObjectTypes.supplier:
    case vsmObjectTypes.customer:
      return "#40D38F";
    default:
      return "#EB0037";
  }
}

function Card(props: { node: GraphNode; onClick: (event) => void }) {
  switch (props.node.type) {
    case vsmObjectTypes.process:
    case vsmObjectTypes.supplier:
    case vsmObjectTypes.input:
    case vsmObjectTypes.error:
    case vsmObjectTypes.output:
    case vsmObjectTypes.customer:
    case vsmObjectTypes.mainActivity:
    case vsmObjectTypes.subActivity:
    case vsmObjectTypes.text:
      return (
        <button
          title={props.node.name}
          onClick={props.onClick}
          draggable
          style={{
            width: 126,
            height: 136,
            borderRadius: 6,
            border: "none",
            position: "absolute",
            left: props.node.position.x || 0,
            top: props.node.position.y || 0,
            overflow: "hidden",
            backgroundColor: getTypeColor(props.node.type),
            cursor: "pointer",
            //Figma text style
            fontFamily: "Equinor",
            fontStyle: "normal",
            fontWeight: 500,
            fontSize: "12px",
            lineHeight: "16px",
            letterSpacing: "0.2px",
            color: "#3D3D3D",
          }}
        >
          <p>{props.node.name}</p>
        </button>
      );
    case vsmObjectTypes.waiting:
      return (
        <button
          title={props.node.name}
          onClick={props.onClick}
          draggable
          style={{
            width: 126,
            height: 61,
            borderRadius: 6,
            border: "none",
            position: "absolute",
            left: props.node.position.x || 0,
            top: props.node.position.y || 0,
            overflow: "hidden",
            backgroundColor: getTypeColor(props.node.type),
            cursor: "pointer",
            //Figma text style
            fontFamily: "Equinor",
            fontStyle: "normal",
            fontWeight: 500,
            fontSize: "12px",
            lineHeight: "16px",
            letterSpacing: "0.2px",
            color: "#3D3D3D",
          }}
        >
          <p>{props.node.name}</p>
        </button>
      );

    case vsmObjectTypes.choice:
      return (
        <button
          title={props.node.name}
          onClick={props.onClick}
          draggable
          style={{
            width: 126,
            height: 126,
            borderRadius: 6,
            border: "none",
            position: "absolute",
            left: props.node.position.x || 0,
            top: props.node.position.y || 0,
            overflow: "hidden",
            backgroundColor: getTypeColor(props.node.type),
            cursor: "pointer",
            //Figma text style
            fontFamily: "Equinor",
            fontStyle: "normal",
            fontWeight: 500,
            fontSize: "12px",
            lineHeight: "16px",
            letterSpacing: "0.2px",
            color: "#3D3D3D",

            transform: "rotate(45deg)",
          }}
        >
          <p>{props.node.name}</p>
        </button>
      );
  }
}

export default function CanvasImposter(props: { onClickCard }) {
  const router = useRouter();
  const { id } = router.query;
  const { data: process } = useQuery(["project", id], () => getProject(id));

  const graph = useMemo(() => {
    if (process) return new Graph(process);
    return mockProcessGraph();
  }, [process]);

  return (
    <div
      style={{
        position: "absolute",
        top: 64,
        overflow: "scroll",
        width: "100%",
        height: "calc(100% - 64px)",
      }}
      onClick={() => props.onClickCard(null)}
    >
      {graph.nodes.map((node) => (
        <Card
          key={node.id}
          node={node}
          onClick={(event) => {
            props.onClickCard(node.id);
            event.stopPropagation();
            event.preventDefault();
          }}
        />
      ))}
    </div>
  );
}
