import styles from "./AddCategoryButton.module.scss";
import { Button, Icon, Input } from "@equinor/eds-core-react";
import { add, check } from "@equinor/eds-icons";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { taskCategory } from "../interfaces/taskCategory";
import { postTaskCategory } from "../services/taskCategoriesApi";
import { ErrorScrim } from "./ErrorScrim";

export function AddCategoryButton(props: { projectId }): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [visibleScrim, setVisibleScrim] = useState(false);
  const [STATE_EDIT, SET_STATE_EDIT] = useState(false);
  const [categoryDescription, setcategoryDescription] = useState("");

  const queryClient = useQueryClient();
  const getCategories = () => {
    queryClient
      .invalidateQueries(["taskCategories", props.projectId])
      .then(() => {
        setIsLoading(false);
      });
  };

  const newTaskCategoryMutation = useMutation(
    (category: taskCategory) => {
      setIsLoading(true);
      return postTaskCategory(props.projectId, {
        description: category.description,
        fkProject: props.projectId,
      });
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
            //Save text and exit edit-mode
            const description = categoryDescription.trim();
            if (description)
              newTaskCategoryMutation.mutate({
                description,
                fkProject: props.projectId,
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
                onChange={(e) => setcategoryDescription(e.target.value)}
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
