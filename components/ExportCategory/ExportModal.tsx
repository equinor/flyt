import React, { useState } from "react";
import styles from "./ExportModal.module.scss";
import {
  Autocomplete,
  Button,
  Icon,
  Typography,
} from "@equinor/eds-core-react";
import { close } from "@equinor/eds-icons";
import { useProjectId } from "@/hooks/useProjectId";
import { useQuery } from "react-query";
import { getTasksForProject } from "@/services/taskApi";
import { usePQIRLinkedCategory } from "@/hooks/usePQIRLinkedCategory";
import { PQIRCheck } from "./PQIRCheck";
import { exportToSpreadsheetFiles } from "@/utils/exportToSpreadsheetFiles";
import { exportPQIRFormat } from "@/types/ExportFormat";
import { unknownErrorToString } from "@/utils/isError";
import { TaskTypes } from "@/types/TaskTypes";
import { getProjectName } from "@/utils/getProjectName";
import { getProject } from "@/services/projectApi";
import { useStoreDispatch } from "@/hooks/storeHooks";

type ExportModal = {
  handleClose: () => void;
  problemChecked: boolean;
  ideaChecked: boolean;
  questionChecked: boolean;
  riskChecked: boolean;
};

function ExportModalTopSection(props: { handleClose: () => void }) {
  return (
    <div className={styles.topSectionBox}>
      <div>
        <p className={styles.title}>Export PQIRs</p>
        <p className={styles.subTitle}>Choose categories to export</p>
      </div>
      <Button variant={"ghost_icon"} onClick={props.handleClose}>
        <Icon data={close} />
      </Button>
    </div>
  );
}

export const ExportModal = (props: ExportModal) => {
  const {
    problemChecked,
    ideaChecked,
    questionChecked,
    riskChecked,
    handleClose,
  } = props;

  const [isProblemSelected, setisProblemSelected] = useState(problemChecked);
  const [isQuestionSelected, setisQuestionSelected] = useState(questionChecked);
  const [isIdeaSelected, setisIdeaSelected] = useState(ideaChecked);
  const [isRiskSelected, setisRiskSelected] = useState(riskChecked);
  const [exportFormatValue, setexportFormatValue] = useState("");

  const { projectId } = useProjectId();
  const { data: project } = useQuery(["project", projectId], () =>
    getProject(projectId)
  );
  const projectTitle = getProjectName(project);
  const dispatch = useStoreDispatch();

  const {
    data: tasks,
    isLoading: isLoadingTasks,
    error: errorTasks,
  } = useQuery(["tasks", projectId], () => getTasksForProject(projectId));

  const {
    categoriesLinkedToProblems,
    categoriesLinkedToQuestion,
    categoriesLinkedToIdea,
    categoriesLinkedToRisk,
  } = usePQIRLinkedCategory(tasks);

  const handleExportFormat = (value: string) => {
    setexportFormatValue(value);
  };

  const getExportDisabled = () => {
    const checkedPQIRsDisable =
      (isProblemSelected && categoriesLinkedToProblems.length) ||
      (isQuestionSelected && categoriesLinkedToQuestion.length) ||
      (isIdeaSelected && categoriesLinkedToIdea.length) ||
      (isRiskSelected && categoriesLinkedToRisk.length);
    return !(checkedPQIRsDisable && exportFormatValue);
  };

  const handleSnackMessage = () => {
    setTimeout(() => {
      dispatch.setSnackMessage("The file has been successfully downloaded.");
      dispatch.setDownloadSnackbar(true);
    }, 1000);
  };

  const handleExportPQIR = () => {
    const checkedPQIRs: string[] = [];
    if (isProblemSelected && categoriesLinkedToProblems?.length)
      checkedPQIRs.push(TaskTypes.Problem);
    if (isQuestionSelected && categoriesLinkedToQuestion?.length)
      checkedPQIRs.push(TaskTypes.Question);
    if (isIdeaSelected && categoriesLinkedToIdea?.length)
      checkedPQIRs.push(TaskTypes.Idea);
    if (isRiskSelected && categoriesLinkedToRisk?.length)
      checkedPQIRs.push(TaskTypes.Risk);
    const filteredPQIRs = tasks?.filter((task) =>
      checkedPQIRs.includes(task.type)
    );
    const modifiedPQIRs = filteredPQIRs?.map((task) => {
      task.activityType = task.activityType ?? "-";
      task.role = task.role ?? "-";
      return task;
    });
    try {
      exportToSpreadsheetFiles(modifiedPQIRs, exportFormatValue, projectTitle);
      handleClose();
      handleSnackMessage();
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  if (isLoadingTasks) return <Typography>Loading...</Typography>;

  if (errorTasks) {
    return <p>{unknownErrorToString(errorTasks)}</p>;
  }

  return (
    <div className={styles.exportBox}>
      <ExportModalTopSection handleClose={props.handleClose} />
      <div className={styles.contentBox}>
        <Typography className={styles.contentTitle}>Choose PQIR</Typography>
        <PQIRCheck
          isChecked={isProblemSelected}
          setIsChecked={setisProblemSelected}
          label="Problems"
          noOfCategories={categoriesLinkedToProblems.length}
        />
        <PQIRCheck
          isChecked={isQuestionSelected}
          setIsChecked={setisQuestionSelected}
          label="Questions"
          noOfCategories={categoriesLinkedToQuestion.length}
        />
        <PQIRCheck
          isChecked={isIdeaSelected}
          setIsChecked={setisIdeaSelected}
          label="Ideas"
          noOfCategories={categoriesLinkedToIdea.length}
        />
        <PQIRCheck
          isChecked={isRiskSelected}
          setIsChecked={setisRiskSelected}
          label="Risks"
          noOfCategories={categoriesLinkedToRisk.length}
        />
        <Typography
          className={`${styles.contentTitle} ${styles.spacingForExportBox}`}
        >
          Export format
        </Typography>
        <Autocomplete
          label=""
          placeholder="Choose Export Format"
          options={exportPQIRFormat}
          optionLabel={(option) => option.type}
          onInputChange={handleExportFormat}
          autoWidth
        />
        <div className={styles.footer}>
          <Button
            variant="ghost"
            className={styles.cancelBtn}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button disabled={getExportDisabled()} onClick={handleExportPQIR}>
            Export
          </Button>
        </div>
      </div>
    </div>
  );
};
