import React, { useState } from "react";
import { Layouts } from "../../../../layouts/LayoutWrapper";
import styles from "./categories.module.scss";
import { useQuery } from "react-query";
import { getTasksForProject } from "../../../../services/taskApi";
import { useRouter } from "next/router";
import { unknownErrorToString } from "../../../../utils/isError";
import { InfoBox } from "../../../../components/InfoBox";
import { AddCategoryButton } from "../../../../components/AddCategoryButton";
import { DraggableCategory } from "../../../../components/DraggableCategory";
import { QipCard } from "../../../../components/QipCard";
import { Button, Checkbox } from "@equinor/eds-core-react";
import { vsmTaskTypes } from "../../../../types/vsmTaskTypes";
import { taskObject } from "../../../../interfaces/taskObject";
import Image from "next/image";
import useLocalStorage from "../../../../hooks/useLocalStorage";
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
  const [problemChecked, setProblemChecked] = useState(true);
  const [ideaChecked, setIdeaChecked] = useState(true);
  const [questionChecked, setQuestionChecked] = useState(true);

  const [showDragHelper, setShowDragHelper] = useLocalStorage(
    "showDragHelper",
    true
  );
  const [showCategoryClickHelper, setShowCategoryClickHelper] = useLocalStorage(
    "showCategoryClickHelper",
    true
  );

  if (error) {
    return <p>{unknownErrorToString(error)}</p>;
  }

  const categoryIsChecked = (categoryName: string) => {
    return categories.some(
      (category) => categoryName === category.name && category.checked
    );
  };

  const getFilter = (t: taskObject) => {
    //Todo: Add functionality to filter on category as well...
    // NB: Show all categories if none are checked.
    if (categories.some((category) => category.checked)) {
      if (!t.category?.some((c) => categoryIsChecked(c.name))) return false;
    }
    switch (t.taskType.vsmTaskTypeID) {
      case vsmTaskTypes.problem:
        return problemChecked;
      case vsmTaskTypes.question:
        return questionChecked;
      case vsmTaskTypes.idea:
        return ideaChecked;
    }
    return false;
  };

  function toggleSelection(category) {
    const newCategories = categories.map((c) => {
      if (c === category) {
        return {
          ...category,
          checked: !category.checked,
        };
      }
      return c;
    });
    setCategories(newCategories);
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.categoriesWrap}>
        <p className={styles.header}>Categories</p>
        {/*<Button*/}
        {/*  onClick={() => {*/}
        {/*    setShowDragHelper(true);*/}
        {/*    setShowCategoryClickHelper(true);*/}
        {/*  }}*/}
        {/*>*/}
        {/*  Reset helper dialogs*/}
        {/*</Button>*/}
        {showDragHelper && (
          <InfoBox onClose={() => setShowDragHelper(false)}>
            <Image
              src={"/gifs/categoryDrag.gif"}
              alt="Showing how to add a category to a QIP"
              unoptimized={true} //Trouble with optimizing gifs
              width={800}
              height={321}
              // layout={"fill"}
            />
            <p style={{ zIndex: 1 }}>
              Drag a category into one or more of the problems, ideas or
              questions.
            </p>
          </InfoBox>
        )}
        {showCategoryClickHelper && (
          <InfoBox onClose={() => setShowCategoryClickHelper(false)}>
            <p>Click on a category to focus on it</p>
          </InfoBox>
        )}

        <AddCategoryButton
          onClickHandler={() =>
            setCategories([
              ...categories,
              { name: `Category ${categories.length + 1}`, checked: false },
            ])
          }
        />
        <div className={styles.categoriesDraggableSection}>
          {categories.map((category) => (
            <DraggableCategory
              key={category.name}
              onClick={() => toggleSelection(category)}
              text={category.name}
              checked={category.checked}
            />
          ))}
        </div>
      </div>

      <div>
        <div style={{ marginLeft: 48, marginTop: 24 }}>
          <Checkbox
            label={"Problems"}
            checked={problemChecked}
            onClick={() => setProblemChecked((p) => !p)}
          />
          <Checkbox
            label={"Ideas"}
            checked={ideaChecked}
            onClick={() => setIdeaChecked((p) => !p)}
          />
          <Checkbox
            label={"Questions"}
            checked={questionChecked}
            onClick={() => setQuestionChecked((p) => !p)}
          />
        </div>
        {/*<SelectTaskType onSelect={(e: number) => setTaskType(e)} />*/}
        <div className={styles.qipSection}>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            tasks
              ?.filter(getFilter)
              .sort((a, b) => a.fkTaskType - b.fkTaskType)
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
