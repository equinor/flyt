import React, { useEffect, useState } from "react";
import { Layouts } from "../../../../layouts/LayoutWrapper";
import { vsmTaskTypes } from "../../../../types/vsmTaskTypes";
import { taskObject } from "../../../../interfaces/taskObject";
import { TaskSection } from "../../../../components/taskSection";
import { CategorySection } from "../../../../components/CategorySection";
import { ImprovedEdsCheckbox } from "../../../../components/ImprovedEdsCheckbox";
import { useRouter } from "next/router";
import { Button } from "@equinor/eds-core-react";

export default function CategoriesPage(): JSX.Element {
  const [categories, setCategories] = useState([]);

  const [problemChecked, setProblemChecked] = useState(true);
  const [ideaChecked, setIdeaChecked] = useState(true);
  const [questionChecked, setQuestionChecked] = useState(true);

  const router = useRouter();
  const { id } = router.query;

  function navigateToCanvas() {
    router.push(`/projects/${id}`);
  }

  useEffect(() => {
    document.addEventListener("keydown", (event) => {
      if (event.code === "Escape") {
        navigateToCanvas();
      }
    });
  }, []);

  const taskTypeIsChecked = (t: taskObject) => {
    switch (t.taskType.vsmTaskTypeID) {
      case vsmTaskTypes.problem:
        return problemChecked;
      case vsmTaskTypes.question:
        return questionChecked;
      case vsmTaskTypes.idea:
        return ideaChecked;
      default:
        return false;
    }
  };

  const getFilter = (t: taskObject) => {
    const selectedCategories = categories.filter(
      (category) => category.checked
    );
    // Do not display if checkbox is not checked
    if (!taskTypeIsChecked(t)) return false;
    // Display it if checkbox is checked but no categories are selected.
    if (!selectedCategories.length) return true;
    // If task contains a category that is selected, display it!
    return t.categories.some((taskCategory) =>
      selectedCategories.some(
        (selectedCategory) => selectedCategory.id === taskCategory.id
      )
    );
  };

  function FilterCheckBoxes() {
    return (
      <div
        style={{
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 12,
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        <ImprovedEdsCheckbox
          isChecked={problemChecked}
          setIsChecked={setProblemChecked}
          label={"Problem"}
        />
        <ImprovedEdsCheckbox
          setIsChecked={setIdeaChecked}
          isChecked={ideaChecked}
          label={"Idea"}
        />
        <ImprovedEdsCheckbox
          setIsChecked={setQuestionChecked}
          isChecked={questionChecked}
          label={"Question"}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        top: 64,
        height: "calc(100vmin - 64px)",
      }}
    >
      <div
        style={{
          overflowY: "auto",
          padding: 12,
          backgroundColor: "white",
        }}
      >
        <Button onClick={() => navigateToCanvas()}>Go to Canvas</Button>
        <CategorySection
          categories={categories}
          setCategories={setCategories}
        />
      </div>
      <div
        style={{
          flex: 1,
          backgroundColor: "#f7f7f7",
          overflowY: "scroll",
        }}
      >
        <FilterCheckBoxes />
        <TaskSection filterFunction={getFilter} />
      </div>
    </div>
  );
}

CategoriesPage.layout = Layouts.Canvas;
CategoriesPage.auth = true;
