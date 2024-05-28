import { useReactFlow } from "reactflow";
import { useRef, useState } from "react";
import { Button, Icon } from "@equinor/eds-core-react";
import { edit } from "@equinor/eds-icons";
import styles from "./ChoiceEdge.module.scss";

type EdgeLabelProps = {
  id: string;
  labelText?: string;
  selected: boolean;
};
export function EdgeLabel({ id, labelText, selected }: EdgeLabelProps) {
  const { setEdges } = useReactFlow();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState(labelText);
  const [showInput, setShowInput] = useState(!!value);
  const valueSize = Math.max(value?.length ?? 0, 1);

  if (!value && !selected) return <></>;
  const updateLabel = () => {
    console.log("updating edge with value:", value);
    setEdges((edges) =>
      edges.map((edge) => (edge.id === id ? { ...edge, label: value } : edge))
    );
  };

  if (!selected)
    setTimeout(() => {
      inputRef.current?.blur();
    }, 50);

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
        rows={Math.ceil(valueSize / 25)}
        id={id}
        ref={inputRef}
        className={styles.textarea}
        style={{
          width: valueSize + "ch",
        }}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            updateLabel();
            setTimeout(() => {
              inputRef.current?.blur();
            }, 500);
          }
        }}
        onBlur={updateLabel}
      />
    </>
  );
  return !value && selected && !showInput ? ButtonComponent : TextAreaComponent;
}
