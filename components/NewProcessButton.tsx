import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { createProject } from "../services/projectApi";
import styles from "./NewProjectButton.module.scss";
import { Icon } from "@equinor/eds-core-react";
import { add } from "@equinor/eds-icons";

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
    <button
      className={styles.createCard}
      onClick={() => newProcessMutation.mutate()}
      disabled={newProcessMutation.isLoading}
    >
      {newProcessMutation.isLoading ? (
        <p>Creating new process...</p>
      ) : (
        <>
          <Icon data={add} title="add" />
          <p>Create new</p>
        </>
      )}
    </button>
  );
}
