import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { getProject } from "../services/projectApi";
import React, { useEffect, useMemo } from "react";
import { mockProcessGraph } from "../utils/createGraph";
import { vsmObjectTypes } from "../types/vsmObjectTypes";
import { Card } from "./card";
import { Reorder } from "framer-motion";
import { parseProcessJSON } from "../utils/processParser/parseProcessJSON";
import { ToggleButtonGroup } from "./ToggleButtonGroup";
import { ToggleButton } from "./ToggleButton";
import { getPathsFromNodeToLeafNode } from "../utils/positionNodes";
import { GraphEdge, GraphNode } from "../utils/layoutEngine";
import { ErrorMessage } from "./errorMessage";
import { Loading } from "./loading";
import { DndContext } from "@dnd-kit/core";

// TODO: move to utils
export function getCardColor(type: vsmObjectTypes) {
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

function MainActivity(props: {
  node: GraphNode;
  onClick: (node: GraphNode) => void;
  graph: { nodes: GraphNode[]; edges: GraphEdge[] };
  flexDirection: "row" | "column";
}) {
  //todo: find all children of this node
  const paths = getPathsFromNodeToLeafNode(props.node, props.graph);
  const firstPath = paths[0].filter((_n, i) => i !== 0); //remove first node
  const [items, setItems] = React.useState(firstPath);
  // return <Card node={props.node} onClick={props.onClick} />;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: props.flexDirection === "row" ? "column" : "row", // note: flip direction because this is children of a card
      }}
    >
      <div style={{ alignSelf: "center" }}>
        <Card node={props.node} onClick={props.onClick} />
      </div>
      <Reorder.Group
        axis={props.flexDirection === "column" ? "x" : "y"}
        values={items}
        onReorder={setItems}
        style={{
          listStyle: "none",

          border: "1px solid rgba(0,0,0,0.05)",
          borderRadius: "5px",
          margin: 12,

          padding: 0,

          display: "flex",
          flexDirection: props.flexDirection === "row" ? "column" : "row", // note: flip direction because this is children of a card
        }}
      >
        {items.map((node: GraphNode) => (
          <Card key={node.id} node={node} onClick={props.onClick} />
        ))}
      </Reorder.Group>
    </div>
  );
}

export default function CanvasImposter(props: { onClickCard }) {
  const router = useRouter();
  const { id } = router.query;
  const {
    data: process,
    error,
    isLoading,
  } = useQuery(["project", id], () => getProject(id));

  const graph = useMemo(() => {
    if (process) return parseProcessJSON(process);
    return mockProcessGraph();
  }, [process]);

  const [items, setItems] = React.useState([]);

  useEffect(() => {
    if (graph.nodes) {
      setItems(
        graph.nodes.filter((n) => n.type === vsmObjectTypes.mainActivity)
      );
    }
  }, [graph]);

  const [flexDirection, setFlexDirection] = React.useState<"row" | "column">(
    "row"
  );

  ////////////////////////////////////////////////////////////////////////////////
  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage error={error} />;
  if (!graph?.nodes) return <ErrorMessage error={"No graph found."} />;

  return (
    <>
      {/*<div style={{ height: 64 }}></div>*/}
      <ToggleButtonGroup style={{ position: "sticky", top: 64, zIndex: 100 }}>
        <ToggleButton
          selected={flexDirection === "column"}
          onClick={() => {
            setFlexDirection("column");
          }}
          name={"Vertical"}
        />
        <ToggleButton
          selected={flexDirection === "row"}
          onClick={() => {
            setFlexDirection("row");
          }}
          name={"Horizontal"}
        />
      </ToggleButtonGroup>
      <Reorder.Group
        axis={flexDirection === "column" ? "y" : "x"}
        values={items}
        onReorder={setItems}
        style={{
          // move down 64 px to avoid the header
          transform: "translateY(64px)",
          //remove list decoration
          listStyle: "none",
          // Horizontal list
          display: flexDirection === "row" ? "flex" : "block",
        }}
      >
        <Card
          node={graph.nodes.find((n) => n.type === vsmObjectTypes.supplier)}
          onClick={props.onClickCard}
        />
        <Card
          node={graph.nodes.find((n) => n.type === vsmObjectTypes.input)}
          onClick={props.onClickCard}
        />
        {items.map((item) => (
          <MainActivity
            key={item.id}
            onClick={props.onClickCard}
            node={item}
            graph={graph}
            flexDirection={flexDirection}
          />
        ))}
        <Card
          node={graph.nodes.find((n) => n.type === vsmObjectTypes.input)}
          onClick={props.onClickCard}
        />
        <Card
          node={graph.nodes.find((n) => n.type === vsmObjectTypes.input)}
          onClick={props.onClickCard}
        />
      </Reorder.Group>
    </>
  );
  // pre-calculated positions version
  // return (
  //   <div
  //     style={{
  //       position: "absolute",
  //       top: 64,
  //       overflow: "scroll",
  //       width: "100%",
  //       height: "calc(100% - 64px)",
  //     }}
  //     onClick={() => props.onClickCard(null)}
  //   >
  //     {graph?.nodes.map((node) => (
  //       <Card
  //         key={node.id}
  //         node={node}
  //         onClick={(event) => {
  //           props.onClickCard(node.id);
  //           event.stopPropagation();
  //           event.preventDefault();
  //         }}
  //       />
  //     ))}
  //   </div>
  // );
}
