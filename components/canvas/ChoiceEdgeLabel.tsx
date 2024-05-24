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
  const [showButton, setShowButton] = useState(selected);
  const [canEdit, setCanEdit] = useState(false);
  const updateLabel = () => {
    setEdges((edges) =>
      edges.map((edge) => (edge.id === id ? { ...edge, label: value } : edge))
    );
    setValue(value);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Button
        variant={"outlined"}
        style={{
          display: showButton && selected ? "in-line-block" : "none",
          position: "absolute",
          bottom: 20,
          width: 120,
          height: 32,
          padding: 0,
          paddingLeft: 12,
          paddingRight: 12,
          border: "none",
          boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.14)",
        }}
        onClick={() => {
          setCanEdit(true);
          inputRef.current?.focus();
        }}
      >
        <Icon color={colors.EQUINOR_PROMINENT} data={edit} />
        <Typography
          style={{ fontSize: 12, color: colors.EQUINOR_PROMINENT }}
          group={"navigation"}
          variant={"button"}
        >
          Edit line text
        </Typography>
      </Button>
      <input
        disabled={!canEdit}
        id={id}
        ref={inputRef}
        style={{
          display: "inline-block",
          background: colors.CANVAS,
          border: "none",
          borderRadius: 4,
          width: Math.max(value?.length ?? 0, 1) + "ch",
          height: "auto",
          maxWidth: 96,
        }}
        value={value}
        onChange={(e: { target: { value: string } }) =>
          setValue(e.target.value)
        }
        onBlur={updateLabel}
        onFocus={() => setShowButton(false)}
      />
    </>
  );
}
