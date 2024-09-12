import { NodeData } from "@/types/NodeData";
import { Menu } from "@equinor/eds-core-react";
import { useCallback, useState } from "react";
import { Node } from "reactflow";
import { MenuItemExandable } from "../MenuItemExandable";
import styles from "./ContextMenu.module.scss";
import type { MenuData } from "./hooks/useContextMenu";

type ContextMenuProps = {
  menuData: MenuData;
  centerCanvas: () => void;
  copyToClipBoard?: (target: Node<NodeData>) => Promise<void>;
  paste?: () => void;
  onDelete?: (node: Node<NodeData>) => void;
  onEditNode?: (node: Node<NodeData>) => void;
};

export const ContextMenu = ({
  menuData: { position, node },
  centerCanvas,
  copyToClipBoard,
  paste,
  onDelete,
  onEditNode,
}: ContextMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const modifierKey = window.navigator.platform === "MacIntel" ? "⌘" : "Ctrl";

  const renderNodeMenuItems = useCallback(() => {
    if (node) {
      return (
        <>
          <Menu.Item onClick={() => copyToClipBoard?.(node)}>
            Copy {modifierKey}C
          </Menu.Item>
          <Menu.Item onClick={paste}>Paste {modifierKey}V</Menu.Item>
          <Menu.Item onClick={() => onEditNode?.(node)}>Edit</Menu.Item>
          <MenuItemExandable text="Add">
            <Menu.Item>Sub Activity</Menu.Item>
            <Menu.Item>Choice</Menu.Item>
            <Menu.Item>Waiting</Menu.Item>
          </MenuItemExandable>
          <Menu.Item onClick={() => onDelete?.(node)}>Delete ⌫</Menu.Item>
        </>
      );
    }
  }, [node, copyToClipBoard, modifierKey, paste, onDelete, onEditNode]);

  return (
    <div ref={setAnchorEl} className={styles.menu} style={{ ...position }}>
      <Menu
        key={position?.top}
        open
        anchorEl={anchorEl}
        placement="bottom-start"
        className={styles.menu}
      >
        {renderNodeMenuItems()}
        <Menu.Item onClick={centerCanvas}>Fit View</Menu.Item>
      </Menu>
    </div>
  );
};
