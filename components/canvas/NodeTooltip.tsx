import { NodeDataCommon } from "@/types/NodeData";
import React, {
  ReactNode,
  RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { NodeToolbar, NodeToolbarProps, Position } from "reactflow";
import { EditableNodeTooltipSection } from "./EditableNodeTooltipSection";
import styles from "./NodeTooltip.module.scss";
import { useUSerEditNode } from "./hooks/useUserEditNode";
import { CardAccess } from "@/types/CardAccess";
import { useMutation, useQueryClient } from "react-query";
import {
  removeAccessOfaCardOnInactivity,
  removeUserCardAccess,
  updateUserCardAccess,
} from "@/services/userApi";
import { useStoreDispatch } from "@/hooks/storeHooks";
import { unknownErrorToString } from "@/utils/isError";
import { useProjectId } from "@/hooks/useProjectId";
import { notifyOthers } from "@/services/notifyOthers";
import { useAccount, useMsal } from "@azure/msal-react";
import { useRouter } from "next/router";

type NodeTooltipContainerProps = {
  children: ReactNode;
  isVisible?: boolean;
  style?: NodeToolbarProps["style"];
  isEditing?: boolean;
  nodeRef?: RefObject<HTMLDivElement>;
};

export const NodeTooltipContainer = ({
  children,
  isVisible,
  style,
  isEditing,
  nodeRef,
}: NodeTooltipContainerProps) => {
  const toolTipRef = useRef<HTMLDivElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState<Position | undefined>(
    undefined
  );
  const [offset, setoffset] = useState(10);
  const calculateTooltipPosition = (toolTipHeight: number) => {
    const appHeaderSpace = 70;
    if (!toolTipRef?.current) return;
    const viewPortBottom = toolTipRef.current.getBoundingClientRect().bottom;
    const nodeHeight = nodeRef?.current?.getBoundingClientRect().height;
    const availableSpace = viewPortBottom - (nodeHeight ?? 0) - appHeaderSpace;
    if (toolTipHeight > availableSpace) {
      setTooltipPosition(Position.Bottom);
      setoffset(30);
    } else {
      setTooltipPosition(Position.Top);
      setoffset(10);
    }
  };

  useLayoutEffect(() => {
    const tooltipNode = document.querySelector(".react-flow__node-toolbar");
    if (!tooltipNode) return;
    const calculatePositionIfNeeded = () => {
      const hasChildren =
        (tooltipNode.querySelector("div")?.childElementCount ?? 0) > 0;
      const toolTipHeight = tooltipNode.getBoundingClientRect().height;
      if (hasChildren && toolTipHeight) {
        calculateTooltipPosition(toolTipHeight);
        return true;
      }
      return false;
    };
    // Check initially if tooltipNode DOM has updated data to calculate position
    if (calculatePositionIfNeeded()) return;
    const observer = new MutationObserver(() => {
      if (calculatePositionIfNeeded()) observer.disconnect(); //disconnect observer when position is calculated
    });

    observer.observe(tooltipNode, {
      attributes: true,
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [isVisible, toolTipRef, isEditing]);

  return (
    <div ref={toolTipRef}>
      <NodeToolbar
        position={tooltipPosition}
        isVisible={isVisible}
        className={styles.container}
        onMouseDownCapture={(e) => {
          e.stopPropagation();
          if (
            e.target instanceof HTMLElement &&
            e.target.getAttribute("role") === "listbox"
          ) {
            e.preventDefault();
          }
        }}
        style={style}
        offset={offset}
      >
        {children}
      </NodeToolbar>
    </div>
  );
};

type Field<IncludeKey extends string, Key extends string> =
  | ({
      [k in IncludeKey]?: false;
    } & {
      [k in Key]?: undefined;
    })
  | ({
      [k in IncludeKey]: true;
    } & {
      [k in Key]: string | undefined;
    });

type NodeTooltipProps = {
  nodeData: NodeDataCommon;
  isHovering?: boolean;
  isEditing?: boolean;
  nodeRef: RefObject<HTMLDivElement>;
  userEditCardStatus: CardAccess[] | undefined;
} & Field<"includeDescription", "description"> &
  Field<"includeDuration", "duration"> &
  Field<"includeEstimate", "estimate"> &
  Field<"includeRole", "role">;

export const NodeTooltip = ({
  includeDescription,
  includeDuration,
  includeEstimate,
  includeRole,
  description,
  role,
  duration,
  estimate,
  isHovering,
  isEditing,
  nodeData,
  nodeRef,
  userEditCardStatus,
}: NodeTooltipProps) => {
  const { handleTooltipOnAccessRemove } = nodeData;
  const editingStyle = { minWidth: "300px" };
  const tooltipStyle = isEditing ? editingStyle : undefined;
  const shouldDisplayDescription =
    includeDescription && (isEditing || description);
  const shouldDisplayRole = includeRole && (isEditing || role);
  const shouldDisplayDuration = includeDuration && (isEditing || duration);
  const shouldDisplayEstimate = includeEstimate && estimate;
  const { isCardEditablebyUser, shortName, isCardHasNoAccess, selectedCard } =
    useUSerEditNode(nodeData.id, userEditCardStatus);
  const dispatch = useStoreDispatch();
  const queryClient = useQueryClient();
  const { projectId } = useProjectId();
  const router = useRouter();

  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});

  const updateUserAccessDetails = useMutation(
    (card: Omit<CardAccess, "id">) => updateUserCardAccess(card),
    {
      onSuccess: () => {
        void notifyOthers("is modifying a card", projectId, account);
        void queryClient.invalidateQueries();
      },
      onError: (e: Error | null) =>
        dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );

  const removeUserCardAccessDetails = useMutation(
    (id: number) => removeUserCardAccess(id),
    {
      onSuccess: () => {
        void notifyOthers("stopped modifiying a card", projectId, account);
        void queryClient.invalidateQueries();
      },
      onError: (e: Error | null) =>
        dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );

  const removeAccessOfaCardOnInactive = useMutation(
    (id: number) => removeAccessOfaCardOnInactivity(id),
    {
      onSuccess: () => {
        void queryClient.invalidateQueries();
      },
      onError: (e: Error | null) =>
        dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );

  useEffect(() => {
    selectedCard && removeAccessOfaCardOnInactive.mutate(selectedCard.id);
  }, [selectedCard]);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if ((url.startsWith("/processes") || url === "/") && selectedCard) {
        removeUserCardAccessDetails.mutate(selectedCard.id);
      }
    };
    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router]);

  useEffect(() => {
    if (isEditing && isCardHasNoAccess) {
      updateUserAccessDetails.mutate({
        userId: shortName,
        cardId: nodeData.id,
        projectId: Number(projectId),
        isEditable: true,
      });
    } else if (!isEditing && isCardEditablebyUser && selectedCard) {
      removeUserCardAccessDetails.mutate(selectedCard.id);
    }
  }, [isEditing, userEditCardStatus]);

  const renderInput = () => {
    return (
      <>
        {shouldDisplayDescription && (
          <EditableNodeTooltipSection
            nodeData={nodeData}
            header={"Description"}
            text={description}
            variant="description"
            isEditing={isEditing}
            isCardEditablebyUser={isCardEditablebyUser}
            selectedCardId={selectedCard?.id}
          />
        )}
        {shouldDisplayRole && (
          <EditableNodeTooltipSection
            nodeData={nodeData}
            header={"Role(s)"}
            text={role}
            variant="role"
            isEditing={isEditing}
            isCardEditablebyUser={isCardEditablebyUser}
            selectedCardId={selectedCard?.id}
          />
        )}
        {shouldDisplayDuration && (
          <EditableNodeTooltipSection
            header={"Duration"}
            variant="duration"
            nodeData={nodeData}
            text={duration}
            isEditing={isEditing}
            isCardEditablebyUser={isCardEditablebyUser}
            selectedCardId={selectedCard?.id}
          />
        )}
        {shouldDisplayEstimate && (
          <EditableNodeTooltipSection
            header={"Duration"}
            text={estimate}
            variant="duration"
            nodeData={nodeData}
            isCardEditablebyUser={isCardEditablebyUser}
            selectedCardId={selectedCard?.id}
          />
        )}
      </>
    );
  };

  return (
    <NodeTooltipContainer
      isVisible={isHovering || isEditing}
      style={tooltipStyle}
      isEditing={isEditing}
      nodeRef={nodeRef}
    >
      {isEditing && !isCardEditablebyUser ? (
        <EditableNodeTooltipSection
          text={`${selectedCard?.userId} is editing`}
          nodeData={nodeData}
          isEditing={true}
          isCardEditablebyUser={isCardEditablebyUser}
        />
      ) : (
        renderInput()
      )}
    </NodeTooltipContainer>
  );
};
