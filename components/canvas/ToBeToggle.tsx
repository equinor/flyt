import { Switch } from "@equinor/eds-core-react";
import React from "react";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "react-query";
import { createProject, getProject } from "../../services/projectApi";
import { vsmProject } from "../../interfaces/VsmProject";
import { projectTemplatesV1 } from "../../assets/projectTemplatesV1";
import { getMyAccess } from "utils/getMyAccess";
import { useAccount, useMsal } from "@azure/msal-react";

export const ToBeToggle = (): JSX.Element => {
  const router = useRouter();
  const { id } = router.query;

  const { data: project } = useQuery(["project", id], () => getProject(id));

  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const myAccess = getMyAccess(project, account);
  const userCanEdit = myAccess === "Admin" || myAccess === "Contributor";

  const newProjectMutation = useMutation(() => {
    return createProject({
      currentProcessId: parseInt(`${id}`),
      ...projectTemplatesV1.defaultProject,
    } as vsmProject).then((value) =>
      router.push(`/process/${value.data.vsmProjectID}`)
    );
  });

  return (
    <div
      style={{
        position: "absolute",
        right: 0,
        margin: 12,
        padding: 12,
        backgroundColor: "white",
        borderRadius: 4,
      }}
    >
      <Switch
        label={"To-be process"}
        // Note:
        // - currentProcessId is only defined on a "To-be" process
        // - toBeProcessID is only defined on the "Current" proccess
        // We may use this information to know what type of process we are currently viewing.

        checked={!!project?.currentProcessId} // currentProcessId is null if we are on the "Current"-process.
        onChange={() => {
          if (project.toBeProcessID) {
            // We are currently on the "Current"-process and there exists a "To-be" process
            // Let's navigate to it
            router.push(`/process/${project.toBeProcessID}`);
          } else if (project.currentProcessId) {
            // We are on a "To-be" process and there exists a "Current" process
            // Let's navigate to it
            router.push(`/process/${project.currentProcessId}`);
          } else {
            // We are on a "Current" process, but there is no "To-be" process created
            // Let's create one and navigate to it
            newProjectMutation.mutate();
          }
        }}
        disabled={
          !userCanEdit && !(project?.toBeProcessID || project?.currentProcessId)
        }
        size={"small"}
      />
    </div>
  );
};
