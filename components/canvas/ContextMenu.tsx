import { NodeDataCommon } from "@/types/NodeData";
import { getNodeTypeName } from "@/utils/getNodeTypeName";
import { capitalizeFirstLetter } from "@/utils/stringHelpers";
import { Menu } from "@equinor/eds-core-react";
import { RefObject, useState } from "react";
import { Node, Position } from "reactflow";
import { MenuItemExandable } from "../MenuItemExandable";
import styles from "./ContextMenu.module.scss";
import type { MenuData } from "./hooks/useContextMenu";
import { useNodeAdd } from "./hooks/useNodeAdd";
import { getNodeValidPositionsContextMenu } from "./utils/nodeValidityHelper";
import { NodeTypes } from "@/types/NodeTypes";
import { getModifierKey } from "@/utils/getModifierKey";

type ContextMenuProps = {
  menuData: MenuData;
  centerCanvas: () => void;
  copyToClipBoard?: (target: Node<NodeDataCommon>) => Promise<void>;
  paste?: () => void;
  onDelete?: (node: Node<NodeDataCommon>) => void;
  onEditNode?: (node: Node<NodeDataCommon>) => void;
  canvasRef?: RefObject<HTMLDivElement>;
  userCanEdit: boolean;
};

export const ContextMenu = ({
  menuData: { position, node },
  centerCanvas,
  copyToClipBoard,
  paste,
  onDelete,
  onEditNode,
  canvasRef,
  userCanEdit,
}: ContextMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const { addNode, isNodeButtonDisabled } = useNodeAdd();
  const modifierKey = getModifierKey();

  const isReversedExpandDirection = (fullyExpandedWidth: number) => {
    const anchorOffsetLeft = anchorEl?.offsetLeft;
    const canvasEdgeRight = canvasRef?.current?.getBoundingClientRect().right;
    return !!(
      canvasEdgeRight &&
      anchorOffsetLeft &&
      canvasEdgeRight - anchorOffsetLeft < fullyExpandedWidth
    );
  };

  const renderOptionsAddNode = (node: Node<NodeDataCommon>) => {
    const nodeValidPositions = Object.entries(
      getNodeValidPositionsContextMenu(node)
    ) as [Position, NodeTypes[]][];
    if (nodeValidPositions.length === 0) return;
    const fullyExpandedWidth = 400;
    const reversedExpandDir = isReversedExpandDirection(fullyExpandedWidth);
    return (
      <MenuItemExandable text="Add" reverseExpandDir={reversedExpandDir}>
        {nodeValidPositions.map(([position, nodeTypes]) => (
          <MenuItemExandable
            text={capitalizeFirstLetter(position)}
            reverseExpandDir={reversedExpandDir}
            key={position}
          >
            {nodeTypes.map((nodeType) => (
              <Menu.Item
                disabled={
                  isNodeButtonDisabled(node.id, position) || !userCanEdit
                }
                key={nodeType}
                onClick={() => addNode(node.id, { type: nodeType }, position)}
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
    const { deletable, copyable } = node.data;
    return (
      <>
        {copyable && (
          <>
            <Menu.Item
              disabled={!userCanEdit}
              onClick={() => copyToClipBoard?.(node)}
            >
              <div>Copy</div>
              <div>{modifierKey}+C</div>
            </Menu.Item>
            <Menu.Item disabled={!userCanEdit} onClick={paste}>
              <div>Paste</div>
              <div>{modifierKey}+V</div>
            </Menu.Item>
          </>
        )}
        {node.type !== NodeTypes.linkedProcess && (
          <Menu.Item onClick={() => onEditNode?.(node)}>Edit</Menu.Item>
        )}
        {renderOptionsAddNode(node)}
        {deletable && (
          <Menu.Item disabled={!userCanEdit} onClick={() => onDelete?.(node)}>
            <div>Delete</div>
          </Menu.Item>
        )}
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
