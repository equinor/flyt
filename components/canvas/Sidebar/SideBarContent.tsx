import { Fragment, useState } from "react";
import { SideBarHeader } from "./SideBarHeader";
import { NewTaskSection } from "../../NewTaskSection";
import { SideBarBody } from "./SideBarBody";
import { useMutation, useQueryClient } from "react-query";
import { NodeDataCommon } from "@/types/NodeData";
import { patchGraph } from "services/graphApi";
import { debounce } from "@/utils/debounce";
import styles from "../../VSMCanvas.module.scss";
import { Button, Icon, Typography } from "@equinor/eds-core-react";
import { unknownErrorToString } from "utils/isError";
import { useStoreDispatch } from "hooks/storeHooks";
import { close as closeIcon } from "@equinor/eds-icons";
import { notifyOthers } from "@/services/notifyOthers";
import { useAccount, useMsal } from "@azure/msal-react";
import { useProjectId } from "@/hooks/useProjectId";

/**
 * Process specific content stuff
 * @param props
 * @constructor
 */
export function SideBarContent(props: {
  onClose: () => void;
  onDelete: () => void;
  userCanEdit: boolean;
  selectedNode: NodeDataCommon;
  isLoading: boolean;
}) {
  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});

  const { projectId } = useProjectId();
  const dispatch = useStoreDispatch();
  const queryClient = useQueryClient();
  const vsmObjectMutation = useMutation(
    (patchedObject: NodeDataCommon) =>
      patchGraph(patchedObject, projectId, patchedObject.id),
    {
      onSuccess() {
        void notifyOthers("Updated a card", projectId, account);
        return queryClient.invalidateQueries();
      },
      onError: (e: Error | null) =>
        dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );

  function patchNode(
    selectedNode: NodeDataCommon,
    updates: {
      description?: string;
      role?: string;
      duration?: number | null;
      unit?: string | null;
    }
  ) {
    debounce(
      () => {
        vsmObjectMutation.mutate({
          ...{ ...selectedNode, ...updates },
          id: selectedNode.id,
        });
      },
      1500,
      `update ${Object.keys(updates)[0]} - ${selectedNode.id}`
    );
  }

  const selectedNode = props.selectedNode;
  const [showNewTaskSection, setShowNewTaskSection] = useState(false);

  if (props.isLoading) {
    return (
      <div className={styles.headerContainer}>
        <div className={styles.sideBarLoadingText}>
          <Typography variant={"h1"}>Loading...</Typography>
        </div>
        <div className={styles.actions}>
          <Button
            title={"Close the side-menu"}
            variant={"ghost_icon"}
            color={"primary"}
            onClick={props.onClose}
          >
            <Icon data={closeIcon} title="add" size={24} />
          </Button>
        </div>
      </div>
    );
  }
  if (vsmObjectMutation.error) {
    return (
      <div className={styles.sideBarLoadingText}>
        <div className={styles.headerContainer}>
          <Typography variant={"h1"}>Oups! We have an error.</Typography>
          <div className={styles.actions}>
            <Button
              title={"Close the side-menu"}
              variant={"ghost_icon"}
              color={"primary"}
              onClick={props.onClose}
            >
              <Icon data={closeIcon} title="add" size={24} />
            </Button>
          </div>
        </div>
        <p>{unknownErrorToString(vsmObjectMutation.error)}</p>
      </div>
    );
  }

  if (showNewTaskSection)
    return (
      <NewTaskSection
        onClose={() => setShowNewTaskSection(false)}
        selectedNode={selectedNode}
      />
    );

  return (
    <Fragment key={selectedNode?.id}>
      <SideBarHeader
        object={selectedNode}
        onClose={props.onClose}
        onDelete={props.onDelete}
        canEdit={props.userCanEdit}
      />
      <SideBarBody
        selectedNode={selectedNode}
        userCanEdit={props.userCanEdit}
      />
    </Fragment>
  );
}
