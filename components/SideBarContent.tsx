import React, { useState } from "react";
import { taskObject } from "../interfaces/taskObject";
import { useStoreState } from "../hooks/storeHooks";
import { SideBarHeader } from "./SideBarHeader";
import { NewTaskSection } from "./NewTaskSection";
import { SideBarBody } from "./SideBarBody";

/**
 * Process specific content stuff
 * @param props
 * @constructor
 */
export function SideBarContent(props: {
  onChangeName: (event: { target: { value: string } }) => void;
  onChangeRole: (event: { target: { value: string } }) => void;
  onChangeTime: (event: { target: { value: string } }) => void;
  onChangeTimeDefinition: (timeDefinition: string) => void;
  onAddTask: (task: taskObject) => void;
  onClose: () => void;
  onDelete: () => void;
}): JSX.Element {
  const selectedObject = useStoreState((state) => state.selectedObject);
  const [showNewTaskSection, setShowNewTaskSection] = useState(false);

  if (showNewTaskSection)
    return <NewTaskSection onClose={() => setShowNewTaskSection(false)} />;

  return (
    <React.Fragment key={selectedObject.vsmObjectID}>
      <SideBarHeader
        object={selectedObject}
        onClose={props.onClose}
        onDelete={props.onDelete}
      />
      <SideBarBody
        selectedObject={selectedObject}
        onChangeRole={props.onChangeRole}
        onChangeName={props.onChangeName}
        onChangeTimeDefinition={props.onChangeTimeDefinition}
        onChangeTime={props.onChangeTime}
        setShowNewTaskSection={setShowNewTaskSection}
      />
    </React.Fragment>
  );
}
