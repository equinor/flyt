import { getColor } from "../utils/getColor";
import styles from "./DraggableCategory.module.scss";
import { ColorDot } from "./ColorDot";
import React, { useRef, useState } from "react";
import { Button, Icon, Menu } from "@equinor/eds-core-react";
import { more_vertical } from "@equinor/eds-icons";

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
        onClick={props.onClick}
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
        <ColorDot color={color} />
        <p>{props.text}</p>
        <Button
          variant={"ghost_icon"}
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(true);
          }}
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
        <Menu.Item>Rename</Menu.Item>
        <Menu.Item>Delete</Menu.Item>
      </Menu>
    </>
  );
}
