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
  newTaskCategory,
  patchTaskCategory,
} from "../services/taskCategoriesApi";
import { taskCategory } from "../interfaces/taskCategory";

export function DraggableCategory(props: {
  category: taskCategory;
  onClick: () => void;
  checked: boolean;
  projectId: number | string | string[];
}): JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef();
  const [categoryName, setCategoryName] = useState(`${props.category.name}`);
  const [editText, setEditText] = useState(() => !props.category.id);
  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();
  const newTaskCategoryMutation = useMutation(
    (category: taskCategory) => {
      setIsLoading(true);
      return newTaskCategory({
        name: category.name,
        fkProject: props.projectId,
      });
    },
    {
      onSuccess: () => queryClient.invalidateQueries(),
      onSettled: () => setIsLoading(false),
    }
  );
  const patchTaskCategoryMutation = useMutation(
    (category: taskCategory) => {
      setIsLoading(true);
      return patchTaskCategory({ name: category.name, id: category.id });
    },
    {
      onSuccess: () => queryClient.invalidateQueries(),
      onSettled: () => setIsLoading(false),
    }
  );
  const deleteTaskCategoryMutation = useMutation(
    (category: taskCategory) => {
      setIsLoading(true);
      return deleteTaskCategory(category.id);
    },
    {
      onSuccess: () => queryClient.invalidateQueries(),
      onSettled: () => setIsLoading(false),
    }
  );

  const color = getColor(categoryName);

  function saveText() {
    //Save or update text and exit edit-mode
    const name = categoryName.trim();
    const isNew = !props.category.id;
    !!name && isNew
      ? newTaskCategoryMutation.mutate({
          name: name,
        })
      : patchTaskCategoryMutation.mutate({
          name: name,
          id: props.category.id,
        });
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
            placeholder={props.category.name}
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
        <Menu.Item
          onClick={() => {
            setEditText(true);
          }}
        >
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
