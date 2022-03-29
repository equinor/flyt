import React, { useEffect, useState } from "react";
import { createProject, getProject } from "../../../services/projectApi";
import { useMutation, useQuery } from "react-query";

import { Layouts } from "../../../layouts/LayoutWrapper";
import { debounce } from "../../../utils/debounce";
import { getProjectAsCleanJsonWithoutQIPs } from "../../../utils/DownloadJSON";
import { useRouter } from "next/router";
import { vsmProject } from "../../../interfaces/VsmProject";

export default function DuplicatePage() {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: project,
    isLoading,
    error,
  } = useQuery(["project", id], () => getProject(id));

  const [statusMessage, setStatusMessage] = useState("");
  const newProjectMutation = useMutation((project: vsmProject) =>
    createProject(project).then((value) =>
      router.replace(`/process/${value.data.vsmProjectID}`)
    )
  );

  useEffect(() => {
    if (project) {
      setStatusMessage("Preparing process");
      const json = getProjectAsCleanJsonWithoutQIPs(
        project,
        `${!!project.name ? project.name : "Untitled process"} (Duplicate of ${
          project.vsmProjectID
        })`,
        project.vsmProjectID
      );
      if (json) {
        setStatusMessage("Creating new process");
        debounce(
          //Hack to stop sending multiple requests when the project-object changes
          () => newProjectMutation.mutate(json),
          1000,
          "CreateNewProject"
        );
      }
    }
  }, [project]);

  function Progress() {
    if (isLoading) return <h1>Fetching process</h1>;
    if (error) return <h1>Failed to fetch process</h1>;
    return <h1>{statusMessage}</h1>;
  }

  return (
    <div
      style={{
        textAlign: "center",
      }}
    >
      <Progress />
    </div>
  );
}

DuplicatePage.layout = Layouts.Default;
DuplicatePage.auth = true;
