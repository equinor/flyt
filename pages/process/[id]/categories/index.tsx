import { useState } from "react";
import { Layouts } from "@/layouts/LayoutWrapper";
import { TaskTypes } from "@/types/TaskTypes";
import { Task } from "@/types/Task";
import { TaskSection } from "@/components/TaskSection";
import { CategorySection } from "@/components/CategorySection";
import { CheckboxImproved } from "@/components/CheckboxImproved";
import { ButtonNavigateToProcess } from "@/components/ButtonNavigateToProcess";
import Head from "next/head";
import { useQuery } from "react-query";
import { getProject } from "@/services/projectApi";
import { useProjectId } from "@/hooks/useProjectId";
import { TaskCategory } from "@/types/TaskCategory";
import { getProjectName } from "@/utils/getProjectName";
import { ExportButton } from "@/components/ExportCategory/ExportButton";

export default function CategoriesPage(): JSX.Element {
  const { projectId } = useProjectId();
  const { data: project } = useQuery(["project", projectId], () =>
    getProject(projectId)
  );
  const projectTitle = getProjectName(project);

  const [categories, setCategories] = useState<TaskCategory[]>([]);

  const [problemChecked, setProblemChecked] = useState(true);
  const [ideaChecked, setIdeaChecked] = useState(true);
  const [questionChecked, setQuestionChecked] = useState(true);
  const [riskChecked, setRiskChecked] = useState(true);

  const taskTypeIsChecked = (t: Task) => {
    switch (t.type) {
      case TaskTypes.Problem:
        return problemChecked;
      case TaskTypes.Question:
        return questionChecked;
      case TaskTypes.Idea:
        return ideaChecked;
      case TaskTypes.Risk:
        return riskChecked;
      default:
        return false;
    }
  };

  const getFilter = (t: Task) => {
    const selectedCategories = categories.filter(
      (category) => category.checked
    );
    // Do not display if checkbox is not checked
    if (!taskTypeIsChecked(t)) return false;
    // Display it if checkbox is checked but no categories are selected.
    if (!selectedCategories.length) return true;
    // If task contains a category that is selected, display it!
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return t.category.some((taskCategory) =>
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
          label={"Problems"}
        />
        <CheckboxImproved
          setIsChecked={setQuestionChecked}
          isChecked={questionChecked}
          label={"Questions"}
        />
        <CheckboxImproved
          setIsChecked={setIdeaChecked}
          isChecked={ideaChecked}
          label={"Ideas"}
        />
        <CheckboxImproved
          setIsChecked={setRiskChecked}
          isChecked={riskChecked}
          label={"Risks"}
        />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{projectTitle} - Categorisation</title>
      </Head>
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingRight: "24px",
            }}
          >
            <FilterCheckBoxes />
            <ExportButton
              problemChecked={problemChecked}
              ideaChecked={ideaChecked}
              questionChecked={questionChecked}
              riskChecked={riskChecked}
            />
          </div>
          <TaskSection filterFunction={getFilter} />
        </div>
      </div>
    </>
  );
}

CategoriesPage.layout = Layouts.Canvas;
CategoriesPage.auth = true;
