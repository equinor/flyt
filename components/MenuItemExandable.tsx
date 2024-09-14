import { Menu } from "@equinor/eds-core-react";
import { ReactElement, useState } from "react";
import ExpandArrow from "../public/expand_arrow_right.svg";
import styles from "./MenuItemExpandable.module.scss";

type MenuItemExandableProps = {
  text: string;
  reverseExpandDir?: boolean;
  children: ReactElement | ReactElement[];
};

export const MenuItemExandable = ({
  text,
  reverseExpandDir,
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
        style={{
          marginLeft: reverseExpandDir ? "4px" : "-4px",
        }}
        open={isExpanded}
        anchorEl={anchorEl}
        placement={reverseExpandDir ? "left-start" : "right-start"}
        className={styles.menu}
      >
        {children}
      </Menu>
    </Menu.Item>
  );
};
