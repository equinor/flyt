import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { createProject } from "../services/projectApi";
import styles from "./NewProjectButton.module.scss";
import { Button, Icon } from "@equinor/eds-core-react";
import { add_circle_filled } from "@equinor/eds-icons";

export function NewProcessButton(): JSX.Element {
  const router = useRouter();

  const clearGuideStorage = () => {
    Object.keys(localStorage)
      .filter((key) => key.startsWith("guideStage:"))
      .forEach((key) => localStorage.removeItem(key));
  };

  const newProcessMutation = useMutation(() => {
    clearGuideStorage();

    return createProject().then((value) =>
      router.push(`/process/${value.data}`)
    );
  });

  return (
    <Button
      as="button"
      color="primary"
      variant="outlined"
      className={styles.processButton}
      onClick={() => newProcessMutation.mutate()}
      disabled={newProcessMutation.isLoading}
    >
      {newProcessMutation.isLoading ? (
        <p>Creating new process...</p>
      ) : (
        <>
          <Icon data={add_circle_filled} title="add" />
          <p>Create new</p>
        </>
      )}
    </Button>
  );
}
