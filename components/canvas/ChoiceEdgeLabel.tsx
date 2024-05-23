import { useReactFlow } from "reactflow";
import { useState } from "react";

type EdgeLabelProps = {
  id: string;
  labelText?: string;
};
export function EdgeLabel({ id, labelText }: EdgeLabelProps) {
  const { setEdges } = useReactFlow();
  const [value, setValue] = useState(labelText);

  const updateLabel = () => {
    setEdges((edges) =>
      edges.map((edge) => (edge.id === id ? { ...edge, label: value } : edge))
    );
  };

  return (
    <input
      id={id}
      style={{
        display: "inline-block",
        background: "transparent",
        border: "none",
        width: Math.max(value?.length ?? 0, 2) + "ch",
        height: "auto",
        maxWidth: 96,
      }}
      value={value}
      onChange={(e: { target: { value: string } }) => setValue(e.target.value)}
      onBlur={updateLabel}
    />
  );
}
