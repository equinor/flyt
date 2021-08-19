import { getColor } from "../utils/getColor";
import styles from "./DraggableCategory.module.scss";
import { ColorDot } from "./ColorDot";
import React, { useRef, useState } from "react";
import { Button, Icon, Menu } from "@equinor/eds-core-react";
import { delete_to_trash, edit, more_vertical } from "@equinor/eds-icons";
import colors from "../theme/colors";

export function DraggableCategory(props: {
  text: string;
  onClick: () => void;
  checked: boolean;
}): JSX.Element {
  const color = getColor(props.text);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef();
  return (
    <>
      <div
        style={{ border: props.checked && `${color} 2px solid` }}
        draggable={true}
        onDragStart={(ev) => {
          ev.dataTransfer.setData(
            "text/plain",
            JSON.stringify({
              text: props.text,
              color: color,
            })
          );
        }}
        className={styles.category}
      >
        <span onClick={props.onClick} className={styles.categoryClickWrapper}>
          <ColorDot color={color} />
          <p className={styles.categoryText}>{props.text}</p>
        </span>
        <Button
          variant={"ghost_icon"}
          onClick={() => setMenuOpen(true)}
          ref={menuButtonRef}
        >
          <Icon data={more_vertical} />
        </Button>
        {/*  Todo: figure out what the close icon should do...*/}
      </div>
      <Menu
        open={menuOpen}
        anchorEl={menuButtonRef.current}
        aria-labelledby="anchor-default"
        id="menu-default"
        onClose={() => setMenuOpen(false)}
        placement="bottom-end"
      >
        <Menu.Item>
          <Icon data={edit} />
          Rename
        </Menu.Item>
        <Menu.Item style={{ color: colors.ERROR }}>
          <Icon data={delete_to_trash} />
          Delete
        </Menu.Item>
      </Menu>
    </>
  );
}
