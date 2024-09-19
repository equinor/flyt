import { useStoreDispatch } from "@/hooks/storeHooks";
import { useState } from "react";
import { Task } from "@/types/Task";
import styles from "./VSMCanvas.module.scss";
import { Button, Icon, Autocomplete } from "@equinor/eds-core-react";
import { TaskTypes } from "@/types/TaskTypes";
import { ExistingTaskSection } from "./ExistingTaskSection";
import { arrow_back } from "@equinor/eds-icons";
import { useMutation, useQueryClient } from "react-query";
import { createTask } from "@/services/taskApi";
import { unknownErrorToString } from "utils/isError";
import { notifyOthers } from "@/services/notifyOthers";
import { useAccount, useMsal } from "@azure/msal-react";
import { useProjectId } from "@/hooks/useProjectId";
import dynamic from "next/dynamic";
import { NodeDataInteractable } from "@/types/NodeData";
import { sortSearch } from "@/utils/sortSearch";

const MarkdownEditor = dynamic(() => import("components/MarkdownEditor"), {
  ssr: false,
});

export const NewTaskSection = (props: {
  onClose: () => void;
  selectedNode: NodeDataInteractable;
}) => {
  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const dispatch = useStoreDispatch();
  const { projectId } = useProjectId();
  const queryClient = useQueryClient();
  const [newTask, setNewTask] = useState<Task | null>(null);
  const [existingTaskFilter, setExistingTaskFilter] =
    useState<TaskTypes | null>(null);
  const [showExistingTaskSection, setShowExistingTaskSection] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const selectedNode = props.selectedNode;
  const options = [
    "Problem",
    "Idea",
    "Question",
    "Risk",
    "Existing Problem",
    "Existing Idea",
    "Existing Question",
    "Existing Risk",
  ];

  const taskMutations = useMutation(
    (task: Task) => createTask(task, selectedNode.projectId, selectedNode.id),
    {
      onSuccess: () => {
        clearAndCloseAddTaskSection();
        void notifyOthers(`Created a new Q/I/P/R`, projectId, account);
        return queryClient.invalidateQueries();
      },
      onError: (e: Error | null) =>
        dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );

  const newTaskIsReady = (task: Task) => {
    return (task.description?.trim().length ?? 0) > 0;
  };

  const clearAndCloseAddTaskSection = () => {
    setNewTask(null);
    setShowExistingTaskSection(false);
    props.onClose();
  };

  const handleSearchInputChange = (searchInput: string) => {
    setSearchInput(searchInput);
    if (!selectedNode) throw new Error("No selected object");
    const t = {
      type: newTask?.type,
      description: newTask?.description ?? "", // Let's not overwrite description if we change the type midways
    } as Task;

    switch (searchInput) {
      case "Problem":
        t.type = TaskTypes.Problem;
        setNewTask(t);
        setShowExistingTaskSection(false);
        break;
      case "Idea":
        t.type = TaskTypes.Idea;
        setNewTask(t);
        setShowExistingTaskSection(false);
        break;
      case "Question":
        t.type = TaskTypes.Question;
        setNewTask(t);
        setShowExistingTaskSection(false);
        break;
      case "Risk":
        t.type = TaskTypes.Risk;
        setNewTask(t);
        setShowExistingTaskSection(false);
        break;
      case "Existing Problem":
        setShowExistingTaskSection(true);
        setExistingTaskFilter(TaskTypes.Problem);
        break;
      case "Existing Idea":
        setShowExistingTaskSection(true);
        setExistingTaskFilter(TaskTypes.Idea);
        break;
      case "Existing Question":
        setShowExistingTaskSection(true);
        setExistingTaskFilter(TaskTypes.Question);
        break;
      case "Existing Risk":
        setShowExistingTaskSection(true);
        setExistingTaskFilter(TaskTypes.Risk);
        break;
    }
  };

  return (
    <div className={styles.newTaskSection}>
      <Button
        title={"Go back"}
        variant={"ghost_icon"}
        color={"primary"}
        onClick={() => {
          clearAndCloseAddTaskSection();
        }}
      >
        <Icon data={arrow_back} title="add" size={24} />
      </Button>
      <div className={styles.sideBarSectionHeader}>
        <p>Add Questions, Ideas, Problems and Risks</p>
      </div>
      <Autocomplete
        autoFocus
        options={sortSearch(options, searchInput)}
        onInputChange={(e) => handleSearchInputChange(e)}
        label="Select type"
        optionsFilter={() => true}
        autoWidth
        dropdownHeight={options.length * 48}
      />
      <ExistingTaskSection
        visible={showExistingTaskSection}
        selectedNode={selectedNode}
        existingTaskFilter={existingTaskFilter}
      />
      {!showExistingTaskSection && newTask && (
        <>
          <div style={{ paddingTop: 8 }}>
            <MarkdownEditor
              label={"Description"}
              defaultText={newTask.description || ""}
              canEdit={true}
              onChange={(event) =>
                setNewTask({ ...newTask, description: event ?? "" })
              }
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              paddingTop: 12,
            }}
          >
            <Button
              style={{ marginRight: 8 }}
              variant={"outlined"}
              onClick={() => clearAndCloseAddTaskSection()}
            >
              Cancel
            </Button>
            <Button
              disabled={!newTaskIsReady(newTask)}
              onClick={() => {
                taskMutations.mutate(newTask);
              }}
            >
              Add
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
