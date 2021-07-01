import React, { useEffect, useState } from "react";
import { SideBarHeader } from "./SideBarHeader";
import { NewTaskSection } from "./NewTaskSection";
import { SideBarBody } from "./SideBarBody";
import { useMutation, useQueryClient } from "react-query";
import { vsmObject } from "../interfaces/VsmObject";
import { patchVSMObject } from "../services/vsmObjectApi";
import { debounce } from "../utils/debounce";
import styles from "./VSMCanvas.module.scss";
import { Button, Icon, Typography } from "@equinor/eds-core-react";
import { unknownErrorToString } from "utils/isError";
import { useStoreDispatch } from "hooks/storeHooks";

/**
 * Process specific content stuff
 * @param props
 * @constructor
 */
export function SideBarContent(props: {
  onClose: () => void;
  onDelete: () => void;
  canEdit: boolean;
  selectedObject;
  isLoading: boolean;
}): JSX.Element {
  const dispatch = useStoreDispatch();
  const queryClient = useQueryClient();
  const vsmObjectMutation = useMutation(
    (patchedObject: vsmObject) => patchVSMObject(patchedObject),
    {
      onSuccess() {
        return queryClient.invalidateQueries();
      },
      onError: (e) => dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );

  function patchCard(
    selectedObject: vsmObject,
    updates: {
      name?: string;
      role?: string;
      time?: number;
      timeDefinition?: string;
      //Todo: BUG in API? Patching timeDefinition sets time to 0...
      // Not a bug, but a "feature": Changing unit does a conversion of the current time to the new format.
      // Ref: https://equinor-sds-si.atlassian.net/browse/VSM-160
    }
  ) {
    debounce(
      () => {
        vsmObjectMutation.mutate({
          vsmObjectID: selectedObject.vsmObjectID,
          ...updates,
        });
      },
      1500,
      `update ${Object.keys(updates)[0]} - ${selectedObject.vsmObjectID}`
    );
  }

  const selectedObject = props.selectedObject;
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
            <Icon name="close" title="add" size={24} />
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
              <Icon name="close" title="add" size={24} />
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
        selectedObject={selectedObject}
      />
    );

  return (
    <React.Fragment key={selectedObject?.vsmObjectID}>
      <SideBarHeader
        object={selectedObject}
        onClose={props.onClose}
        onDelete={props.onDelete}
        canEdit={props.canEdit}
      />
      <SideBarBody
        selectedObject={selectedObject}
        onChangeName={(e) =>
          patchCard(selectedObject, { name: e.target.value })
        }
        onChangeRole={(e) =>
          patchCard(selectedObject, { role: e.target.value })
        }
        onChangeTime={(e) =>
          patchCard(selectedObject, { time: parseFloat(e.target.value) })
        }
        onChangeTimeDefinition={(e) =>
          patchCard(selectedObject, { timeDefinition: e })
        }
        setShowNewTaskSection={setShowNewTaskSection}
        canEdit={props.canEdit}
      />
    </React.Fragment>
  );
}
