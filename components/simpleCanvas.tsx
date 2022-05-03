import { Sprite, Stage } from "@inlet/react-pixi";
import React, { useMemo } from "react";
import useWindowSize from "../hooks/useWindowSize";
import { mockProcessGraph } from "../utils/createGraph";
import { useQuery } from "react-query";
import { getProject } from "../services/projectApi";
import { useRouter } from "next/router";
import { Graph } from "../utils/layoutEngine";

export default function SimpleCanvas() {
  const { width, height } = useWindowSize();
  const router = useRouter();
  const { id } = router.query;
  const { data: process } = useQuery(["project", id], () => getProject(id));
  const graph = useMemo(() => {
    if (process) return new Graph(process);
    return mockProcessGraph();
  }, [process]);

  return (
    <Stage
      width={width}
      height={height - 64}
      options={{ backgroundColor: 0xffffff }}
      style={{ bottom: 0, position: "absolute" }}
    >
      {graph?.nodes.map((node) => (
        <Sprite
          pointerdown={() => console.log("clicked")}
          key={node.id}
          image={"/ErrorPostit.png"}
          x={node.position?.x || 0}
          y={node.position?.y || 0}
          // anchor={0.5}
          // scale={0.5}
        />
      ))}
    </Stage>
  );
}
