import styles from "./AddCategoryButton.module.scss";
import { Icon } from "@equinor/eds-core-react";
import { add } from "@equinor/eds-icons";
import React from "react";

export function AddCategoryButton(props: { onClickHandler }): JSX.Element {
  return (
    <div className={styles.addCategoryButton} onClick={props.onClickHandler}>
      <Icon data={add} />
      <p>Add category</p>
    </div>
  );
}
