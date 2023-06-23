import { getColor } from "../utils/getColor";
import styles from "./DraggableCategory.module.scss";
import { ColorDot } from "./ColorDot";
import React, { useRef, useState } from "react";
import { Button, Icon, Input, Menu } from "@equinor/eds-core-react";
import {
  check,
  delete_to_trash,
  edit,
  more_vertical,
} from "@equinor/eds-icons";
import colors from "../theme/colors";
import { useMutation, useQueryClient } from "react-query";
import {
  deleteTaskCategory,
  updateTaskCategory,
} from "../services/taskCategoriesApi";
import { taskCategory } from "../interfaces/taskCategory";
import { ErrorScrim } from "./ErrorScrim";

export function DraggableCategory(props: {
  category: taskCategory;
  onClick: () => void;
  checked: boolean;
  projectId: string | string[];
}): JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef();
  const [categoryName, setCategoryName] = useState(
    `${props.category.description}`
  );
  const [editText, setEditText] = useState(() => !props.category.id);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleScrim, setVisibleScrim] = useState(false);
  const [errorMessage, setErrorMessage] = useState([null]);
  const queryClient = useQueryClient();

  const getCategories = () => {
    queryClient
      .invalidateQueries(["taskCategories", props.projectId])
      .then(() => {
        setIsLoading(false);
      });
    setCategoryName(props.category.description);
  };

  const patchTaskCategoryMutation = useMutation(
    (category: taskCategory) => {
      setIsLoading(true);
      return updateTaskCategory(props.projectId, {
        description: category.description,
        id: category.id,
      });
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries(["tasks", props.projectId]).then(() => {
          setIsLoading(false);
        });
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
            "Cannot name a category the same as another.",
          ];
        } else {
          errorMessage = [`Error ${status}`, `${userMessage}`];
        }
        setErrorMessage(errorMessage);
        setVisibleScrim(true);
        getCategories();
      },
    }
  );

  const deleteTaskCategoryMutation = useMutation(
    (category: taskCategory) => {
      setIsLoading(true);
      return deleteTaskCategory(props.projectId, category.id);
    },
    {
      onSettled: () => getCategories(),
      onError: (error: { response: { status: number } }, taskCategory) => {
        const statusCode = error?.response?.status;
        let errorMessage = [];
        if (statusCode === 409) {
          //Error 409-Conflict is given when you try to delete something that is still linked to a project
          errorMessage = [
            `Could not delete category "${taskCategory.description}".`,
            "Make sure that it is not added to any PQIs.",
          ];
        } else {
          errorMessage = [`Error ${statusCode}`];
        }
        setErrorMessage(errorMessage);
        setVisibleScrim(true);
      },
    }
  );

  const color = getColor(categoryName);

  function saveText() {
    //Save or update text and exit edit-mode
    const name = categoryName.trim();
    if (!!name) {
      patchTaskCategoryMutation.mutate({
        description: name,
        id: props.category.id,
      });
    }
    setEditText(false);
  }

  function deleteCategory() {
    deleteTaskCategoryMutation.mutate(props.category);
  }

  if (isLoading) {
    return (
      <div
        style={{ border: props.checked && `${color} 2px solid` }}
        className={styles.category}
      >
        <p>Loading...</p>
      </div>
    );
  }

  if (editText) {
    return (
      <>
        <div
          style={{ border: props.checked && `${color} 2px solid` }}
          className={styles.category}
        >
          <Input
            autoFocus
            defaultValue={categoryName}
            placeholder={props.category.description}
            onClick={(event) => event.stopPropagation()}
            onChange={(e) => setCategoryName(e.target.value)}
            onKeyDown={(e) => {
              if (e.code === "Enter") saveText();
            }}
          />
          <Button variant={"ghost_icon"} onClick={saveText} ref={menuButtonRef}>
            <Icon data={check} />
          </Button>
        </div>
      </>
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
      <div
        style={{ border: props.checked && `${color} 2px solid` }}
        draggable={true}
        onDragStart={(ev) => {
          ev.dataTransfer.setData(
            "text/plain",
            JSON.stringify({
              text: categoryName,
              id: props.category.id,
              color: color,
            })
          );
        }}
        className={styles.category}
      >
        <span onClick={props.onClick} className={styles.categoryClickWrapper}>
          <ColorDot color={color} />
          <p className={styles.categoryText}>{categoryName}</p>
        </span>
        <Button
          variant={"ghost_icon"}
          onClick={() => setMenuOpen(true)}
          ref={menuButtonRef}
        >
          <Icon data={more_vertical} />
        </Button>
      </div>
      <Menu
        open={menuOpen}
        anchorEl={menuButtonRef.current}
        aria-labelledby="anchor-default"
        id="menu-default"
        onClose={() => setMenuOpen(false)}
        placement="bottom-end"
      >
        <Menu.Item onClick={() => setEditText(true)}>
          <Icon data={edit} />
          Rename
        </Menu.Item>
        <Menu.Item
          style={{ color: colors.ERROR }}
          onClick={() => deleteCategory()}
        >
          <Icon data={delete_to_trash} />
          Delete
        </Menu.Item>
      </Menu>
    </>
  );
}
