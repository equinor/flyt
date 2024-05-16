import { useEffect, useState } from "react";
import { duplicateProject, getProject } from "../../../services/projectApi";
import { useMutation, useQuery } from "react-query";
import { Layouts } from "../../../layouts/LayoutWrapper";
import { useRouter } from "next/router";
import { useProjectId } from "../../../hooks/useProjectId";

export default function DuplicatePage() {
  const router = useRouter();
  const { projectId } = useProjectId();

  const {
    data: project,
    isLoading,
    error,
  } = useQuery(["project", projectId], () => getProject(projectId));

  const [statusMessage, setStatusMessage] = useState("");
  const newProjectMutation = useMutation((projectId: number) =>
    duplicateProject(projectId).then((value) => {
      return router.replace(`/process/${value}`);
    })
  );

  useEffect(() => {
    if (project) {
      setStatusMessage("Creating new process");
      newProjectMutation.mutate(project.vsmProjectID);
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
