import React, { useState } from "react";
import { Layouts } from "../../../../layouts/LayoutWrapper";
import { vsmTaskTypes } from "../../../../types/vsmTaskTypes";
import { taskObject } from "../../../../interfaces/taskObject";
import { taskCategory } from "../../../../interfaces/taskCategory";
import { TaskSection } from "../../../../components/taskSection";
import { CategorySection } from "../../../../components/CategorySection";
import { ImprovedEdsCheckbox } from "../../../../components/ImprovedEdsCheckbox";

export default function CategoriesPage(): JSX.Element {
  const [categories, setCategories] = useState([]);

  const [problemChecked, setProblemChecked] = useState(true);
  const [ideaChecked, setIdeaChecked] = useState(true);
  const [questionChecked, setQuestionChecked] = useState(true);

  function allSelectedCategoriesAreInTask(
    checkedCategories: Array<taskCategory>,
    t: taskObject
  ) {
    let shouldShow = true;
    checkedCategories.forEach((category) => {
      const exists = t.categories.some((c) => c.id === category.id);
      if (!exists) shouldShow = false;
    });
    return shouldShow;
  }

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
    return selectedCategories.length
      ? taskTypeIsChecked(t) &&
          allSelectedCategoriesAreInTask(selectedCategories, t)
      : taskTypeIsChecked(t);
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
        <CategorySection
          categories={categories}
          setCategories={setCategories}
          toggleSelection={toggleSelection}
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
