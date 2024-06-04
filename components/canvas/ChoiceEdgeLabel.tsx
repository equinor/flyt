import { useReactFlow } from "reactflow";
import { useEffect, useRef, useState } from "react";
import { Button, Icon } from "@equinor/eds-core-react";
import { edit } from "@equinor/eds-icons";
import styles from "./ChoiceEdge.module.scss";
import { patchEdge } from "@/services/graphApi";
import { useProjectId } from "@/hooks/useProjectId";

type EdgeLabelProps = {
  id: string;
  labelText?: string;
  selected: boolean;
};
export function EdgeLabel({ id, labelText, selected }: EdgeLabelProps) {
  const { setEdges } = useReactFlow();
  const { projectId } = useProjectId();
  const [value, setValue] = useState(labelText);
  const [showInput, setShowInput] = useState(!!value);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const numberOfRows = Math.ceil(Math.max(value?.length ?? 0, 1) / 12);

  const updateLabel = () => {
    if (labelText !== value) {
      setEdges((edges) =>
        edges.map((edge) => (edge.id === id ? { ...edge, label: value } : edge))
      );
      patchEdge({ EdgeValue: value }, projectId, id);
    }
  };

  useEffect(() => {
    const input = inputRef.current;
    if (!input) {
      if (!value || value.length === 0) setShowInput(false);
      return;
    }

    if (selected) {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    } else {
      input.blur();
    }
  }, [selected, value]);

  const ButtonComponent = (
    <>
      <Button
        variant={"ghost_icon"}
        className={styles.editButton}
        onClick={() => {
          setShowInput(true);
          setTimeout(() => {
            inputRef.current?.focus();
          }, 50);
        }}
      >
        <Icon data={edit} />
      </Button>
    </>
  );

  const TextAreaComponent = (
    <>
      <textarea
        rows={numberOfRows}
        id={id}
        ref={inputRef}
        className={styles.textarea}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
          }
        }}
        onBlur={updateLabel}
      />
    </>
  );

  if (!value && !selected) return <></>;
  return !value && selected && !showInput ? ButtonComponent : TextAreaComponent;
}
