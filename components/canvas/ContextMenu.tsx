import { NodeData } from "@/types/NodeData";
import { getNodeTypeName } from "@/utils/getNodeTypeName";
import { capitalizeFirstLetter } from "@/utils/stringHelpers";
import { Menu } from "@equinor/eds-core-react";
import { RefObject, useState } from "react";
import { Node, Position } from "reactflow";
import { MenuItemExandable } from "../MenuItemExandable";
import styles from "./ContextMenu.module.scss";
import type { MenuData } from "./hooks/useContextMenu";
import { useNodeAdd } from "./hooks/useNodeAdd";
import { getOptionsAddNode } from "./utils/getOptionsAddNode";

type ContextMenuProps = {
  menuData: MenuData;
  centerCanvas: () => void;
  copyToClipBoard?: (target: Node<NodeData>) => Promise<void>;
  paste?: () => void;
  onDelete?: (node: Node<NodeData>) => void;
  onEditNode?: (node: Node<NodeData>) => void;
  canvasRef?: RefObject<HTMLDivElement>;
};

export const ContextMenu = ({
  menuData: { position, node },
  centerCanvas,
  copyToClipBoard,
  paste,
  onDelete,
  onEditNode,
  canvasRef,
}: ContextMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const { addNode, isNodeButtonDisabled } = useNodeAdd();

  const isReversedExpandDirection = (fullyExpandedWidth: number) => {
    const anchorOffsetLeft = anchorEl?.offsetLeft;
    const canvasEdgeRight = canvasRef?.current?.getBoundingClientRect().right;
    return !!(
      canvasEdgeRight &&
      anchorOffsetLeft &&
      canvasEdgeRight - anchorOffsetLeft < fullyExpandedWidth
    );
  };

  const modifierKey = navigator.userAgent.includes("Mac") ? "⌘" : "Ctrl";

  const renderOptionsAddNode = (node: Node<NodeData>) => {
    const optionsAddNode = getOptionsAddNode(node);
    if (optionsAddNode.length === 0) return;
    const fullyExpandedWidth = 400;
    const reversedExpandDir = isReversedExpandDirection(fullyExpandedWidth);
    return (
      <MenuItemExandable text="Add" reverseExpandDir={reversedExpandDir}>
        {optionsAddNode.map(([position, nodeTypes]) => (
          <MenuItemExandable
            text={capitalizeFirstLetter(position)}
            reverseExpandDir={reversedExpandDir}
            key={position}
          >
            {nodeTypes.map((nodeType) => (
              <Menu.Item
                disabled={isNodeButtonDisabled(node.id, position as Position)}
                key={nodeType}
                onClick={() =>
                  addNode(node.id, { type: nodeType }, position as Position)
                }
              >
                {getNodeTypeName(nodeType)}
              </Menu.Item>
            ))}
          </MenuItemExandable>
        ))}
      </MenuItemExandable>
    );
  };

  const renderNodeMenuItems = () => {
    if (!node) return;
    return (
      <>
        <Menu.Item onClick={() => copyToClipBoard?.(node)}>
          <div>Copy</div>
          <div>{modifierKey}+C</div>
        </Menu.Item>
        <Menu.Item onClick={paste}>
          <div>Paste</div>
          <div>{modifierKey}+V</div>
        </Menu.Item>
        <Menu.Item onClick={() => onEditNode?.(node)}>Edit</Menu.Item>
        {renderOptionsAddNode(node)}
        <Menu.Item onClick={() => onDelete?.(node)}>
          <div>Delete</div>
          <div>⌫</div>
        </Menu.Item>
      </>
    );
  };

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
