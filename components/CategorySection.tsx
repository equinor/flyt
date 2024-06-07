import { useQuery } from "react-query";
import { getTaskCategories } from "@/services/taskCategoriesApi";
import { Dispatch, SetStateAction, useEffect } from "react";
import styles from "./CategorySection.module.scss";
import { CategoryHelpers } from "./CategoryHelpers";
import { AddCategoryButton } from "./AddCategoryButton";
import { unknownErrorToString } from "@/utils/isError";
import { DraggableCategory } from "./DraggableCategory";
import { useProjectId } from "@/hooks/useProjectId";
import { TaskCategory } from "@/types/TaskCategory";

export function CategorySection(props: {
  setCategories: Dispatch<SetStateAction<TaskCategory[]>>;
  categories: any[];
}) {
  const { categories, setCategories } = props;
  const { projectId } = useProjectId();

  const {
    data: taskCategories,
    isLoading: isLoadingCategories,
    error: errorCategories,
  } = useQuery(["taskCategories", projectId], () =>
    getTaskCategories(projectId)
  );

  useEffect(() => {
    if (!isLoadingCategories && !errorCategories && taskCategories) {
      setCategories(taskCategories);
    }
  }, [taskCategories]);

  const toggleSelection = (category: any) => {
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
  };

  const renderCategories = () => {
    return isLoadingCategories ? (
      <p>Loading</p>
    ) : errorCategories ? (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1>Error</h1>
        <p>{unknownErrorToString(errorCategories)}</p>
      </div>
    ) : (
      <></>
    );
  };

  return (
    <div>
      <p className={styles.header}>Categories</p>
      <CategoryHelpers />
      <AddCategoryButton projectId={projectId} />
      <div>
        {renderCategories()}
        {categories.map((category) => (
          <DraggableCategory
            projectId={projectId}
            key={category.id}
            onClick={() => toggleSelection(category)}
            checked={category.checked}
            category={category}
          />
        ))}
      </div>
    </div>
  );
}
