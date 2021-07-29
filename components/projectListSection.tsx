import styles from "../pages/projects/Projects.module.scss";
import { vsmProject } from "../interfaces/VsmProject";
import { VSMCard } from "./Card/Card";
import React from "react";
import { Icon } from "@equinor/eds-core-react";
import { add } from "@equinor/eds-icons";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { createProject } from "../services/projectApi";
import { LoadingVSMCard } from "./Card/LoadingVSMCard";
import { WashOutFilter } from "./WashOutFilter/WashOutFilter";

const nineteenSomethings = Array.from(Array(19).keys());

export function ProjectListSection(props: {
  projects: Array<vsmProject>;
  isLoading: boolean;
}): JSX.Element {
  const router = useRouter();

  const newProjectMutation = useMutation(() =>
    createProject().then((value) =>
      router.push(`/projects/${value.data.vsmProjectID}`)
    )
  );

  if (props.isLoading) {
    return (
      <div className={styles.loadingVSMCardContainer}>
        <div
          className={styles.createCard}
          onClick={() => newProjectMutation.mutate()}
        >
          <Icon data={add} title="add" />
          <p>Create new</p>
        </div>
        {nineteenSomethings.map((e) => (
          <WashOutFilter key={e}>
            <LoadingVSMCard />
          </WashOutFilter>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.vsmCardContainer}>
      <div
        className={styles.createCard}
        onClick={() => newProjectMutation.mutate()}
      >
        <Icon data={add} title="add" />
        <p>Create new</p>
      </div>
      {props.projects.map((vsm: vsmProject) => (
        <VSMCard key={vsm.vsmProjectID} vsm={vsm} />
      ))}
    </div>
  );
}
