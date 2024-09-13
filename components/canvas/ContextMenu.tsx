import { NodeData } from "@/types/NodeData";
import { capitalizeFirstLetter } from "@/utils/stringHelpers";
import { Menu } from "@equinor/eds-core-react";
import { useCallback, useState } from "react";
import { Node } from "reactflow";
import { MenuItemExandable } from "../MenuItemExandable";
import styles from "./ContextMenu.module.scss";
import type { MenuData } from "./hooks/useContextMenu";
import { getOptionsAddNode } from "./utils/getOptionsAddNode";

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

  const renderOptionsAddNode = (node: Node<NodeData>) => {
    const optionsAddNode = getOptionsAddNode(node);
    const entries = Object.entries(optionsAddNode);
    if (entries.length > 0) {
      return (
        <MenuItemExandable text="Add">
          {entries.map(([position, nodeTypes]) => (
            <MenuItemExandable
              text={capitalizeFirstLetter(position)}
              key={position}
            >
              {nodeTypes.map((nodeType) => (
                <Menu.Item key={nodeType}>{nodeType}</Menu.Item>
              ))}
            </MenuItemExandable>
          ))}
        </MenuItemExandable>
      );
    }
  };

  const renderNodeMenuItems = useCallback(() => {
    if (node) {
      return (
        <>
          <Menu.Item onClick={() => copyToClipBoard?.(node)}>
            <div>Copy</div>
            <div>{modifierKey}C</div>
          </Menu.Item>
          <Menu.Item onClick={paste}>
            <div>Paste</div>
            <div>{modifierKey}V</div>
          </Menu.Item>
          <Menu.Item onClick={() => onEditNode?.(node)}>Edit</Menu.Item>
          {renderOptionsAddNode(node)}
          <Menu.Item onClick={() => onDelete?.(node)}>
            <div>Delete</div>
            <div>⌫</div>
          </Menu.Item>
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
