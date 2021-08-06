import React from "react";
import { useRouter } from "next/router";
import { Layouts } from "../../../../layouts/LayoutWrapper";
import CategoriesPage from "../categories";
import { QipCard } from "../../../../components/QipCard";
import { useQuery } from "react-query";
import { getTask } from "../../../../services/taskApi";
import { unknownErrorToString } from "../../../../utils/isError";
import { Checkbox } from "@equinor/eds-core-react";
import { SideBarBody } from "../../../../components/SideBarBody";

export default function Category(): JSX.Element {
  const router = useRouter();
  const { id, taskId } = router.query;
  const {
    data: task,
    isLoading,
    error,
  } = useQuery(["task", id, taskId], () => getTask(id, taskId));

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{unknownErrorToString(error)}</p>;

  return (
    <div>
      <h2>Task</h2>
      <p>{task.name}</p>
      <QipCard task={task} />
      <Checkbox
        label={"Solved"}
        defaultChecked={task.solved}
        onChange={(e) => {
          //todo;  mutate checked state
          console.log(e.target);
        }}
      />
      <p>{task.solvedDate}</p>
      <h2>Links</h2>
      {task.objects.some((o) => o.vsmObjectType)
        ? task.objects.map((o) => {
            return (
              <SideBarBody
                key={o.vsmObjectID}
                selectedObject={o}
                onChangeName={(e) => console.log(e)}
                onChangeRole={(e) => console.log(e)}
                onChangeTime={(e) => console.log(e)}
                onChangeTimeDefinition={(e) => console.log(e)}
                setShowNewTaskSection={(e) => console.log(e)}
                canEdit={false}
              />
            );
          })
        : task.objects.map((o) => <p key={o.vsmObjectID}>{o.name}</p>)}
    </div>
  );
}

CategoriesPage.layout = Layouts.Default;
Category.auth = true;
