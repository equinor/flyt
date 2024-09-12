import { Menu } from "@equinor/eds-core-react";
import { ReactElement, useState } from "react";
import ExpandArrow from "../public/expand_arrow_right.svg";
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

  return (
    <Menu.Item
      ref={setAnchorEl}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div>{text}</div>
      <img
        alt="right-arrow"
        src={ExpandArrow.src}
        className={styles.expandArrowContainer}
      />
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
