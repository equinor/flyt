import React, { useState } from "react";
import { Layouts } from "../../../../layouts/LayoutWrapper";
import { vsmTaskTypes } from "../../../../types/vsmTaskTypes";
import { taskObject } from "../../../../interfaces/taskObject";
import { TaskSection } from "../../../../components/taskSection";
import { CategorySection } from "../../../../components/CategorySection";
import { CheckboxImproved } from "../../../../components/CheckboxImproved";
import { useRouter } from "next/router";
import { ButtonNavigateToProcess } from "../../../../components/ButtonNavigateToProcess";
import { Button, Dialog, Scrim, Typography } from "@equinor/eds-core-react";

export default function CategoriesPage(): JSX.Element {
  const [categories, setCategories] = useState([]);

  const [problemChecked, setProblemChecked] = useState(true);
  const [ideaChecked, setIdeaChecked] = useState(true);
  const [questionChecked, setQuestionChecked] = useState(true);
  const [riskChecked, setRiskChecked] = useState(true);
  const [visibleScrim, setVisibleScrim] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  const taskTypeIsChecked = (t: taskObject) => {
    switch (t.taskType.vsmTaskTypeID) {
      case vsmTaskTypes.problem:
        return problemChecked;
      case vsmTaskTypes.question:
        return questionChecked;
      case vsmTaskTypes.idea:
        return ideaChecked;
      // case vsmTaskTypes.risk:
      //   return riskChecked;
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
        <CheckboxImproved
          isChecked={problemChecked}
          setIsChecked={setProblemChecked}
          label={"Problem"}
        />
        <CheckboxImproved
          setIsChecked={setQuestionChecked}
          isChecked={questionChecked}
          label={"Question"}
        />
        <CheckboxImproved
          setIsChecked={setIdeaChecked}
          isChecked={ideaChecked}
          label={"Idea"}
        />
        <CheckboxImproved
          setIsChecked={setRiskChecked}
          isChecked={riskChecked}
          label={"Risk"}
        />
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          top: 64,
          height: "calc(100vh - 64px)",
        }}
      >
        <div
          style={{
            overflowY: "auto",
            padding: 12,
            backgroundColor: "white",
          }}
        >
          <ButtonNavigateToProcess />
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
    </>
  );
}

CategoriesPage.layout = Layouts.Canvas;
CategoriesPage.auth = true;
