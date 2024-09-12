import { Menu } from "@equinor/eds-core-react";
import { ReactElement, useState } from "react";
import styles from "./MenuItemExpandable.module.scss";

type MenuItemExandableProps = {
  text: string;
  children: ReactElement | ReactElement[];
};

export const MenuItemExandable = ({
  text,
  children,
}: MenuItemExandableProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const expandArrow = (
    <svg
      width="5"
      height="10"
      viewBox="0 0 5 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 10L5 5L0 0V10Z" fill="#3D3D3D" />
    </svg>
  );

  return (
    <Menu.Item
      ref={setAnchorEl}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {text} {expandArrow}
      <Menu
        open={isExpanded}
        anchorEl={anchorEl}
        placement="right-start"
        className={styles.menu}
      >
        {children}
      </Menu>
    </Menu.Item>
  );
};
