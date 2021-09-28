import React, { useState } from "react";
import { Menu, Button, Typography, Icon } from "@equinor/eds-core-react";
import { chevron_down } from "@equinor/eds-icons";
import { useRouter } from "next/router";

export default function SortMenu(): JSX.Element {
  const router = useRouter();
  const path = router.pathname;
  const { orderBy } = router.query;

  const buttonLabelDictionary = {
    name: "Alphabetically",
    created: "Last created",
    modified: "Last modified",
  };

  const [state, setState] = useState<{
    buttonEl: HTMLButtonElement;
  }>({ buttonEl: null });

  const { buttonEl } = state;
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

  const handleClick = (newOrderBy: string) =>
    router.replace({ pathname: path, query: { orderBy: newOrderBy } });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      <Typography variant="h6">
        {buttonLabelDictionary[orderBy.toString()]}
      </Typography>
      <Button
        variant="ghost_icon"
        id="menuButton"
        aria-controls="menu-on-button"
        aria-haspopup="true"
        aria-expanded={!!buttonEl}
        onClick={(e) => (isOpen ? closeMenu() : openMenu(e))}
        onKeyDown={onKeyPress}
      >
        <Icon data={chevron_down} />
      </Button>
      <Menu
        id="menu-on-button"
        aria-labelledby="menuButton"
        open={Boolean(buttonEl)}
        anchorEl={buttonEl}
        onClose={closeMenu}
        placement="bottom-end"
      >
        <Menu.Item
          onKeyPress={(e) => {
            if (e.key == "Enter") handleClick("modified");
          }}
          onClick={() => handleClick("modified")}
        >
          Last modified
        </Menu.Item>
        <Menu.Item
          onKeyPress={(e) => {
            if (e.key == "Enter") handleClick("created");
          }}
          onClick={() => handleClick("created")}
        >
          Last created
        </Menu.Item>
        <Menu.Item
          onKeyPress={(e) => {
            if (e.key == "Enter") handleClick("name");
          }}
          onClick={() => handleClick("name")}
        >
          Alphabetically
        </Menu.Item>
      </Menu>
    </div>
  );
}
