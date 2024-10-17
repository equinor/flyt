import { NodeDataCommon } from "@/types/NodeData";
import { Node } from "reactflow";
import { RefObject, useCallback, useEffect, useState, MouseEvent } from "react";

type Position = {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
};

export type MenuData = {
  position: Position;
  node?: Node<NodeDataCommon>;
};

export const useContextMenu = (ref: RefObject<HTMLDivElement>) => {
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  let pane: DOMRect | undefined = undefined;

  const getPosition = (event: MouseEvent): Position => ({
    top:
      pane && event.clientY < pane.height ? event.clientY - pane.y : undefined,
    left: pane && event.clientX < pane.width ? event.clientX : undefined,
    right:
      pane && event.clientX >= pane.width
        ? pane.width - event.clientX
        : undefined,
    bottom:
      pane && event.clientY >= pane.height
        ? pane.height - event.clientY
        : undefined,
  });

  const onNodeContextMenu = useCallback(
    (event: MouseEvent, node: Node<NodeDataCommon>) => {
      event.preventDefault();
      if (pane) {
        setMenuData({
          position: getPosition(event),
          node: node,
        });
      }
    },
    [setMenuData]
  );

  const onPaneContextMenu = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      if (pane) {
        setMenuData({
          position: getPosition(event),
        });
      }
    },
    [setMenuData]
  );

  const closeContextMenu = () => setMenuData(null);

  useEffect(() => {
    document.body.addEventListener("click", () => {
      closeContextMenu();
    });
  }, []);

  useEffect(() => {
    pane = ref?.current?.getBoundingClientRect();
  }, [ref]);

  return {
    menuData,
    onNodeContextMenu,
    onPaneContextMenu,
    closeContextMenu,
  };
};
