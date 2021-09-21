import React, { useState } from "react";
import { Menu, Button } from "@equinor/eds-core-react";

export default function SortMenu(props: {
  setOrderBy: (any: string) => void;
}): JSX.Element {
  const [buttonLabel, setButtonLabel] = useState("Alphabetically");
  const [state, setState] = useState<{
    buttonEl: HTMLButtonElement;
    focus: "first" | "last";
  }>({ focus: "first", buttonEl: null });

  const { focus, buttonEl } = state;
  const isOpen = Boolean(buttonEl);

  const openMenu = (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLButtonElement>
  ) => {
    const target = e.target as HTMLButtonElement;
    setState({ ...state, buttonEl: target });
  };

  const closeMenu = () => setState({ ...state, buttonEl: null });

  const onKeyPress = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const { key } = e;
    switch (key) {
      case "ArrowDown":
      case "ArrowUp":
        isOpen ? closeMenu() : openMenu(e);
        break;
      case "Escape":
        closeMenu();
        break;
    }
  };

  return (
    <div>
      <Button
        variant="ghost"
        id="menuButton"
        aria-controls="menu-on-button"
        aria-haspopup="true"
        aria-expanded={!!buttonEl}
        onClick={(e) => (isOpen ? closeMenu() : openMenu(e))}
        onKeyDown={onKeyPress}
      >
        {buttonLabel}
      </Button>
      <Menu
        id="menu-on-button"
        aria-labelledby="menuButton"
        focus={focus}
        open={Boolean(buttonEl)}
        anchorEl={buttonEl}
        onClose={closeMenu}
        placement="bottom-end"
      >
        <Menu.Item
          onClick={() => {
            props.setOrderBy("name");
            setButtonLabel("Alphabetically");
          }}
        >
          Alphabetically
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            props.setOrderBy("created");
            setButtonLabel("Last created");
          }}
        >
          Last created
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            props.setOrderBy("modified");
            setButtonLabel("Last modified");
          }}
        >
          Last modified
        </Menu.Item>
      </Menu>
    </div>
  );
}
