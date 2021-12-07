import React from "react";
import { Layouts } from "../layouts/LayoutWrapper";

function Box(props: { x: number; y: number; id: string }) {
  return (
    <div
      style={{
        borderRadius: 4,
        position: "absolute",
        left: props.x,
        top: props.y,
        width: 100,
        height: 100,
        border: "solid 3px",
        backgroundColor: "red",
        fontWeight: "bold",
        color: "black",
        textAlign: "center",
      }}
    >
      <p>{props.id}</p>
      <p>
        [{props.x.toString()},{props.y.toString()}]
      </p>
    </div>
  );
}

export default function boxesPage() {
  return (
    <div>
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 300,
          backgroundColor: "blue",
        }}
      />
      {/*Top*/}
      <Box x={350} y={0} id={"a"} />

      {/**/}
      <Box x={150} y={100} id={`b`} />
      <Box x={550} y={100} id={`c`} />

      {/*Middle*/}
      <Box x={50} y={200} id={`d`} />
      <Box x={250} y={200} id={`e`} />
      <Box x={450} y={200} id={`f`} />
      <Box x={650} y={200} id={`g`} />

      {/*LeafNodes*/}
      <Box x={0} y={300} id={`h`} />
      <Box x={100} y={300} id={`i`} />
      <Box x={200} y={300} id={`j`} />
      <Box x={300} y={300} id={`k`} />
      <Box x={400} y={300} id={`l`} />
      <Box x={500} y={300} id={`m`} />
      <Box x={600} y={300} id={`n`} />
      <Box x={700} y={300} id={`o`} />

      {/*Bottom*/}
      <Box x={350} y={400} id={`p`} />
    </div>
  );
}
boxesPage.layout = Layouts.Empty;
