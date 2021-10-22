import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { getTaskCategories } from "../services/taskCategoriesApi";
import React, { useEffect } from "react";
import styles from "./CategorySection.module.scss";
import { CategoryHelpers } from "./CategoryHelpers";
import { AddCategoryButton } from "./AddCategoryButton";
import { unknownErrorToString } from "../utils/isError";
import { DraggableCategory } from "./DraggableCategory";

export function CategorySection(props: {
  setCategories: (value: ((prevState: any[]) => any[]) | any[]) => void;
  categories: any[];
}) {
  const { categories, setCategories } = props;
  const router = useRouter();
  const { id } = router.query;

  const {
    data: taskCategories,
    isLoading: isLoadingCategories,
    error: errorCategories,
  } = useQuery(["taskCategories", id], () => getTaskCategories(id));

  useEffect(() => {
    if (!isLoadingCategories && !errorCategories && taskCategories) {
      setCategories(taskCategories);
    }
  }, [taskCategories]);

  const toggleSelection = (category) => {
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

  return (
    <div>
      <p className={styles.header}>Categories</p>
      <CategoryHelpers />
      <AddCategoryButton projectId={id} />
      <div>
        {isLoadingCategories && <p>Loading</p>}
        {!isLoadingCategories && errorCategories && (
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
        )}
        {categories.map((category) => (
          <DraggableCategory
            projectId={id}
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
