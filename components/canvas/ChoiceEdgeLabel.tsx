import { useReactFlow } from "reactflow";
import { Ref, useEffect, useRef, useState } from "react";
import colors from "../../theme/colors";
import { Button, Icon, Typography } from "@equinor/eds-core-react";
import { edit } from "@equinor/eds-icons";

type EdgeLabelProps = {
  id: string;
  labelText?: string;
  selected: boolean;
};
export function EdgeLabel({ id, labelText, selected }: EdgeLabelProps) {
  const { setEdges } = useReactFlow();
  const [value, setValue] = useState(labelText);
  const [showInput, setShowInput] = useState(!!value);
  const updateLabel = () => {
    setEdges((edges) =>
      edges.map((edge) => (edge.id === id ? { ...edge, label: value } : edge))
    );
    setValue(value);
    inputRef.current?.blur();
  };

  const inputRef = useRef<HTMLInputElement>(null);
  if (!value && !selected) return <></>;
  if (value && selected) {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }
  if (!selected)
    setTimeout(() => {
      inputRef.current?.blur();
    }, 50);
  return (
    <>
      {!value && selected && !showInput ? (
        <Button
          variant={"ghost_icon"}
          style={{
            backgroundColor: colors.CANVAS,
            boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.14)",
          }}
          onClick={() => {
            setShowInput(true);
            setTimeout(() => {
              inputRef.current?.focus();
            }, 50);
          }}
        >
          <Icon data={edit} />
        </Button>
      ) : (
        <input
          id={id}
          ref={inputRef}
          style={{
            display: value || showInput ? "inline-block" : "none",
            background: colors.CANVAS,
            border: "none",
            borderRadius: 4,
            width: Math.max(value?.length ?? 0, 1) + "ch",
            height: "auto",
            maxWidth: 96,
            textAlign: "center",
          }}
          value={value}
          onChange={(e: { target: { value: string } }) =>
            setValue(e.target.value)
          }
          onBlur={updateLabel}
        />
      )}
    </>
  );
}
