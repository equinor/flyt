import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { createProject } from "../services/projectApi";
import styles from "./NewProjectButton.module.scss";
import { Icon } from "@equinor/eds-core-react";
import { add } from "@equinor/eds-icons";
import React from "react";

export function NewProjectButton(): JSX.Element {
  const router = useRouter();

  const newProjectMutation = useMutation(() =>
    createProject().then((value) =>
      router.push(`/process/${value.data.vsmProjectID}`)
    )
  );

  return (
    <button
      className={styles.createCard}
      onClick={() => newProjectMutation.mutate()}
    >
      <Icon data={add} title="add" />
      <p>Create new</p>
    </button>
  );
}
