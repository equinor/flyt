import styles from "./AddCategoryButton.module.scss";
import { Button, Icon, Input } from "@equinor/eds-core-react";
import { add, check } from "@equinor/eds-icons";
import { ChangeEvent, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { TaskCategory } from "@/types/TaskCategory";
import { postTaskCategory } from "@/services/taskCategoriesApi";
import { ErrorScrim } from "./ErrorScrim";

export function AddCategoryButton(props: { projectId: string }) {
  const [errorMessage, setErrorMessage] = useState<string[] | null>(null);
  const [visibleScrim, setVisibleScrim] = useState(false);
  const [STATE_EDIT, SET_STATE_EDIT] = useState(false);
  const [categoryName, setcategoryName] = useState("");

  const queryClient = useQueryClient();
  const getCategories = () => {
    void queryClient.invalidateQueries(["taskCategories", props.projectId]);
  };

  const newTaskCategoryMutation = useMutation(
    (category: TaskCategory) => {
      return postTaskCategory(props.projectId, category);
    },
    {
      onSettled: () => {
        SET_STATE_EDIT(false);
        getCategories();
      },
      onError: (error: {
        response: { status: number; data: { userMessage?: string } };
      }) => {
        const status = error?.response?.status;
        const userMessage = error?.response?.data?.userMessage;
        let errorMessage: string[];
        if (status === 409) {
          errorMessage = [
            `Name must be unique.`,
            "Cannot create a category with the same name as another.",
          ];
        } else {
          errorMessage = [`Error ${status}`, `${userMessage}`];
        }
        setErrorMessage(errorMessage);
        setVisibleScrim(true);
      },
    }
  );

  if (STATE_EDIT) {
    return (
      <div className={styles.addCategoryButton}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const name = categoryName.trim();
            if (name)
              newTaskCategoryMutation.mutate({
                id: 0,
                name,
                fkProject: props.projectId,
                checked: false,
              });
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <label hidden htmlFor="newCategoryInput">
                New category name
              </label>
              <Input
                autoFocus
                placeholder={"New category name"}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setcategoryName(e.target.value)
                }
                required={true}
                type="text"
                id="newCategoryInput"
              />
            </div>
            <Button type={"submit"} variant={"ghost_icon"}>
              <Icon data={check} />
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <>
      <ErrorScrim
        visible={visibleScrim}
        handleClose={() => setVisibleScrim(false)}
        title={errorMessage?.[0]}
        messages={errorMessage?.slice(1)}
      />
      <button
        className={styles.addCategoryButton}
        onClick={() => SET_STATE_EDIT(true)}
      >
        <Icon data={add} />
        <p>Add category</p>
      </button>
    </>
  );
}
