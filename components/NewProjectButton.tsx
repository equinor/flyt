import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { createProject } from "../services/projectApi";
import styles from "../pages/projects/Projects.module.scss";
import { Icon } from "@equinor/eds-core-react";
import { add } from "@equinor/eds-icons";
import React from "react";

export function NewProjectButton(): JSX.Element {
  const router = useRouter();

  const newProjectMutation = useMutation(() =>
    createProject().then((value) =>
      router.push(`/projects/${value.data.vsmProjectID}`)
    )
  );

  return (
    <div
      className={styles.createCard}
      onClick={() => newProjectMutation.mutate()}
    >
      <Icon data={add} title="add" />
      <p>Create new</p>
    </div>
  );
}
