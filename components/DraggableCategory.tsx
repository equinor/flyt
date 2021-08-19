import { getColor } from "../utils/getColor";
import styles from "./DraggableCategory.module.scss";
import { ColorDot } from "./ColorDot";
import React, { useRef, useState } from "react";
import { Button, Icon, Input, Menu, TextField } from "@equinor/eds-core-react";
import {
  check,
  delete_to_trash,
  edit,
  more_vertical,
} from "@equinor/eds-icons";
import colors from "../theme/colors";

export function DraggableCategory(props: {
  text: string;
  onClick: () => void;
  checked: boolean;
}): JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef();
  const [categoryName, setCategoryName] = useState("");
  const [editText, setEditText] = useState(true);

  const color = getColor(categoryName);
  function saveText() {
    //Save the text and exit edit-mode
    if (categoryName.trim() !== "") setEditText(false); // Todo: Maybe show an error message?
  }

  if (editText) {
    return (
      <>
        <div
          style={{ border: props.checked && `${color} 2px solid` }}
          className={styles.category}
        >
          <Input
            autoFocus
            defaultValue={categoryName}
            placeholder={props.text}
            onClick={(event) => event.stopPropagation()}
            onChange={(e) => setCategoryName(e.target.value)}
            onKeyDown={(e) => {
              if (e.code === "Enter") {
                saveText();
              }
            }}
          />
          <Button variant={"ghost_icon"} onClick={saveText} ref={menuButtonRef}>
            <Icon data={check} />
          </Button>
        </div>
      </>
    );
  }
  return (
    <>
      <div
        style={{ border: props.checked && `${color} 2px solid` }}
        draggable={true}
        onDragStart={(ev) => {
          ev.dataTransfer.setData(
            "text/plain",
            JSON.stringify({
              text: categoryName,
              color: color,
            })
          );
        }}
        className={styles.category}
      >
        <span onClick={props.onClick} className={styles.categoryClickWrapper}>
          <ColorDot color={color} />
          <p className={styles.categoryText}>{categoryName}</p>
        </span>
        <Button
          variant={"ghost_icon"}
          onClick={() => setMenuOpen(true)}
          ref={menuButtonRef}
        >
          <Icon data={more_vertical} />
        </Button>
      </div>
      <Menu
        open={menuOpen}
        anchorEl={menuButtonRef.current}
        aria-labelledby="anchor-default"
        id="menu-default"
        onClose={() => setMenuOpen(false)}
        placement="bottom-end"
      >
        <Menu.Item
          onClick={() => {
            setEditText(true);
          }}
        >
          <Icon data={edit} />
          Rename
        </Menu.Item>
        <Menu.Item
          style={{ color: colors.ERROR }}
          onClick={() => alert("Delete category - Not yet implemented")}
        >
          <Icon data={delete_to_trash} />
          Delete
        </Menu.Item>
      </Menu>
    </>
  );
}
