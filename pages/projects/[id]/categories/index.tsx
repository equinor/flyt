import React, { useEffect, useState } from "react";
import { Layouts } from "../../../../layouts/LayoutWrapper";
import styles from "./categories.module.scss";
import { useQuery, useQueryClient } from "react-query";
import { getTasksForProject } from "../../../../services/taskApi";
import { useRouter } from "next/router";
import { unknownErrorToString } from "../../../../utils/isError";
import { InfoBox } from "../../../../components/InfoBox";
import { AddCategoryButton } from "../../../../components/AddCategoryButton";
import { DraggableCategory } from "../../../../components/DraggableCategory";
import { QipCard } from "../../../../components/QipCard";
import { io } from "socket.io-client";

export default function CategoriesPage(): JSX.Element {
  const router = useRouter();
  const { id } = router.query;

  // const [taskType, setTaskType] = useState(1);
  // const {
  //   data: tasks,
  //   isLoading,
  //   error,
  // } = useQuery(["tasks", id, taskType], () =>
  //   getTasksForProjectWithType(id, taskType)
  // );
  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery(["tasks", id], () => getTasksForProject(id));

  const [categories, setCategories] = useState([]);

  if (error) {
    return <p>{unknownErrorToString(error)}</p>;
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.categoriesWrap}>
        <p className={styles.header}>Categories</p>
        <InfoBox />
        <AddCategoryButton
          onClickHandler={() =>
            setCategories([...categories, `Category ${categories.length + 1}`])
          }
        />
        {categories.map((category) => (
          <DraggableCategory key={category} text={category} />
        ))}
      </div>

      <div>
        {/*<SelectTaskType onSelect={(e: number) => setTaskType(e)} />*/}
        <div className={styles.qipSection}>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            tasks
              ?.sort((a, b) => a.fkTaskType - b.fkTaskType)
              .map((task) => (
                <QipCard
                  onClick={() =>
                    router.push(`/projects/${id}/${task.vsmTaskID}`)
                  }
                  key={task.vsmTaskID}
                  task={task}
                />
              ))
          )}
        </div>
      </div>
    </div>
  );
}

CategoriesPage.layout = Layouts.Default;
CategoriesPage.auth = true;
